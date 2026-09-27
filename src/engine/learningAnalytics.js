// src/engine/learningAnalytics.js - Local-only, privacy-preserving analytics
//
// Records learner interactions as xAPI-inspired statements
// ({ actor, verb, object, result, context, timestamp }). Everything stays on
// the device: statements live in localStorage (or any injected storage) and
// can be exported as JSON or CSV for offline analysis. The actor is a random
// anonymous id; no names, emails, IPs or user agents are ever recorded.
//
// The schema is documented in docs/research/DATA_SCHEMA.md.

export const SCHEMA_VERSION = '1.0.0';

export const VERBS = Object.freeze({
  INITIALIZED: 'initialized',
  VIEWED: 'viewed',
  ATTEMPTED: 'attempted',
  ANSWERED: 'answered',
  COMPLETED: 'completed',
  PASSED: 'passed',
  FAILED: 'failed',
  REVIEWED: 'reviewed',
  UNLOCKED: 'unlocked',
  EXPORTED: 'exported'
});

export const OBJECT_TYPES = Object.freeze({
  APPLICATION: 'application',
  CONCEPT: 'concept',
  SECTION: 'section',
  EXERCISE: 'exercise',
  QUIZ: 'quiz',
  QUESTION: 'question',
  REVIEW_CARD: 'review-card'
});

const DEFAULT_MAX_EVENTS = 5000;
const STORAGE_KEY = 'jsversehub-analytics';

function randomId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  const bytes = new Array(16).fill(0).map(() => Math.floor(Math.random() * 256));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function memoryStorage() {
  const map = new Map();
  return {
    getItem: k => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: k => map.delete(k)
  };
}

function csvEscape(value) {
  const s = value === null || value === undefined ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export class LearningAnalytics {
  constructor({ storage = null, maxEvents = DEFAULT_MAX_EVENTS, clock = () => Date.now(), enabled = true, storageKey = STORAGE_KEY } = {}) {
    this.storage = storage || (typeof localStorage !== 'undefined' ? localStorage : memoryStorage());
    this.maxEvents = maxEvents;
    this.clock = clock;
    this.enabled = enabled;
    this.storageKey = storageKey;
    this.sessionId = randomId();
    this.sessionStart = clock();
    this.listeners = [];
    this.state = this.load();
  }

  load() {
    try {
      const raw = this.storage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.events)) return { actorId: parsed.actorId || randomId(), events: parsed.events };
      }
    } catch (_) {
      /* corrupted storage: start fresh */
    }
    return { actorId: randomId(), events: [] };
  }

  persist() {
    try {
      this.storage.setItem(this.storageKey, JSON.stringify({ schemaVersion: SCHEMA_VERSION, actorId: this.state.actorId, events: this.state.events }));
    } catch (_) {
      /* quota exceeded or storage unavailable: keep in memory */
    }
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Record a statement. `object` is { type, id, name? }.
   */
  record(verb, object, result = {}, context = {}) {
    if (!this.enabled) return null;
    if (!verb || !object || !object.type || !object.id) throw new TypeError('record(verb, {type, id}) requires a verb and an object with type and id');

    const statement = {
      id: randomId(),
      schemaVersion: SCHEMA_VERSION,
      timestamp: new Date(this.clock()).toISOString(),
      sessionId: this.sessionId,
      actor: { anonymousId: this.state.actorId },
      verb,
      object: { type: object.type, id: object.id, ...(object.name ? { name: object.name } : {}) },
      result,
      context: { sessionElapsedMs: this.clock() - this.sessionStart, ...context }
    };

    this.state.events.push(statement);
    if (this.state.events.length > this.maxEvents) {
      this.state.events.splice(0, this.state.events.length - this.maxEvents);
    }
    this.persist();
    this.listeners.forEach(l => {
      try {
        l(statement);
      } catch (_) {
        /* listener errors must not break the app */
      }
    });
    return statement;
  }

  getEvents({ verb = null, objectType = null, objectId = null, since = null } = {}) {
    return this.state.events.filter(
      e =>
        (!verb || e.verb === verb) &&
        (!objectType || e.object.type === objectType) &&
        (!objectId || e.object.id === objectId) &&
        (!since || Date.parse(e.timestamp) >= since)
    );
  }

  count() {
    return this.state.events.length;
  }

  /**
   * Aggregate view used by the UI and the evaluation notebooks: per-verb
   * counts, per-concept accuracy and time-on-task (first view -> completion).
   */
  summary() {
    const byVerb = {};
    const concepts = {};
    this.state.events.forEach(e => {
      byVerb[e.verb] = (byVerb[e.verb] || 0) + 1;
      const conceptId = e.context.conceptId || (e.object.type === OBJECT_TYPES.CONCEPT ? e.object.id : null);
      if (!conceptId) return;
      const c = concepts[conceptId] || (concepts[conceptId] = { views: 0, answers: 0, correct: 0, firstViewed: null, completedAt: null });
      const t = Date.parse(e.timestamp);
      if (e.verb === VERBS.VIEWED && e.object.type === OBJECT_TYPES.CONCEPT) {
        c.views += 1;
        if (c.firstViewed === null || t < c.firstViewed) c.firstViewed = t;
      }
      if (e.verb === VERBS.ANSWERED) {
        c.answers += 1;
        if (e.result.success) c.correct += 1;
      }
      if (e.verb === VERBS.COMPLETED && e.object.type === OBJECT_TYPES.CONCEPT) c.completedAt = t;
    });
    Object.values(concepts).forEach(c => {
      c.accuracy = c.answers ? c.correct / c.answers : null;
      c.timeOnTaskMs = c.firstViewed !== null && c.completedAt !== null ? Math.max(0, c.completedAt - c.firstViewed) : null;
    });
    return { schemaVersion: SCHEMA_VERSION, actorId: this.state.actorId, totalEvents: this.state.events.length, byVerb, concepts };
  }

  exportJSON() {
    return JSON.stringify({ schemaVersion: SCHEMA_VERSION, exportedAt: new Date(this.clock()).toISOString(), actorId: this.state.actorId, events: this.state.events }, null, 2);
  }

  exportCSV() {
    const header = ['id', 'timestamp', 'sessionId', 'actorId', 'verb', 'objectType', 'objectId', 'success', 'score', 'responseTimeMs', 'context'];
    const rows = this.state.events.map(e => [
      e.id,
      e.timestamp,
      e.sessionId,
      e.actor.anonymousId,
      e.verb,
      e.object.type,
      e.object.id,
      e.result.success,
      e.result.score,
      e.result.responseTimeMs,
      e.context
    ]);
    return [header, ...rows].map(r => r.map(csvEscape).join(',')).join('\n');
  }

  clear() {
    this.state = { actorId: randomId(), events: [] };
    this.persist();
  }
}

export default LearningAnalytics;
