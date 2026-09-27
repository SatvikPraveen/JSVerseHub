# ADR 0005: Bayesian Knowledge Tracing as the learner model

- **Status**: Accepted
- **Date**: 2026-09-27

## Context

The platform wants to estimate, per concept, whether a learner has mastered it, so that it can decide what
to recommend next, what to schedule for review and when to mark a planet as complete. This requires a
learner model that updates from a sequence of correct and incorrect responses.

Candidates:

- **Bayesian Knowledge Tracing (BKT)** (Corbett & Anderson, 1995): a two-state hidden Markov model per
  skill with four parameters (prior knowledge, learning rate, slip, guess). Widely used in intelligent
  tutoring systems.
- **Item Response Theory (IRT)**: models a static ability per learner and difficulty per item. Good for
  assessment, but it does not model learning over time without extensions, and it needs calibrated items.
- **Deep Knowledge Tracing (DKT)** and successors: recurrent or attention-based models that often
  outperform BKT on large datasets, but need thousands of learners' histories to train, are hard to
  interpret, and cannot be fitted on-device from one learner's log.
- **Performance Factors Analysis** and other logistic models: interpretable and lightweight, but the
  per-skill mastery probability that BKT provides maps most directly onto the UI's needs.

Given ADR 0003 (no central dataset, everything on-device), the model must work from a single learner's
small log and must be explainable to that learner.

## Decision

Implement standard BKT in `src/engine/knowledgeTracing.js`, one instance of the model per concept (skill):

- State: `pKnown`, the probability the learner has mastered the skill.
- Parameters and defaults:
  - `pInit = 0.2` (prior probability of knowing the skill before any observation)
  - `pTransit = 0.15` (probability of learning the skill on each opportunity)
  - `pSlip = 0.1` (probability of answering wrongly despite knowing)
  - `pGuess = 0.25` (probability of answering correctly without knowing; reflects four-option quizzes)
- Update on each observation: the standard posterior given correct/incorrect, followed by the learning
  transition `p' = posterior + (1 - posterior) * pTransit`.
- Mastery threshold: a skill is reported as mastered when `pKnown >= 0.95`. This is the threshold used in
  the Cognitive Tutor literature and is deliberately high so that the "complete" state is meaningful.
- Mastery state is persisted in `localStorage` under `jsversehub-mastery`.
- The module exposes the log-likelihood of an observation sequence under a given parameter set, so that
  parameters can be fitted offline (grid search or EM) against exported analytics logs without changing the
  runtime code.

The default parameters are conventional starting values from the BKT literature rather than values fitted
to this platform's learners; no such dataset existed at the time of the decision. They are intended to be
replaced by fitted values once exported logs are available, following the process in `CONTRIBUTING.md`
(evidence cited, tests against hand-computed values, rationale note in `docs/research/`).

## Consequences

Easier:

- Four parameters per skill, each with a plain-language meaning, so the model can be explained to a
  learner or a teacher in a paragraph.
- The update is a few lines of arithmetic; `tests/engine/knowledgeTracing.test.js` checks it against
  values computed by hand.
- It runs from a single learner's history, on-device, with no training step.
- Exposing the log-likelihood keeps fitting outside the runtime and makes parameter changes auditable.

Harder:

- BKT assumes no forgetting; once mastered, a skill stays mastered in the model. Forgetting is handled
  separately by the spaced-repetition scheduler (ADR 0004), and the two are composed by
  `src/engine/learningModel.js`. This split is a design choice, and the interaction between the two models
  is a known area for future evaluation.
- Parameters are shared across all learners and are the same for every concept by default. Per-concept
  fitted parameters are supported by the API but not shipped.
- BKT has known identifiability problems (Beck & Chang, 2007): different parameter sets can produce the
  same predictions, and unconstrained fitting can produce degenerate values (for example `pGuess > 0.5`).
  Any fitting procedure should apply the usual plausibility bounds and say so.
- Compared with DKT, predictive accuracy will be lower on large datasets. That trade-off is accepted in
  favour of transparency and on-device operation.

References:

- Corbett, A. T., & Anderson, J. R. (1995). Knowledge tracing: Modeling the acquisition of procedural
  knowledge. _User Modeling and User-Adapted Interaction_, 4(4), 253-278.
- Beck, J. E., & Chang, K. (2007). Identifiability: A fundamental problem of student modeling. In
  _Proceedings of User Modeling 2007_.
