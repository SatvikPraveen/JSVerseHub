# ADR 0004: SM-2 for spaced repetition scheduling

- **Status**: Accepted
- **Date**: 2026-09-27

## Context

Learners forget what they do not revisit. The platform schedules reviews of previously studied material so
that each item comes back shortly before it would otherwise be forgotten. A scheduling algorithm was
needed for `src/engine/spacedRepetition.js`.

Candidates:

- **Leitner system**: a small set of boxes with fixed intervals. Simple, but coarse: it cannot express
  per-item difficulty, and its intervals are arbitrary.
- **SM-2** (Wozniak, 1990; the algorithm behind early SuperMemo and, in modified form, Anki): each item
  carries an ease factor, a repetition count and an interval; a graded recall (0 to 5) updates all three
  with a closed-form rule.
- **FSRS** (Free Spaced Repetition Scheduler): a modern model with a fitted forgetting curve and around
  twenty parameters, generally more accurate than SM-2 when trained on large review histories.
- **Half-life regression** and similar ML approaches: require training data the platform does not have at
  launch and a fitting pipeline.

The platform's requirements favour interpretability and small data: there is no central dataset to fit
against (see ADR 0003), the learner base is small, and one of the project's stated goals is that a student
can read the scheduler and understand it.

## Decision

Implement SM-2 as described by Wozniak (1990):

- Each review item stores `easeFactor` (initial 2.5, floor 1.3), `repetitions`, `interval` in days and the
  next due date.
- A recall grade below 3 resets `repetitions` to 0 and the interval to 1 day. A grade of 3 or higher
  advances: interval 1 day, then 6 days, then `previousInterval * easeFactor`.
- The ease factor is updated by the standard SM-2 formula
  `EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))`, clamped at 1.3.
- Review state is persisted in `localStorage` under `jsversehub-reviews`.

For display purposes the scheduler also reports an estimated retention. It treats the current interval as
the half-life of an exponential forgetting curve, so the estimated probability of recall at time `t` since
the last review is `2^(-t / interval)`. This is a heuristic consistent with the intent of SM-2 (the next
review is due when recall is expected to have decayed noticeably), not a fitted model, and it is labelled
as an estimate in the UI.

## Consequences

Easier:

- The whole scheduler fits in one small module with three state variables per item and no training step.
- Every scheduling decision can be reproduced by hand, which is what the unit tests do
  (`tests/engine/spacedRepetition.test.js` checks the implementation against hand-computed intervals and
  ease factors).
- SM-2 has three decades of use and published critique, so its failure modes are known: it tends to be
  conservative for easy items and its ease factor can spiral downwards for repeatedly failed items
  ("ease hell").

Harder:

- SM-2 is less accurate than FSRS on large review histories. If exported analytics ever provide enough
  data to fit FSRS parameters credibly, moving to FSRS (or offering it as an option) would be a legitimate
  superseding ADR.
- The half-life retention estimate is a simplification. It should not be used as a measured retention
  rate in any study; use the review outcomes in the analytics log instead.
- Grades in the platform are derived from exercise and quiz outcomes rather than self-reported, so the
  0 to 5 scale is mapped from correctness, hints used and response time relative to an expected time
  (`qualityFromAnswer`). That mapping is a parameter choice and any change to it must be justified in
  `docs/research/` as described in `CONTRIBUTING.md`.

Reference: Wozniak, P. A. (1990). _Optimization of learning_. Master's thesis, University of Technology in
Poznan. The SM-2 algorithm description is also available at supermemo.com.
