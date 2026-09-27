# ADR 0006: Quality gates in git hooks and CI

- **Status**: Accepted
- **Date**: 2026-09-27

## Context

The codebase grew for a long time without automated checks. The result was inconsistent formatting, code
that would not lint, and a test suite that was run by hand. Once the learner models were added, the
project's research claims began to depend on the correctness of specific arithmetic, and "it worked when I
ran it" stopped being good enough.

We needed to decide which checks to run, where to run them, and what to do about coverage.

Alternatives considered for coverage in particular:

- No coverage threshold. Rejected: coverage would drift down silently.
- An aspirational threshold (80% or 90%). Rejected: the codebase did not meet it, so the gate would either
  be red from day one and ignored, or be met by writing low-value tests to satisfy the number.
- A threshold set at the current measured value, raised as coverage genuinely improves. Chosen.

## Decision

Three layers, all running the same commands:

1. **Pre-commit hook** (husky 9 + lint-staged): lints and formats only the staged files, so a commit
   cannot introduce lint errors or unformatted code. It is fast enough not to be annoying.
2. **Pre-push hook**: `npm run lint && npm run test:ci`. The full suite runs before code leaves the
   machine.
3. **CI** (`.github/workflows/ci.yml`) on Node 18, 20 and 22: `npm run lint`, `npm run format:check`,
   `npm run test:ci`, then a separate job that performs a production build. Three Node versions are tested
   because the project promises Node >= 18 and the versions differ in enough details (fetch, test runner,
   V8 features) to catch real problems.

Tools:

- ESLint with `airbnb-base` and `eslint-config-prettier`, plus two deliberate overrides: relaxed rules for
  tests, and a broad override for `src/concepts/**` because teaching content intentionally demonstrates
  anti-patterns.
- Prettier for formatting (2 spaces, single quotes, semicolons, no trailing commas).
- Stylelint 15 for CSS.
- Jest 29 with jsdom. `test:ci` runs with coverage. Jest's `coverageThreshold` requires at least 85%
  statements/lines and 75% branches/functions on the engine modules that have real unit tests
  (`contentRegistry`, `spacedRepetition`, `knowledgeTracing`, `learningAnalytics`, `learningModel`,
  `stateManager`), and a global floor of 22% statements/lines, 18% functions and 14% branches on the
  remaining files (UI components and the large teaching-content modules).

The coverage floor is an honest one: it is the level the suite actually reached when the gate was
introduced, rounded down. Its job is to stop regression, not to signal quality. It is raised when a
change makes that true, and never lowered to make a build pass.

## Consequences

Easier:

- Every commit on `main` lints, formats and passes 23 suites / 779 tests on three Node versions, and the
  production build is known to succeed.
- Formatting arguments are over; Prettier decides.
- Learner-model changes cannot be merged without their tests passing, which backs up the requirement in
  `CONTRIBUTING.md` that such changes include tests against hand-computed values.

Harder:

- The pre-push hook runs the full suite, which takes noticeably longer than pre-commit. Contributors who
  push frequently will feel it. Bypassing hooks with `--no-verify` is discouraged, and CI catches it
  anyway.
- The `src/concepts/**` ESLint override is wide. It is the right trade-off for teaching content, but it
  means lint gives less protection there; content correctness relies on the per-concept test suites.
- The coverage floor is low compared with common targets. That is deliberate (see above), but it means a
  reader should look at the coverage report rather than the threshold to judge test depth.
- Adding a Node version to the matrix, or a new gate, multiplies CI time. Gates should be added when
  they catch a class of real bug, not because they are available.
