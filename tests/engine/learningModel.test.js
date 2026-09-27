import { LearningModel } from '../../src/engine/learningModel';
import { LearningAnalytics } from '../../src/engine/learningAnalytics';
import { SpacedRepetitionScheduler } from '../../src/engine/spacedRepetition';
import { KnowledgeTracer, DEFAULT_PARAMS } from '../../src/engine/knowledgeTracing';

const memStorage = () => {
  const m = new Map();
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v), removeItem: k => m.delete(k) };
};

const quiz = {
  questions: [
    { id: 'q1', question: 'A?', options: ['x', 'y'], correctAnswer: 0 },
    { id: 'q2', question: 'B?', options: ['x', 'y'], correctAnswer: 1, skill: 'closures' },
    { id: 'q3', question: 'C?', options: ['x', 'y'], correctAnswer: 1 }
  ],
  passingScore: 70
};

describe('LearningModel facade', () => {
  let model;
  let now;

  beforeEach(() => {
    now = Date.UTC(2026, 0, 1);
    model = new LearningModel({
      analytics: new LearningAnalytics({ storage: memStorage(), clock: () => now }),
      scheduler: new SpacedRepetitionScheduler(null, () => now),
      tracer: new KnowledgeTracer(DEFAULT_PARAMS)
    });
  });

  test('records an initialised statement on construction', () => {
    expect(model.analytics.getEvents({ verb: 'initialized' })).toHaveLength(1);
  });

  test('quizSubmitted feeds tracer, scheduler and analytics for every question', () => {
    const changes = [];
    model.onChange(s => changes.push(s));
    model.quizSubmitted('basics', quiz, [0, 0, 1], { score: 67, passed: false });

    // knowledge tracing: concept skill saw 3 observations (2 correct), sub-skill 1 incorrect
    expect(model.tracer.getAll().basics.opportunities).toBe(3);
    expect(model.tracer.getAll()['basics:closures']).toMatchObject({ opportunities: 1, accuracy: 0 });
    expect(model.getMastery('basics')).toBeGreaterThan(DEFAULT_PARAMS.pInit);

    // spaced repetition: one card per question, wrong one due tomorrow like the others (SM-2 first interval)
    expect(model.scheduler.getStats().total).toBe(3);
    expect(model.scheduler.getStats().lapses).toBe(1);
    expect(model.getDueReviews()).toHaveLength(0);
    now += 24 * 60 * 60 * 1000 + 1;
    expect(model.getDueReviews()).toHaveLength(3);

    // analytics: 3 answered + 1 failed statement, with concept context
    const answered = model.analytics.getEvents({ verb: 'answered' });
    expect(answered).toHaveLength(3);
    expect(answered.map(e => e.result.success)).toEqual([true, false, true]);
    expect(answered[0].context.conceptId).toBe('basics');
    expect(model.analytics.getEvents({ verb: 'failed' })[0].result).toMatchObject({ score: 67, success: false });

    expect(changes).toHaveLength(1);
    expect(changes[0]).toEqual(
      expect.objectContaining({
        reviews: expect.any(Object),
        mastery: expect.any(Object),
        analytics: expect.any(Object)
      })
    );
  });

  test('passing a quiz records a passed statement', () => {
    model.quizSubmitted('dom', quiz, [0, 1, 1], { score: 100, passed: true });
    expect(model.analytics.getEvents({ verb: 'passed' })).toHaveLength(1);
    expect(model.analytics.getEvents({ verb: 'failed' })).toHaveLength(0);
  });

  test('conceptViewed / sectionViewed / conceptCompleted / exerciseAttempted record statements', () => {
    model.conceptViewed('dom', { overview: { title: 'DOM' }, source: { sections: 'authored' } });
    model.sectionViewed('dom', 'selection');
    model.exerciseAttempted('dom', 'ex1', { passed: true });
    model.exerciseAttempted('dom', 'ex2'); // attempt without outcome: no model update
    model.conceptCompleted('dom');
    const verbs = model.analytics.getEvents().map(e => e.verb);
    expect(verbs).toEqual(['initialized', 'viewed', 'viewed', 'attempted', 'attempted', 'completed']);
    expect(model.tracer.getAll().dom.opportunities).toBe(1);
    expect(model.analytics.summary().concepts.dom.views).toBe(1);
  });

  test('reviewCompleted reschedules the card and logs the review', () => {
    model.quizSubmitted('dom', quiz, [0, 1, 1], { score: 100, passed: true });
    const card = model.reviewCompleted('dom:q1', 5);
    expect(card.repetitions).toBe(2);
    expect(card.interval).toBe(6);
    expect(model.analytics.getEvents({ verb: 'reviewed' })[0].result).toMatchObject({ quality: 5, nextInterval: 6 });
  });

  test('exportAll bundles every store and records the export', () => {
    model.quizSubmitted('dom', quiz, [0, 1, 1], { score: 100, passed: true });
    const payload = model.exportAll();
    expect(payload.analytics.events.length).toBeGreaterThan(3);
    expect(Object.keys(payload.reviews)).toEqual(['dom:q1', 'dom:q2', 'dom:q3']);
    expect(payload.mastery.dom).toBeDefined();
    expect(model.analytics.getEvents({ verb: 'exported' })).toHaveLength(1);
  });

  test('setAnalyticsEnabled(false) stops logging while models keep learning', () => {
    model.setAnalyticsEnabled(false);
    model.quizSubmitted('dom', quiz, [0, 1, 1], { score: 100, passed: true });
    expect(model.analytics.getEvents({ verb: 'answered' })).toHaveLength(0);
    expect(model.tracer.getAll().dom.opportunities).toBe(3);
  });

  test('reset clears all three stores', () => {
    model.quizSubmitted('dom', quiz, [0, 1, 1], { score: 100, passed: true });
    model.reset();
    expect(model.getSummary().reviews.total).toBe(0);
    expect(model.getSummary().mastery).toEqual({});
    expect(model.analytics.count()).toBe(0);
  });
});
