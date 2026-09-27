# ADR 0002: Lazy-loaded content registry with a normalisation layer

- **Status**: Accepted
- **Date**: 2026-09-27

## Context

Each of the 15 concepts has an authored content module under `src/concepts/<id>/index.js` containing
explanations, examples, exercises and (for some) a quiz. These modules were written over a long period, by
hand, and their shapes drifted: some sections use `concept`/`explanation`/`examples`/`keyPoints`, others
use `title`/`description`/`codeExamples`, some export runnable helper functions instead of code strings,
examples are variously strings, objects or functions, and quizzes are sometimes missing.

Before this decision, `conceptLoader.js` generated placeholder content from a structural description and
the authored modules were used only by the test suites. The authored content was the more valuable
material and was not reaching learners.

Two things had to be decided: how to get the content to the browser, and how to deal with the
heterogeneous shapes.

Alternatives considered:

- Import all 15 modules statically into the main bundle. Rejected: the content is large and a learner
  visits one concept at a time.
- Rewrite all 15 modules to a single canonical shape. Rejected for now: it is a large, error-prone edit of
  teaching material with no functional gain, and the existing test suites depend on the current exports.
- Move content to JSON fetched at runtime. Rejected: content includes runnable functions, and JSON would
  lose the ability to lint and test content as code.

## Decision

- Each concept module is loaded lazily with a dynamic `import()` carrying a `webpackChunkName` comment,
  so webpack emits one chunk per concept (`concept-basics`, `concept-dom`, ...). The main bundle contains
  only the engine and components.
- `src/engine/contentRegistry.js` owns a `CONCEPT_LOADERS` map from concept id to loader function, caches
  loaded modules and de-duplicates in-flight loads.
- The registry contains a normalisation layer that accepts the module shapes found in the codebase and
  produces one canonical structure: `{ id, overview, sections[], exercises[], quiz | null, source }`.
  Section detection is heuristic (`isSectionLike`) and examples are coerced from strings, objects and
  functions into `{ title, code, explanation? }`.
- `conceptLoader.js` prefers registry content and falls back to generated content only for ids the
  registry does not know.
- The normalised object records its provenance in `source` (`'module'` for authored content) so the UI and
  analytics can distinguish authored from generated material.
- `tests/engine/contentRegistry.test.js` asserts that every registered module normalises to at least one
  section, so a module that drifts out of the accepted shapes fails CI.

## Consequences

Easier:

- Authored content reaches learners without a rewrite of 15 modules.
- Initial page load carries only the engine; each concept costs one extra request when first opened.
- New concepts follow the canonical shape documented in `CONTRIBUTING.md` and need no special handling.

Harder:

- The normalisation layer is heuristic. A module that is shaped unusually may normalise to fewer sections
  than the author intended. The registry test catches the "zero sections" case but not "fewer than
  expected"; per-concept tests should assert the expected section count where it matters.
- Two representations of a concept exist in the code (the raw module and the normalised object), and
  contributors need to know that the UI consumes the normalised one.
- Chunking means the concept viewer must handle the asynchronous load state (loading, failure).

Follow-up: as modules are edited for other reasons, migrate them to the canonical shape so that the
heuristics can eventually be narrowed or removed. That would be recorded as a superseding ADR.
