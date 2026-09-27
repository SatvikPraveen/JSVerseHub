import {
  ContentRegistry,
  contentRegistry,
  normalizeConceptModule,
  normalizeExamples,
  normalizeExercise,
  normalizeQuiz,
  isSectionLike
} from '../../src/engine/contentRegistry';

describe('ContentRegistry normalisation', () => {
  test('isSectionLike recognises prose sections and function bundles', () => {
    expect(isSectionLike({ concept: 'X', explanation: 'y' })).toBe(true);
    expect(isSectionLike({ title: 'X', examples: {} })).toBe(true);
    expect(isSectionLike({ a() {}, b() {}, c: 1 })).toBe(true);
    expect(isSectionLike({ title: 'Config', difficulty: 'easy' })).toBe(false);
    expect(isSectionLike([])).toBe(false);
    expect(isSectionLike(null)).toBe(false);
  });

  test('normalizeExamples handles strings, functions, objects and arrays', () => {
    const section = {
      examples: {
        basic: '\n    const a = 1;\n    console.log(a);\n  ',
        run: function run() {
          return 1;
        },
        obj: { title: 'T', code: 'x', explanation: 'e' }
      },
      codeExamples: [{ title: 'C', code: 'y' }]
    };
    const out = normalizeExamples(section);
    expect(out.map(e => e.title)).toEqual(['Basic', 'Run', 'T', 'C']);
    expect(out[0].code).toBe('const a = 1;\nconsole.log(a);');
    expect(out[1].runnable).toBe(true);
    expect(out[2].explanation).toBe('e');
  });

  test('normalizeExercise maps template/tests/hints and difficulty aliases', () => {
    const ex = normalizeExercise(
      { id: 'e1', title: 'T', difficulty: 'beginner', description: 'd', template: '  code  ', tests: [{ description: 'x', check: () => true }] },
      'basics',
      0
    );
    expect(ex).toMatchObject({ id: 'e1', difficulty: 'easy', starterCode: 'code', instructions: 'd', hints: [] });
    expect(ex.tests[0].check()).toBe(true);
    expect(normalizeExercise({}, 'dom', 2).id).toBe('dom-exercise-3');
  });

  test('normalizeQuiz accepts arrays and {questions} and maps correct -> correctAnswer', () => {
    const q = normalizeQuiz([{ question: 'Q?', options: ['a', 'b'], correct: 1, explanation: 'why' }], { timeLimit: 300 });
    expect(q.questions[0]).toMatchObject({ id: 'q1', correctAnswer: 1, explanation: 'why' });
    expect(q).toMatchObject({ timeLimit: 300, passingScore: 70, totalPoints: 10 });
    expect(normalizeQuiz({ questions: [{ question: 'Q', options: ['a'], correctAnswer: 0 }] }).questions[0].correctAnswer).toBe(0);
    expect(normalizeQuiz([])).toBeNull();
    expect(normalizeQuiz(undefined)).toBeNull();
  });

  test('normalizeConceptModule builds viewer data from an ESM-style bundle', () => {
    const mod = {
      fooConfig: { title: 'Foo', description: 'About foo', difficulty: 'intermediate', estimatedTime: '1 hour', topics: ['A', 'B'], prerequisites: ['basics'] },
      alpha: { concept: 'Alpha', explanation: 'alpha explained', examples: { one: 'code1' }, keyPoints: ['k1'] },
      beta: { title: 'Beta', description: 'beta explained', examples: { two: 'code2' } },
      exercises: [{ id: 'x', title: 'X', difficulty: 'hard', description: 'do', template: 't' }],
      quiz: [{ question: 'Q', options: ['a', 'b'], correct: 0 }],
      default: { config: {}, concepts: {} }
    };
    const data = normalizeConceptModule('foo', mod, { timeLimit: 120 });
    expect(data.id).toBe('foo');
    expect(data.overview).toEqual({
      title: 'Foo',
      description: 'About foo',
      difficulty: 'Intermediate',
      estimatedTime: '1 hour',
      learningObjectives: ['Understand A', 'Understand B'],
      prerequisites: ['basics']
    });
    expect(data.sections.map(s => s.title)).toEqual(['Alpha', 'Beta']);
    expect(data.sections[0].content.examples[0]).toEqual({ title: 'One', code: 'code1' });
    expect(data.sections[0].keyPoints).toEqual(['k1']);
    expect(data.exercises[0].difficulty).toBe('hard');
    expect(data.quiz.timeLimit).toBe(120);
    expect(data.source).toBe('module');
  });

  test('normalizeConceptModule handles CommonJS helper bundles (canvas/performance style)', () => {
    const helpers = {
      draw(ctx) {
        return ctx;
      },
      clear(ctx) {
        return ctx;
      }
    };
    const mod = { conceptConfig: { title: 'Canvas', level: 'advanced', topics: { basics: helpers }, prerequisites: [] }, canvasBasics: helpers };
    const data = normalizeConceptModule('canvas', mod);
    expect(data.overview.difficulty).toBe('Advanced');
    expect(data.sections).toHaveLength(1);
    expect(data.sections[0].content.examples.map(e => e.title)).toEqual(['Draw', 'Clear']);
    expect(data.sections[0].content.examples[0].code).toContain('draw(ctx)');
    expect(data.quiz).toBeNull();
  });

  test('normalizeConceptModule returns null for non-modules', () => {
    expect(normalizeConceptModule('x', null)).toBeNull();
  });
});

describe('ContentRegistry loading', () => {
  test('lazy-loads, caches and de-duplicates in-flight loads', async () => {
    const loader = jest.fn(() => Promise.resolve({ cfg: { title: 'T', topics: [] }, s: { concept: 'S', explanation: 'e' } }));
    const reg = new ContentRegistry({ t: loader });
    const [a, b] = await Promise.all([reg.load('t'), reg.load('t')]);
    expect(a).toBe(b);
    expect(loader).toHaveBeenCalledTimes(1);
    expect(await reg.load('t')).toBe(a);
    expect(reg.list()).toEqual(['t']);
    expect(reg.has('nope')).toBe(false);
    expect(await reg.load('nope')).toBeNull();
    reg.clear();
    await reg.load('t');
    expect(loader).toHaveBeenCalledTimes(2);
  });

  test('propagates loader failures and allows retry', async () => {
    let fail = true;
    const reg = new ContentRegistry({ t: () => (fail ? Promise.reject(new Error('boom')) : Promise.resolve({ s: { concept: 'S', explanation: 'e' } })) });
    await expect(reg.load('t')).rejects.toThrow('boom');
    fail = false;
    expect((await reg.load('t')).sections).toHaveLength(1);
  });

  test('every shipped concept module normalises to at least one section', async () => {
    const ids = contentRegistry.list();
    expect(ids).toHaveLength(15);
    const results = await Promise.all(ids.map(id => contentRegistry.load(id)));
    results.forEach((data, i) => {
      expect(data).not.toBeNull();
      expect(data.id).toBe(ids[i]);
      expect(data.sections.length).toBeGreaterThan(0);
      data.sections.forEach(s => {
        expect(typeof s.title).toBe('string');
        expect(Array.isArray(s.content.examples)).toBe(true);
      });
      data.exercises.forEach(e => expect(['easy', 'medium', 'hard']).toContain(e.difficulty));
    });
  }, 20000);
});
