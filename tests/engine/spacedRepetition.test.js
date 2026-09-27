import {
  createCard,
  review,
  isDue,
  dueCards,
  qualityFromAnswer,
  retentionEstimate,
  clampQuality,
  SpacedRepetitionScheduler,
  DAY_MS,
  MIN_EASE_FACTOR
} from '../../src/engine/spacedRepetition';

const T0 = Date.UTC(2026, 0, 1);

describe('SM-2 spaced repetition', () => {
  describe('createCard', () => {
    test('creates a card that is immediately due', () => {
      const card = createCard('basics:q1', T0);
      expect(card).toMatchObject({ id: 'basics:q1', repetitions: 0, interval: 0, easeFactor: 2.5, due: T0, lapses: 0 });
      expect(isDue(card, T0)).toBe(true);
    });

    test('requires an id', () => {
      expect(() => createCard()).toThrow();
    });
  });

  describe('review', () => {
    test('follows the canonical SM-2 interval sequence 1, 6, 6*EF', () => {
      let card = createCard('x', T0);
      card = review(card, 5, T0);
      expect(card.interval).toBe(1);
      expect(card.repetitions).toBe(1);
      expect(card.easeFactor).toBeCloseTo(2.6, 3);
      expect(card.due).toBe(T0 + DAY_MS);

      card = review(card, 5, card.due);
      expect(card.interval).toBe(6);
      expect(card.repetitions).toBe(2);
      expect(card.easeFactor).toBeCloseTo(2.7, 3);

      card = review(card, 5, card.due);
      expect(card.interval).toBe(Math.round(6 * 2.7));
      expect(card.repetitions).toBe(3);
    });

    test('quality 4 keeps ease factor unchanged, quality 3 lowers it', () => {
      const base = createCard('x', T0);
      expect(review(base, 4, T0).easeFactor).toBeCloseTo(2.5, 3);
      expect(review(base, 3, T0).easeFactor).toBeCloseTo(2.36, 3);
    });

    test('a failed recall resets repetitions, schedules for tomorrow and counts a lapse', () => {
      let card = createCard('x', T0);
      card = review(card, 5, T0);
      card = review(card, 5, card.due);
      card = review(card, 1, card.due);
      expect(card.repetitions).toBe(0);
      expect(card.interval).toBe(1);
      expect(card.lapses).toBe(1);
    });

    test('ease factor never drops below 1.3', () => {
      let card = createCard('x', T0);
      for (let i = 0; i < 20; i++) card = review(card, 0, T0 + i * DAY_MS);
      expect(card.easeFactor).toBe(MIN_EASE_FACTOR);
    });

    test('does not mutate the input card', () => {
      const card = createCard('x', T0);
      const snapshot = JSON.stringify(card);
      review(card, 5, T0);
      expect(JSON.stringify(card)).toBe(snapshot);
    });

    test('records bounded history', () => {
      let card = createCard('x', T0);
      for (let i = 0; i < 60; i++) card = review(card, 4, T0 + i * DAY_MS);
      expect(card.history).toHaveLength(50);
    });
  });

  describe('clampQuality', () => {
    test('clamps and rounds', () => {
      expect(clampQuality(-3)).toBe(0);
      expect(clampQuality(9)).toBe(5);
      expect(clampQuality(3.6)).toBe(4);
      expect(clampQuality('nope')).toBe(0);
    });
  });

  describe('qualityFromAnswer', () => {
    test('grades correct answers by speed and hint usage', () => {
      expect(qualityFromAnswer({ correct: true, responseTimeMs: 5000 })).toBe(5);
      expect(qualityFromAnswer({ correct: true, responseTimeMs: 45000 })).toBe(4);
      expect(qualityFromAnswer({ correct: true, responseTimeMs: 120000 })).toBe(3);
      expect(qualityFromAnswer({ correct: true, hintsUsed: 1 })).toBe(3);
      expect(qualityFromAnswer({ correct: true })).toBe(4);
    });

    test('grades incorrect answers below the recall threshold', () => {
      expect(qualityFromAnswer({ correct: false })).toBe(2);
      expect(qualityFromAnswer({ correct: false, hintsUsed: 2 })).toBe(1);
    });
  });

  describe('retentionEstimate', () => {
    test('is 1 right after review and halves after one interval', () => {
      const card = review(createCard('x', T0), 5, T0); // interval 1 day
      expect(retentionEstimate(card, T0)).toBeCloseTo(1, 5);
      expect(retentionEstimate(card, T0 + DAY_MS)).toBeCloseTo(0.5, 5);
      expect(retentionEstimate(card, T0 + 2 * DAY_MS)).toBeCloseTo(0.25, 5);
    });

    test('is 0 for never-reviewed cards', () => {
      expect(retentionEstimate(createCard('x', T0), T0)).toBe(0);
    });
  });

  describe('dueCards', () => {
    test('returns only due cards sorted by due date', () => {
      const a = { ...createCard('a', T0), due: T0 + 3 * DAY_MS };
      const b = { ...createCard('b', T0), due: T0 + DAY_MS };
      const c = { ...createCard('c', T0), due: T0 + 10 * DAY_MS };
      expect(dueCards({ a, b, c }, T0 + 5 * DAY_MS).map(x => x.id)).toEqual(['b', 'a']);
    });
  });

  describe('SpacedRepetitionScheduler', () => {
    const makeStore = () => {
      let data = null;
      return {
        load: () => data,
        save: d => {
          data = JSON.parse(JSON.stringify(d));
        },
        get: () => data
      };
    };

    test('persists reviews through the store and reports due counts', () => {
      let now = T0;
      const store = makeStore();
      const s = new SpacedRepetitionScheduler(store, () => now);
      s.recordAnswer('basics:q1', { correct: true, responseTimeMs: 1000 });
      s.recordAnswer('basics:q2', { correct: false });
      expect(Object.keys(store.get())).toEqual(['basics:q1', 'basics:q2']);
      expect(s.getDueCount()).toBe(0);
      now = T0 + DAY_MS + 1;
      expect(s.getDueCount()).toBe(2);
      expect(s.getDue(1)).toHaveLength(1);
    });

    test('reloads state from the store', () => {
      const store = makeStore();
      const s1 = new SpacedRepetitionScheduler(store, () => T0);
      s1.recordReview('x', 5);
      const s2 = new SpacedRepetitionScheduler(store, () => T0);
      expect(s2.getCard('x').repetitions).toBe(1);
    });

    test('getStats aggregates cards', () => {
      const s = new SpacedRepetitionScheduler(null, () => T0);
      s.recordReview('a', 5);
      s.recordReview('b', 0);
      const stats = s.getStats();
      expect(stats.total).toBe(2);
      expect(stats.lapses).toBe(1);
      expect(stats.averageRetention).toBeCloseTo(1, 5);
    });

    test('works without a store', () => {
      const s = new SpacedRepetitionScheduler();
      expect(() => s.recordReview('a', 3)).not.toThrow();
      s.reset();
      expect(s.getStats().total).toBe(0);
    });
  });
});
