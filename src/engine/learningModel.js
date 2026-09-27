// src/engine/learningModel.js - Wires the learner models into the app
//
// Composes the three research components (local analytics, SM-2 scheduler,
// Bayesian knowledge tracing) behind one facade, persisted in localStorage
// under their own keys so the existing StateManager schema is untouched.
// Exposed as window.LearningModel for the script-style components.

import { LearningAnalytics, VERBS, OBJECT_TYPES } from './learningAnalytics.js';
import { SpacedRepetitionScheduler } from './spacedRepetition.js';
import { KnowledgeTracer } from './knowledgeTracing.js';

const KEYS = {
  reviews: 'jsversehub-reviews',
  mastery: 'jsversehub-mastery'
};

function localStore(key) {
  return {
    load() {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch (_) {
        return null;
      }
    },
    save(data) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (_) {
        /* storage unavailable: keep in memory */
      }
    }
  };
}

export class LearningModel {
  constructor({ analytics, scheduler, tracer } = {}) {
    this.analytics = analytics || new LearningAnalytics();
    this.scheduler = scheduler || new SpacedRepetitionScheduler(localStore(KEYS.reviews));
    this.tracer = tracer || new KnowledgeTracer(undefined, localStore(KEYS.mastery));
    this.listeners = [];
    this.analytics.record(VERBS.INITIALIZED, { type: OBJECT_TYPES.APPLICATION, id: 'jsversehub' });
  }

  onChange(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  emit() {
    const snapshot = this.getSummary();
    this.listeners.forEach(l => {
      try {
        l(snapshot);
      } catch (_) {
        /* listener errors must not break the app */
      }
    });
  }

  conceptViewed(conceptId, conceptData = null) {
    this.analytics.record(
      VERBS.VIEWED,
      { type: OBJECT_TYPES.CONCEPT, id: conceptId, name: conceptData?.overview?.title },
      {},
      { conceptId, source: conceptData?.source }
    );
  }

  sectionViewed(conceptId, sectionId) {
    this.analytics.record(VERBS.VIEWED, { type: OBJECT_TYPES.SECTION, id: `${conceptId}:${sectionId}` }, {}, { conceptId });
  }

  exerciseAttempted(conceptId, exerciseId, { passed = null, hintsUsed = 0 } = {}) {
    this.analytics.record(
      VERBS.ATTEMPTED,
      { type: OBJECT_TYPES.EXERCISE, id: `${conceptId}:${exerciseId}` },
      { success: passed, hintsUsed },
      { conceptId }
    );
    if (passed !== null) {
      this.tracer.observe(conceptId, passed);
      this.scheduler.recordAnswer(`${conceptId}:exercise:${exerciseId}`, { correct: passed, hintsUsed }, { conceptId, kind: 'exercise' });
      this.emit();
    }
  }

  /**
   * Called once per quiz submission with the normalised quiz, the learner's
   * answer indices and the outcome. Feeds every model at once.
   */
  quizSubmitted(conceptId, quiz, answers, { score, passed, timeExpired = false, responseTimesMs = [] } = {}) {
    quiz.questions.forEach((question, index) => {
      const correct = answers[index] === question.correctAnswer;
      const skill = question.skill ? `${conceptId}:${question.skill}` : conceptId;
      this.tracer.observe(skill, correct);
      if (skill !== conceptId) this.tracer.observe(conceptId, correct);
      this.scheduler.recordAnswer(
        `${conceptId}:${question.id}`,
        { correct, responseTimeMs: responseTimesMs[index] ?? null },
        { conceptId, kind: 'question' }
      );
      this.analytics.record(
        VERBS.ANSWERED,
        { type: OBJECT_TYPES.QUESTION, id: `${conceptId}:${question.id}` },
        { success: correct, response: answers[index], responseTimeMs: responseTimesMs[index] ?? null },
        { conceptId, skill }
      );
    });
    this.analytics.record(
      passed ? VERBS.PASSED : VERBS.FAILED,
      { type: OBJECT_TYPES.QUIZ, id: conceptId },
      { score, success: passed, timeExpired, mastery: this.tracer.getMastery(conceptId) },
      { conceptId }
    );
    this.emit();
  }

  conceptCompleted(conceptId) {
    this.analytics.record(VERBS.COMPLETED, { type: OBJECT_TYPES.CONCEPT, id: conceptId }, {}, { conceptId });
    this.emit();
  }

  reviewCompleted(cardId, quality) {
    const [conceptId] = cardId.split(':');
    const card = this.scheduler.recordReview(cardId, quality, { conceptId });
    this.analytics.record(VERBS.REVIEWED, { type: OBJECT_TYPES.REVIEW_CARD, id: cardId }, { quality, nextInterval: card.interval }, { conceptId });
    this.emit();
    return card;
  }

  getDueReviews(limit = 20) {
    return this.scheduler.getDue(limit);
  }

  getMastery(conceptId) {
    return this.tracer.getMastery(conceptId);
  }

  getSummary() {
    return {
      reviews: this.scheduler.getStats(),
      mastery: this.tracer.getAll(),
      analytics: this.analytics.summary()
    };
  }

  exportAll() {
    const payload = {
      exportedAt: new Date().toISOString(),
      analytics: JSON.parse(this.analytics.exportJSON()),
      reviews: this.scheduler.cards,
      mastery: this.tracer.skills
    };
    this.analytics.record(VERBS.EXPORTED, { type: OBJECT_TYPES.APPLICATION, id: 'jsversehub' }, { events: this.analytics.count() });
    return payload;
  }

  setAnalyticsEnabled(enabled) {
    this.analytics.setEnabled(enabled);
  }

  reset() {
    this.analytics.clear();
    this.scheduler.reset();
    this.tracer.reset();
    this.emit();
  }
}

let instance = null;
export function getLearningModel() {
  if (!instance) instance = new LearningModel();
  return instance;
}

if (typeof window !== 'undefined') {
  window.LearningModel = getLearningModel();
}

export default LearningModel;
