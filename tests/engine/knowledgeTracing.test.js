import {
  DEFAULT_PARAMS,
  MASTERY_THRESHOLD,
  validateParams,
  predictCorrect,
  posterior,
  update,
  traceSequence,
  logLikelihood,
  KnowledgeTracer
} from '../../src/engine/knowledgeTracing';

const P = { pInit: 0.2, pTransit: 0.15, pSlip: 0.1, pGuess: 0.25 };

describe('Bayesian Knowledge Tracing', () => {
  describe('validateParams', () => {
    test('accepts defaults and merges overrides', () => {
      expect(validateParams({})).toEqual(DEFAULT_PARAMS);
      expect(validateParams({ pInit: 0.5 }).pInit).toBe(0.5);
    });

    test('rejects out-of-range and degenerate parameters', () => {
      expect(() => validateParams({ pSlip: 1.2 })).toThrow(RangeError);
      expect(() => validateParams({ pGuess: -0.1 })).toThrow(RangeError);
      expect(() => validateParams({ pSlip: 0.5, pGuess: 0.5 })).toThrow(RangeError);
      expect(() => validateParams({ pInit: 'a' })).toThrow(RangeError);
    });
  });

  describe('predictCorrect', () => {
    test('matches the closed-form expectation', () => {
      // 0.2*0.9 + 0.8*0.25 = 0.18 + 0.20 = 0.38
      expect(predictCorrect(0.2, P)).toBeCloseTo(0.38, 10);
      expect(predictCorrect(1, P)).toBeCloseTo(0.9, 10);
      expect(predictCorrect(0, P)).toBeCloseTo(0.25, 10);
    });
  });

  describe('posterior', () => {
    test('correct answer raises belief per Bayes rule', () => {
      // (0.2*0.9) / (0.2*0.9 + 0.8*0.25) = 0.18/0.38
      expect(posterior(0.2, true, P)).toBeCloseTo(0.18 / 0.38, 10);
    });

    test('incorrect answer lowers belief per Bayes rule', () => {
      // (0.2*0.1) / (0.2*0.1 + 0.8*0.75) = 0.02/0.62
      expect(posterior(0.2, false, P)).toBeCloseTo(0.02 / 0.62, 10);
    });
  });

  describe('update', () => {
    test('applies posterior then learning transition', () => {
      const post = 0.18 / 0.38;
      expect(update(0.2, true, P)).toBeCloseTo(post + (1 - post) * 0.15, 10);
    });

    test('belief is monotone in the evidence', () => {
      expect(update(0.5, true, P)).toBeGreaterThan(update(0.5, false, P));
    });

    test('stays within [0, 1]', () => {
      let b = 0.2;
      for (let i = 0; i < 100; i++) b = update(b, true, P);
      expect(b).toBeLessThanOrEqual(1);
      expect(b).toBeGreaterThan(0.99);
      for (let i = 0; i < 100; i++) b = update(b, false, P);
      expect(b).toBeGreaterThanOrEqual(0);
    });
  });

  describe('traceSequence', () => {
    test('returns one belief per observation, starting from pInit', () => {
      const trace = traceSequence([true, true, false, true], P);
      expect(trace).toHaveLength(4);
      expect(trace[0]).toBeCloseTo(update(P.pInit, true, P), 10);
      expect(trace[2]).toBeLessThan(trace[1]);
      expect(trace[3]).toBeGreaterThan(trace[2]);
    });

    test('a run of correct answers reaches the mastery threshold', () => {
      const trace = traceSequence(new Array(12).fill(true), P);
      expect(trace[trace.length - 1]).toBeGreaterThanOrEqual(MASTERY_THRESHOLD);
    });
  });

  describe('logLikelihood', () => {
    test('is negative and prefers parameters that explain the data', () => {
      const obs = [true, true, true, true, true];
      const ll = logLikelihood(obs, P);
      expect(ll).toBeLessThan(0);
      expect(logLikelihood(obs, { ...P, pInit: 0.9 })).toBeGreaterThan(ll);
    });
  });

  describe('KnowledgeTracer', () => {
    const makeStore = () => {
      let data = null;
      return { load: () => data, save: d => { data = JSON.parse(JSON.stringify(d)); } };
    };

    test('tracks per-skill mastery and persists', () => {
      const store = makeStore();
      const kt = new KnowledgeTracer(P, store);
      expect(kt.getMastery('closures')).toBe(P.pInit);
      kt.observe('closures', true, { at: 1 });
      kt.observe('closures', true, { at: 2 });
      expect(kt.getMastery('closures')).toBeGreaterThan(P.pInit);
      const reloaded = new KnowledgeTracer(P, store);
      expect(reloaded.getMastery('closures')).toBeCloseTo(kt.getMastery('closures'), 10);
      expect(reloaded.getAll().closures).toMatchObject({ opportunities: 2, accuracy: 1, mastered: false });
    });

    test('reports mastery once the threshold is crossed', () => {
      const kt = new KnowledgeTracer(P);
      for (let i = 0; i < 15; i++) kt.observe('s', true);
      expect(kt.isMastered('s')).toBe(true);
      expect(kt.predict('s')).toBeGreaterThan(0.85);
    });

    test('reset clears skills', () => {
      const kt = new KnowledgeTracer(P);
      kt.observe('s', true);
      kt.reset();
      expect(kt.getAll()).toEqual({});
    });
  });
});
