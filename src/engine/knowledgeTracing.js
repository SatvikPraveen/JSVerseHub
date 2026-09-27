// src/engine/knowledgeTracing.js - Bayesian Knowledge Tracing (BKT)
//
// Standard two-state hidden Markov learner model from Corbett & Anderson
// (1995). For each skill the learner is either in the "learned" or
// "unlearned" state; observations are correct/incorrect responses.
//
//   pInit    P(L0)  prior probability the skill is already known
//   pTransit P(T)   probability of learning the skill at each opportunity
//   pSlip    P(S)   probability of answering wrong despite knowing it
//   pGuess   P(G)   probability of answering right without knowing it
//
// The default parameters are conservative, widely used starting values; the
// evaluation protocol in docs/research describes how to fit them from logs.

export const DEFAULT_PARAMS = Object.freeze({
  pInit: 0.2,
  pTransit: 0.15,
  pSlip: 0.1,
  pGuess: 0.25
});

export const MASTERY_THRESHOLD = 0.95;

const clamp01 = x => Math.max(0, Math.min(1, x));

export function validateParams(params) {
  const p = { ...DEFAULT_PARAMS, ...params };
  ['pInit', 'pTransit', 'pSlip', 'pGuess'].forEach(k => {
    if (typeof p[k] !== 'number' || Number.isNaN(p[k]) || p[k] < 0 || p[k] > 1) {
      throw new RangeError(`BKT parameter ${k} must be a number in [0, 1]`);
    }
  });
  // Identifiability guard: slip + guess >= 1 makes the model degenerate.
  if (p.pSlip + p.pGuess >= 1) {
    throw new RangeError('BKT requires pSlip + pGuess < 1');
  }
  return p;
}

/**
 * P(correct | current belief)
 */
export function predictCorrect(pKnown, params = DEFAULT_PARAMS) {
  const { pSlip, pGuess } = validateParams(params);
  return clamp01(pKnown * (1 - pSlip) + (1 - pKnown) * pGuess);
}

/**
 * Posterior P(L | observation) before accounting for learning.
 */
export function posterior(pKnown, correct, params = DEFAULT_PARAMS) {
  const { pSlip, pGuess } = validateParams(params);
  if (correct) {
    const num = pKnown * (1 - pSlip);
    const den = num + (1 - pKnown) * pGuess;
    return den === 0 ? pKnown : clamp01(num / den);
  }
  const num = pKnown * pSlip;
  const den = num + (1 - pKnown) * (1 - pGuess);
  return den === 0 ? pKnown : clamp01(num / den);
}

/**
 * Full BKT update: posterior on evidence, then a learning transition.
 */
export function update(pKnown, correct, params = DEFAULT_PARAMS) {
  const { pTransit } = validateParams(params);
  const post = posterior(pKnown, correct, params);
  return clamp01(post + (1 - post) * pTransit);
}

/**
 * Run a sequence of observations from the prior and return the belief after
 * each one (useful for plotting learning curves and for evaluation).
 */
export function traceSequence(observations, params = DEFAULT_PARAMS) {
  const p = validateParams(params);
  const trace = [];
  let belief = p.pInit;
  observations.forEach(correct => {
    belief = update(belief, Boolean(correct), p);
    trace.push(belief);
  });
  return trace;
}

/**
 * Log-likelihood of an observation sequence under the model - the quantity
 * to maximise when fitting parameters offline.
 */
export function logLikelihood(observations, params = DEFAULT_PARAMS) {
  const p = validateParams(params);
  let belief = p.pInit;
  let ll = 0;
  observations.forEach(correct => {
    const pc = predictCorrect(belief, p);
    ll += Math.log(correct ? pc : 1 - pc);
    belief = update(belief, Boolean(correct), p);
  });
  return ll;
}

/**
 * Stateful per-skill tracer. `store` is { load(): object, save(object): void }.
 */
export class KnowledgeTracer {
  constructor(params = DEFAULT_PARAMS, store = null, masteryThreshold = MASTERY_THRESHOLD) {
    this.params = validateParams(params);
    this.store = store;
    this.masteryThreshold = masteryThreshold;
    this.skills = (store && store.load && store.load()) || {};
  }

  persist() {
    if (this.store && this.store.save) this.store.save(this.skills);
  }

  getSkill(skillId) {
    return this.skills[skillId] || { pKnown: this.params.pInit, opportunities: 0, correct: 0, history: [] };
  }

  getMastery(skillId) {
    return this.getSkill(skillId).pKnown;
  }

  isMastered(skillId) {
    return this.getMastery(skillId) >= this.masteryThreshold;
  }

  predict(skillId) {
    return predictCorrect(this.getMastery(skillId), this.params);
  }

  observe(skillId, correct, meta = {}) {
    const prev = this.getSkill(skillId);
    const pKnown = update(prev.pKnown, Boolean(correct), this.params);
    this.skills[skillId] = {
      pKnown,
      opportunities: prev.opportunities + 1,
      correct: prev.correct + (correct ? 1 : 0),
      history: [...prev.history, { correct: Boolean(correct), pKnown, at: meta.at ?? Date.now() }].slice(-100)
    };
    this.persist();
    return pKnown;
  }

  getAll() {
    return Object.fromEntries(
      Object.entries(this.skills).map(([id, s]) => [
        id,
        { pKnown: s.pKnown, mastered: s.pKnown >= this.masteryThreshold, opportunities: s.opportunities, accuracy: s.opportunities ? s.correct / s.opportunities : null }
      ])
    );
  }

  reset() {
    this.skills = {};
    this.persist();
  }
}

export default KnowledgeTracer;
