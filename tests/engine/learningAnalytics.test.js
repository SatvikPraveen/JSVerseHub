import { LearningAnalytics, VERBS, OBJECT_TYPES, SCHEMA_VERSION } from '../../src/engine/learningAnalytics';

const memStorage = () => {
  const m = new Map();
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v), removeItem: k => m.delete(k), raw: m };
};

describe('LearningAnalytics', () => {
  let now;
  let storage;
  let analytics;

  beforeEach(() => {
    now = Date.UTC(2026, 0, 1, 12, 0, 0);
    storage = memStorage();
    analytics = new LearningAnalytics({ storage, clock: () => now });
  });

  test('records xAPI-shaped statements with an anonymous actor', () => {
    const s = analytics.record(VERBS.VIEWED, { type: OBJECT_TYPES.CONCEPT, id: 'basics', name: 'Basics' });
    expect(s).toMatchObject({
      schemaVersion: SCHEMA_VERSION,
      verb: 'viewed',
      object: { type: 'concept', id: 'basics', name: 'Basics' },
      timestamp: '2026-01-01T12:00:00.000Z'
    });
    expect(s.actor.anonymousId).toMatch(/^[0-9a-f-]{36}$/);
    expect(s.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(Object.keys(s.actor)).toEqual(['anonymousId']);
  });

  test('validates input', () => {
    expect(() => analytics.record('viewed', { id: 'x' })).toThrow(TypeError);
    expect(() => analytics.record(null, { type: 'concept', id: 'x' })).toThrow(TypeError);
  });

  test('persists to storage and reloads with the same actor id', () => {
    analytics.record(VERBS.VIEWED, { type: OBJECT_TYPES.CONCEPT, id: 'basics' });
    const again = new LearningAnalytics({ storage, clock: () => now });
    expect(again.count()).toBe(1);
    expect(again.summary().actorId).toBe(analytics.summary().actorId);
  });

  test('survives corrupted storage', () => {
    storage.setItem('jsversehub-analytics', '{not json');
    expect(() => new LearningAnalytics({ storage })).not.toThrow();
  });

  test('is a bounded ring buffer', () => {
    const small = new LearningAnalytics({ storage, clock: () => now, maxEvents: 3 });
    for (let i = 0; i < 5; i++) small.record(VERBS.VIEWED, { type: OBJECT_TYPES.SECTION, id: `s${i}` });
    expect(small.count()).toBe(3);
    expect(small.getEvents().map(e => e.object.id)).toEqual(['s2', 's3', 's4']);
  });

  test('can be disabled (opt-out) and notifies subscribers', () => {
    const seen = [];
    analytics.subscribe(s => seen.push(s.verb));
    analytics.setEnabled(false);
    expect(analytics.record(VERBS.VIEWED, { type: OBJECT_TYPES.CONCEPT, id: 'x' })).toBeNull();
    analytics.setEnabled(true);
    analytics.record(VERBS.COMPLETED, { type: OBJECT_TYPES.CONCEPT, id: 'x' });
    expect(seen).toEqual(['completed']);
  });

  test('filters events', () => {
    analytics.record(VERBS.VIEWED, { type: OBJECT_TYPES.CONCEPT, id: 'a' });
    now += 1000;
    analytics.record(VERBS.ANSWERED, { type: OBJECT_TYPES.QUESTION, id: 'q1' }, { success: true }, { conceptId: 'a' });
    expect(analytics.getEvents({ verb: VERBS.ANSWERED })).toHaveLength(1);
    expect(analytics.getEvents({ objectType: OBJECT_TYPES.CONCEPT })).toHaveLength(1);
    expect(analytics.getEvents({ since: now })).toHaveLength(1);
  });

  test('summary computes accuracy and time-on-task per concept', () => {
    analytics.record(VERBS.VIEWED, { type: OBJECT_TYPES.CONCEPT, id: 'a' });
    now += 60000;
    analytics.record(VERBS.ANSWERED, { type: OBJECT_TYPES.QUESTION, id: 'q1' }, { success: true }, { conceptId: 'a' });
    analytics.record(VERBS.ANSWERED, { type: OBJECT_TYPES.QUESTION, id: 'q2' }, { success: false }, { conceptId: 'a' });
    now += 60000;
    analytics.record(VERBS.COMPLETED, { type: OBJECT_TYPES.CONCEPT, id: 'a' });
    const s = analytics.summary();
    expect(s.byVerb).toEqual({ viewed: 1, answered: 2, completed: 1 });
    expect(s.concepts.a).toMatchObject({ views: 1, answers: 2, correct: 1, accuracy: 0.5, timeOnTaskMs: 120000 });
  });

  test('exports JSON and CSV', () => {
    analytics.record(VERBS.ANSWERED, { type: OBJECT_TYPES.QUESTION, id: 'q,1' }, { success: true, score: 1 }, { conceptId: 'a' });
    const json = JSON.parse(analytics.exportJSON());
    expect(json.events).toHaveLength(1);
    const csv = analytics.exportCSV().split('\n');
    expect(csv[0]).toBe('id,timestamp,sessionId,actorId,verb,objectType,objectId,success,score,responseTimeMs,context');
    expect(csv[1]).toContain('"q,1"');
    expect(csv[1]).toContain('answered');
  });

  test('clear wipes events and rotates the actor id', () => {
    const before = analytics.summary().actorId;
    analytics.record(VERBS.VIEWED, { type: OBJECT_TYPES.CONCEPT, id: 'a' });
    analytics.clear();
    expect(analytics.count()).toBe(0);
    expect(analytics.summary().actorId).not.toBe(before);
  });
});
