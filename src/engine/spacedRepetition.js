// src/engine/spacedRepetition.js - SM-2 spaced-repetition scheduler
//
// Implements the SuperMemo SM-2 algorithm (Wozniak, 1990) as a set of pure
// functions plus a small stateful scheduler that persists through an injected
// store. Review quality is graded 0-5:
//
//   5  perfect response
//   4  correct after hesitation
//   3  correct with serious difficulty
//   2  incorrect, but the correct answer seemed easy to recall
//   1  incorrect, remembered on seeing the answer
//   0  complete blackout
//
// Quality >= 3 counts as a successful recall. The expected retention estimate
// uses an exponential forgetting curve with the scheduled interval as the
// half-life, which is a deliberately simple model chosen for interpretability.

export const MIN_EASE_FACTOR = 1.3;
export const DEFAULT_EASE_FACTOR = 2.5;
export const DAY_MS = 24 * 60 * 60 * 1000;
export const MAX_QUALITY = 5;

export function createCard(id, now = Date.now(), extra = {}) {
  if (!id) throw new Error('createCard requires an id');
  return {
    id,
    repetitions: 0,
    interval: 0, // days
    easeFactor: DEFAULT_EASE_FACTOR,
    due: now,
    lastReview: null,
    lapses: 0,
    history: [],
    ...extra
  };
}

export function clampQuality(quality) {
  const q = Number(quality);
  if (!Number.isFinite(q)) return 0;
  return Math.max(0, Math.min(MAX_QUALITY, Math.round(q)));
}

/**
 * Apply one SM-2 review. Returns a new card; the input is not mutated.
 */
export function review(card, quality, now = Date.now()) {
  const q = clampQuality(quality);
  let { repetitions, interval, easeFactor } = card;
  let { lapses } = card;

  if (q >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
    lapses += 1;
  }

  easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor + (0.1 - (MAX_QUALITY - q) * (0.08 + (MAX_QUALITY - q) * 0.02)));
  easeFactor = Math.round(easeFactor * 1000) / 1000;

  return {
    ...card,
    repetitions,
    interval,
    easeFactor,
    lapses,
    lastReview: now,
    due: now + interval * DAY_MS,
    history: [...card.history, { at: now, quality: q, interval }].slice(-50)
  };
}

export function isDue(card, now = Date.now()) {
  return card.due <= now;
}

export function dueCards(cards, now = Date.now()) {
  return Object.values(cards)
    .filter(c => isDue(c, now))
    .sort((a, b) => a.due - b.due);
}

/**
 * Map an observed answer to an SM-2 quality grade.
 * Response time thresholds are relative to `expectedMs` (default 30s).
 */
export function qualityFromAnswer({ correct, responseTimeMs = null, hintsUsed = 0, expectedMs = 30000 }) {
  if (!correct) return hintsUsed > 0 ? 1 : 2;
  if (hintsUsed > 0) return 3;
  if (responseTimeMs === null) return 4;
  if (responseTimeMs <= expectedMs) return 5;
  if (responseTimeMs <= expectedMs * 2) return 4;
  return 3;
}

/**
 * Probability the item is still remembered at `now`, using an exponential
 * forgetting curve whose half-life equals the scheduled interval.
 */
export function retentionEstimate(card, now = Date.now()) {
  if (!card.lastReview || card.interval <= 0) return 0;
  const elapsedDays = Math.max(0, (now - card.lastReview) / DAY_MS);
  return 2 ** (-elapsedDays / card.interval);
}

/**
 * Stateful scheduler. `store` is { load(): object, save(object): void }.
 */
export class SpacedRepetitionScheduler {
  constructor(store = null, clock = () => Date.now()) {
    this.store = store;
    this.clock = clock;
    this.cards = (store && store.load && store.load()) || {};
  }

  persist() {
    if (this.store && this.store.save) this.store.save(this.cards);
  }

  getCard(id) {
    return this.cards[id] || null;
  }

  ensureCard(id, extra = {}) {
    if (!this.cards[id]) {
      this.cards[id] = createCard(id, this.clock(), extra);
      this.persist();
    }
    return this.cards[id];
  }

  recordReview(id, quality, extra = {}) {
    const card = this.ensureCard(id, extra);
    this.cards[id] = review(card, quality, this.clock());
    this.persist();
    return this.cards[id];
  }

  recordAnswer(id, answer, extra = {}) {
    return this.recordReview(id, qualityFromAnswer(answer), extra);
  }

  getDue(limit = Infinity) {
    return dueCards(this.cards, this.clock()).slice(0, limit);
  }

  getDueCount() {
    return dueCards(this.cards, this.clock()).length;
  }

  getStats() {
    const cards = Object.values(this.cards);
    const now = this.clock();
    const reviewed = cards.filter(c => c.lastReview);
    const avgRetention = reviewed.length
      ? reviewed.reduce((s, c) => s + retentionEstimate(c, now), 0) / reviewed.length
      : 0;
    return {
      total: cards.length,
      due: cards.filter(c => isDue(c, now)).length,
      mature: cards.filter(c => c.interval >= 21).length,
      lapses: cards.reduce((s, c) => s + c.lapses, 0),
      averageEase: cards.length ? cards.reduce((s, c) => s + c.easeFactor, 0) / cards.length : DEFAULT_EASE_FACTOR,
      averageRetention: avgRetention
    };
  }

  reset() {
    this.cards = {};
    this.persist();
  }
}

export default SpacedRepetitionScheduler;
