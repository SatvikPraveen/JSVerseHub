// src/engine/contentRegistry.js - Bridges authored concept modules to the viewer
//
// The concept modules under src/concepts/* were written by hand in several
// slightly different shapes (named exports, default-export bundles, CommonJS
// objects of runnable helpers). This registry lazy-loads each module as its
// own webpack chunk and normalises it into the single shape that
// ConceptViewer renders:
//
//   { id, overview, sections[], exercises[], quiz | null, source }
//
// Everything here is pure and side-effect free except for the singleton at the
// bottom, which is what the rest of the app talks to via window.ContentRegistry.

/* eslint-disable import/no-dynamic-require, global-require */

const CONCEPT_LOADERS = {
  basics: () => import(/* webpackChunkName: "concept-basics" */ '../concepts/basics/index.js'),
  dom: () => import(/* webpackChunkName: "concept-dom" */ '../concepts/dom/index.js'),
  async: () => import(/* webpackChunkName: "concept-async" */ '../concepts/async/index.js'),
  es6: () => import(/* webpackChunkName: "concept-es6" */ '../concepts/es6/index.js'),
  oop: () => import(/* webpackChunkName: "concept-oop" */ '../concepts/oop/index.js'),
  functional: () => import(/* webpackChunkName: "concept-functional" */ '../concepts/functional/index.js'),
  patterns: () => import(/* webpackChunkName: "concept-patterns" */ '../concepts/patterns/index.js'),
  storage: () => import(/* webpackChunkName: "concept-storage" */ '../concepts/storage/index.js'),
  events: () => import(/* webpackChunkName: "concept-events" */ '../concepts/events/index.js'),
  testing: () => import(/* webpackChunkName: "concept-testing" */ '../concepts/testing/index.js'),
  security: () => import(/* webpackChunkName: "concept-security" */ '../concepts/security/index.js'),
  algorithms: () => import(/* webpackChunkName: "concept-algorithms" */ '../concepts/algorithms/index.js'),
  canvas: () => import(/* webpackChunkName: "concept-canvas" */ '../concepts/canvas/index.js'),
  api: () => import(/* webpackChunkName: "concept-api" */ '../concepts/api/index.js'),
  performance: () => import(/* webpackChunkName: "concept-performance" */ '../concepts/performance/index.js')
};

const DIFFICULTY_LABELS = {
  beginner: 'Beginner',
  easy: 'Beginner',
  intermediate: 'Intermediate',
  medium: 'Intermediate',
  advanced: 'Advanced',
  hard: 'Advanced',
  expert: 'Advanced'
};

const EXERCISE_DIFFICULTIES = {
  easy: 'easy',
  beginner: 'easy',
  medium: 'medium',
  intermediate: 'medium',
  hard: 'hard',
  advanced: 'hard',
  expert: 'hard'
};

const DEFAULT_PASSING_SCORE = 70;
const DEFAULT_POINTS_PER_QUESTION = 10;
const MAX_EXAMPLES_PER_SECTION = 12;

const isPlainObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

const dedent = text => {
  const lines = String(text).replace(/\r\n/g, '\n').split('\n');
  while (lines.length && lines[0].trim() === '') lines.shift();
  while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
  const indents = lines.filter(l => l.trim()).map(l => l.match(/^\s*/)[0].length);
  const cut = indents.length ? Math.min(...indents) : 0;
  return lines.map(l => l.slice(cut).replace(/\s+$/, '')).join('\n');
};

const humanize = key =>
  String(key)
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, c => c.toUpperCase());

const looksLikeConfig = (key, value) =>
  /config$/i.test(key) ||
  (isPlainObject(value) && ('topics' in value || 'estimatedTime' in value) && !('examples' in value));

/**
 * A "section" is any object that carries teaching prose and/or examples.
 * Objects made almost entirely of functions (canvas/performance helpers) are
 * also treated as sections: their function sources become the examples.
 */
export function isSectionLike(value) {
  if (!isPlainObject(value)) return false;
  const keys = Object.keys(value);
  if (keys.length === 0) return false;
  const hasProse = typeof value.explanation === 'string' || typeof value.description === 'string';
  const hasTitle =
    typeof value.concept === 'string' || typeof value.title === 'string' || typeof value.name === 'string';
  const hasExamples = value.examples !== undefined || Array.isArray(value.codeExamples) || isPlainObject(value.theory);
  const fnCount = keys.filter(k => typeof value[k] === 'function').length;
  const mostlyFunctions = fnCount >= 2 && fnCount >= keys.length * 0.6;
  return (hasTitle && (hasProse || hasExamples)) || mostlyFunctions;
}

function exampleFromEntry(key, value) {
  if (typeof value === 'string') {
    return { title: humanize(key), code: dedent(value) };
  }
  if (typeof value === 'function') {
    return { title: humanize(key), code: dedent(value.toString()), runnable: true };
  }
  if (isPlainObject(value)) {
    const code = value.code ?? value.example ?? value.snippet;
    if (typeof code === 'string') {
      return {
        title: value.title ?? value.name ?? humanize(key),
        code: dedent(code),
        explanation: value.explanation ?? value.description ?? undefined
      };
    }
  }
  return null;
}

/**
 * Normalise the many example encodings found in the content modules into
 * [{ title, code, explanation? }].
 */
export function normalizeExamples(section) {
  const out = [];
  const push = ex => {
    if (ex && ex.code && out.length < MAX_EXAMPLES_PER_SECTION) out.push(ex);
  };

  const { examples } = section;
  if (Array.isArray(examples)) {
    examples.forEach((ex, i) => push(exampleFromEntry(`Example ${i + 1}`, ex)));
  } else if (isPlainObject(examples)) {
    Object.entries(examples).forEach(([k, v]) => push(exampleFromEntry(k, v)));
  }

  if (Array.isArray(section.codeExamples)) {
    section.codeExamples.forEach((ex, i) => push(exampleFromEntry(`Example ${i + 1}`, ex)));
  }

  if (isPlainObject(section.theory) && Array.isArray(section.theory.concepts)) {
    section.theory.concepts.forEach(c => push(exampleFromEntry(c.name ?? 'Concept', c)));
  }

  if (out.length === 0) {
    Object.entries(section).forEach(([k, v]) => {
      if (typeof v === 'function') push(exampleFromEntry(k, v));
    });
  }

  return out;
}

export function normalizeSection(key, section) {
  const title = section.concept ?? section.title ?? section.name ?? humanize(key);
  const prose = section.explanation ?? section.description ?? section.theory?.introduction ?? '';
  const keyPoints = Array.isArray(section.keyPoints)
    ? section.keyPoints
    : Array.isArray(section.bestPractices)
    ? section.bestPractices
    : [];

  return {
    id: key,
    title,
    content: {
      description: dedent(prose),
      examples: normalizeExamples(section)
    },
    keyPoints: keyPoints.filter(p => typeof p === 'string')
  };
}

function collectSections(mod) {
  const seen = new Set();
  const sections = [];
  const visit = (key, value) => {
    if (!isPlainObject(value) || seen.has(value)) return;
    if (looksLikeConfig(key, value)) return;
    if (isSectionLike(value)) {
      seen.add(value);
      sections.push(normalizeSection(key, value));
      return;
    }
    // Containers such as `concepts: { ... }` or `topics: { ... }`
    if (['concepts', 'topics', 'sections'].includes(key)) {
      Object.entries(value).forEach(([k, v]) => visit(k, v));
    }
  };

  Object.entries(mod).forEach(([key, value]) => {
    if (key === 'default' || key === '__esModule') return;
    visit(key, value);
  });
  const config = mod.conceptConfig ?? mod.config;
  if (isPlainObject(config) && isPlainObject(config.topics)) {
    Object.entries(config.topics).forEach(([k, v]) => visit(k, v));
  }
  return sections;
}

export function normalizeExercise(raw, conceptId, index) {
  const tests = raw.tests ?? raw.testCases ?? [];
  return {
    id: raw.id ?? `${conceptId}-exercise-${index + 1}`,
    title: raw.title ?? `Exercise ${index + 1}`,
    difficulty: EXERCISE_DIFFICULTIES[String(raw.difficulty ?? '').toLowerCase()] ?? 'medium',
    description: raw.description ?? '',
    instructions: raw.instructions ?? raw.description ?? '',
    starterCode: dedent(raw.starterCode ?? raw.template ?? raw.starter ?? ''),
    solution: dedent(raw.solution ?? ''),
    hints: Array.isArray(raw.hints) ? raw.hints : [],
    tests: tests.map(t => ({
      description: t.description ?? t.assertion ?? 'Check',
      check: typeof t.check === 'function' ? t.check : null
    })),
    concepts: Array.isArray(raw.concepts) ? raw.concepts : []
  };
}

export function normalizeQuiz(raw, { timeLimit } = {}) {
  const questions = Array.isArray(raw) ? raw : Array.isArray(raw?.questions) ? raw.questions : null;
  if (!questions || questions.length === 0) return null;

  const normalised = questions
    .filter(q => q && typeof q.question === 'string' && Array.isArray(q.options))
    .map((q, i) => ({
      id: q.id ?? `q${i + 1}`,
      question: q.question,
      options: q.options,
      correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : q.correct ?? 0,
      explanation: q.explanation ?? '',
      skill: q.skill ?? q.topic ?? null
    }));
  if (normalised.length === 0) return null;

  return {
    questions: normalised,
    timeLimit: raw?.timeLimit ?? timeLimit ?? normalised.length * 60,
    passingScore: raw?.passingScore ?? DEFAULT_PASSING_SCORE,
    totalPoints: normalised.length * DEFAULT_POINTS_PER_QUESTION
  };
}

export function normalizeOverview(mod) {
  const candidates = [
    mod.conceptConfig,
    mod.config,
    ...Object.entries(mod)
      .filter(([k]) => /config$/i.test(k))
      .map(([, v]) => v)
  ];
  const config = candidates.find(c => isPlainObject(c) && Object.keys(c).length > 0) ?? {};
  const topics = Array.isArray(config.topics) ? config.topics : Object.keys(config.topics ?? {}).map(humanize);
  const objectives = config.learningObjectives ?? config.objectives ?? topics.map(t => `Understand ${t}`);
  const overview = {};
  if (config.title) overview.title = config.title;
  if (config.description) overview.description = config.description;
  const difficulty = DIFFICULTY_LABELS[String(config.difficulty ?? config.level ?? '').toLowerCase()];
  if (difficulty) overview.difficulty = difficulty;
  if (config.estimatedTime) overview.estimatedTime = config.estimatedTime;
  if (objectives.length) overview.learningObjectives = objectives;
  if (Array.isArray(config.prerequisites)) overview.prerequisites = config.prerequisites;
  return overview;
}

/**
 * Turn a raw module namespace (or CommonJS export object) into viewer data.
 */
export function normalizeConceptModule(conceptId, rawModule, options = {}) {
  if (!rawModule || typeof rawModule !== 'object') return null;
  const bundle = isPlainObject(rawModule.default) ? rawModule.default : {};
  const mod = { ...bundle, ...rawModule };
  delete mod.default;

  const rawExercises = mod.exercises ?? mod.interactiveExercises ?? bundle.exercises ?? [];
  const exercises = Array.isArray(rawExercises)
    ? rawExercises.filter(isPlainObject).map((e, i) => normalizeExercise(e, conceptId, i))
    : [];

  return {
    id: conceptId,
    overview: normalizeOverview(mod),
    sections: collectSections(mod),
    exercises,
    quiz: normalizeQuiz(mod.quiz ?? bundle.quiz, options),
    source: 'module'
  };
}

export class ContentRegistry {
  constructor(loaders = CONCEPT_LOADERS) {
    this.loaders = loaders;
    this.cache = new Map();
    this.pending = new Map();
  }

  has(conceptId) {
    return Object.prototype.hasOwnProperty.call(this.loaders, conceptId);
  }

  list() {
    return Object.keys(this.loaders);
  }

  /**
   * Load and normalise a concept. Resolves to null for unknown ids so callers
   * can fall back to generated content.
   */
  async load(conceptId, options = {}) {
    if (!this.has(conceptId)) return null;
    if (this.cache.has(conceptId)) return this.cache.get(conceptId);
    if (this.pending.has(conceptId)) return this.pending.get(conceptId);

    const promise = this.loaders[conceptId]()
      .then(raw => normalizeConceptModule(conceptId, raw, options))
      .then(data => {
        this.cache.set(conceptId, data);
        this.pending.delete(conceptId);
        return data;
      })
      .catch(error => {
        this.pending.delete(conceptId);
        throw error;
      });
    this.pending.set(conceptId, promise);
    return promise;
  }

  clear() {
    this.cache.clear();
    this.pending.clear();
  }
}

export const contentRegistry = new ContentRegistry();

if (typeof window !== 'undefined') {
  window.ContentRegistry = contentRegistry;
}

export default contentRegistry;
