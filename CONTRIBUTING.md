# Contributing to JSVerseHub

Thank you for considering a contribution. JSVerseHub is an MIT-licensed interactive JavaScript learning
platform. This document explains how to set up a development environment, which quality gates a change must
pass, the coding conventions, how to add a new concept module, and what is expected when you touch the
learner models.

## Table of contents

- [Development setup](#development-setup)
- [Quality gates and git hooks](#quality-gates-and-git-hooks)
- [Coding conventions](#coding-conventions)
- [Project layout](#project-layout)
- [Adding a new concept](#adding-a-new-concept)
- [Commits and pull requests](#commits-and-pull-requests)
- [Research contributions](#research-contributions)
- [Reporting bugs and security issues](#reporting-bugs-and-security-issues)

## Development setup

Requirements:

- Node.js 18 or newer (CI runs on 18, 20 and 22)
- npm (bundled with Node)

```bash
git clone https://github.com/SatvikPraveen/JSVerseHub.git
cd JSVerseHub
npm ci
npm run dev
```

`npm ci` installs the exact versions in `package-lock.json` and also installs the husky git hooks.
`npm run dev` starts the Express server in development mode, serving `public/` with the webpack dev build.

Useful scripts:

| Script                    | Purpose                                                      |
| ------------------------- | ------------------------------------------------------------ |
| `npm run dev`             | Development server                                           |
| `npm run build`           | Production build into `dist/` (main bundle + 15 lazy chunks) |
| `npm test`                | Run the Jest test suite                                      |
| `npm run test:coverage`   | Run tests with coverage reporting                            |
| `npm run lint`            | ESLint + Stylelint                                           |
| `npm run lint:fix`        | Same, with automatic fixes                                   |
| `npm run format`          | Prettier, writing changes                                    |
| `npm run format:check`    | Prettier, check only                                         |
| `npm run validate`        | Lint, format check and tests in one command                  |
| `npm run optimize:images` | Re-encode PNG assets under `public/images` (uses `sharp`)    |

## Quality gates and git hooks

Every change has to pass the same gates locally and in CI.

Git hooks (installed by husky 9):

- `pre-commit`: runs `lint-staged`, which lints and formats only the staged files.
- `pre-push`: runs `npm run lint && npm run test:ci`.

CI (`.github/workflows/ci.yml`) runs on Node 18, 20 and 22:

1. `npm run lint`
2. `npm run format:check`
3. `npm run test:ci`
4. a production build (`npm run build`)

The test suite currently consists of 26 Jest suites (805 tests) running under jsdom. Jest enforces two
coverage floors: 85% statements/lines and 75% branches/functions on the engine modules with real unit
tests (`contentRegistry`, `spacedRepetition`, `knowledgeTracing`, `learningAnalytics`, `learningModel`,
`stateManager`), and a global floor of 22% statements/lines, 18% functions and 14% branches on everything
else. The floors reflect measured coverage rather than a target; do not lower them, and raise them when a
change makes that honest.

If a hook blocks you, fix the underlying problem rather than bypassing the hook with `--no-verify`.

## Coding conventions

Style is enforced by ESLint (`airbnb-base` + `eslint-config-prettier`), Prettier and Stylelint 15. The
short version:

- ES2022 modules, no framework, no TypeScript.
- 2-space indentation, single quotes, semicolons, no trailing commas.
- `const` by default, `let` when reassigned, never `var`.
- Strict equality (`===`), no `eval`, no implied eval.
- Prefix intentionally unused parameters and variables with `_`.
- `console.warn` and `console.error` are allowed; other `console` calls produce a lint warning.

Two ESLint overrides exist on purpose and should not be extended without discussion:

- `tests/**/*.js` and `**/*.test.js`: relaxed rules so tests can exercise edge cases.
- `src/concepts/**`: teaching content deliberately demonstrates anti-patterns (`var`, `==`, `new Function`,
  prototype extension, and so on) in order to explain them. The override lets that content lint cleanly.
  Do not use this override as a reason to write engine or component code in the same way.

Run `npm run lint:fix && npm run format` before opening a pull request.

## Project layout

```
src/
  engine/        stateManager, conceptLoader, contentRegistry, navigation, galaxyRenderer,
                 spacedRepetition, knowledgeTracing, learningAnalytics, learningModel
  components/    Navbar, Modal, GalaxyMap, PlanetCard, ConceptViewer (script-style modules that publish
                 singletons on window)
  concepts/<id>/ one authored content module per concept (15 in total)
  utils/         shared helpers
  styles/        CSS
public/          index.html and images (served in development)
dist/            production build output
tests/           Jest suites (tests/<id>.test.js per concept, tests/engine/* for the engine)
scripts/         maintenance scripts (image optimisation, etc.)
docs/            documentation, ADRs (docs/adr), research notes (docs/research), archived material
```

Learner data never leaves the browser. State lives in `localStorage` under `jsversehub-state`,
`jsversehub-analytics`, `jsversehub-reviews` and `jsversehub-mastery`. There is no server-side collection,
no third-party analytics and no PII. Changes that would send learner data anywhere are out of scope.

## Adding a new concept

Concepts are the 15 "planets" in the galaxy (basics, dom, async, es6, oop, functional, patterns, storage,
events, testing, security, algorithms, canvas, api, performance). Adding one is a multi-file change; pick a
short lowercase `<id>` and use it consistently.

### 1. Author the content module

Create `src/concepts/<id>/index.js`. It must export a `<id>Config` object:

```js
export const routingConfig = {
  title: 'Client-Side Routing',
  description: 'How single-page applications map URLs to views',
  difficulty: 'intermediate', // beginner | intermediate | advanced
  estimatedTime: '2-3 hours',
  topics: ['History API', 'Hash routing', 'Route guards'],
  prerequisites: ['Basics', 'DOM', 'Events']
};
```

Teaching content is a set of section objects. Each section carries `concept`, `explanation`, `examples` and
`keyPoints`:

```js
export const historyApi = {
  concept: 'History API',
  explanation: 'pushState and replaceState change the URL without a full page load...',
  examples: {
    pushState: `history.pushState({ page: 1 }, '', '/page-1');`,
    listen: `window.addEventListener('popstate', event => console.log(event.state));`
  },
  keyPoints: ['pushState does not fire popstate', 'The server must serve index.html for every route']
};
```

Add an `exercises` array. Each exercise has `id`, `title`, `difficulty` (`easy` | `medium` | `hard`),
`description`, `template`, `tests` (an array of `{ description, check }`) and `hints`:

```js
export const exercises = [
  {
    id: 'routing-1',
    title: 'Parse a hash route',
    difficulty: 'easy',
    description: 'Return the route name from a location hash such as "#/about".',
    template: `function parseRoute(hash) {\n  // your code\n}`,
    tests: [{ description: 'strips the leading #/', check: code => /replace|slice|substring/.test(code) }],
    hints: ['location.hash includes the leading #']
  }
];
```

Optionally add a `quiz` array of `{ id, question, options, correct, explanation }` objects, where `correct` is
the index of the right option.

The content registry (`src/engine/contentRegistry.js`) normalises heterogeneous module shapes into
`{ overview, sections, exercises, quiz }`, so older modules use slightly different encodings. New modules
should follow the shape above; it needs no special handling.

### 2. Register the module

- In `src/engine/contentRegistry.js`, add a loader to `CONCEPT_LOADERS`:

  ```js
  routing: () => import(/* webpackChunkName: "concept-routing" */ '../concepts/routing/index.js'),
  ```

  The `webpackChunkName` comment makes webpack emit a separate lazy chunk for the concept.

- In `src/engine/conceptLoader.js`, add an entry for the concept to `conceptStructure` (title, difficulty,
  section ids, prerequisites) so navigation, progress tracking and the galaxy map know about it.

### 3. Add the planet image

Place a PNG at `public/images/planets/<id>.png` and run `npm run optimize:images` so the asset is re-encoded
to the same size budget as the others.

### 4. Add tests

Create `tests/<id>.test.js` covering the exercises and any runnable examples. The existing
`tests/engine/contentRegistry.test.js` includes a test asserting that every module registered in
`CONCEPT_LOADERS` normalises to at least one section, so a malformed module fails the suite automatically.

### 5. Verify

```bash
npm run validate
npm run build
```

Confirm that the build emits a `concept-<id>` chunk and that the planet appears in the galaxy in
`npm run dev`.

## Commits and pull requests

Commits follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <short imperative summary>
```

Types in use: `feat`, `fix`, `docs`, `chore`, `style`, `build`, `ci`, `test`, `refactor`. Scopes are
free-form but usually name the area (`engine`, `concepts`, `learning`, `assets`, `ci`). Examples from the
history:

```
feat(learning): add SM-2 spaced repetition, Bayesian knowledge tracing and local analytics
build(assets): optimise PNG assets from 42 MB to 1.9 MB
```

Pull request checklist:

- One logical change per PR; unrelated refactors go in their own PR.
- `npm run validate` and `npm run build` pass locally.
- New behaviour comes with tests; bug fixes come with a regression test.
- The PR description says what changed and why, and links any related issue.
- Documentation (README, docs/) is updated when behaviour or configuration changes.
- No new runtime dependencies without a stated reason; the runtime dependency list is intentionally short.

## Research contributions

The learner models in `src/engine` (`spacedRepetition.js`, `knowledgeTracing.js`, `learningAnalytics.js`
and the `learningModel.js` facade) are the research-facing part of the codebase. They are held to a
stricter standard than UI code:

- Any change to a model's algorithm must come with unit tests that compare the implementation against
  hand-computed values (worked examples in the test file, not just snapshots of the current output).
- Any change to default parameters (for example the BKT defaults `pInit 0.2`, `pTransit 0.15`,
  `pSlip 0.1`, `pGuess 0.25`, mastery threshold `0.95`, or the SM-2 constants) must cite the evidence
  it is based on: a published paper, a reproducible analysis of exported analytics data, or both.
- Each such change is recorded in a short CHANGELOG-style rationale under `docs/research/`, stating what
  changed, why, and how it was validated. The relevant ADR in `docs/adr/` is updated or superseded if the
  decision itself changes.
- The analytics statement schema is treated as a public interface. Additive changes are fine; renaming or
  removing fields requires a migration note, because exported logs may already be in use in studies.
- Everything must remain local-only. Do not add network calls to the learner models.

If you are unsure whether a change counts as a research contribution, open an issue first and describe the
intended change and how you plan to validate it.

## Reporting bugs and security issues

Bugs and feature requests go through GitHub issues. Please include steps to reproduce, the browser and
Node version, and what you expected to happen.

Do not open public issues for security vulnerabilities. See [SECURITY.md](SECURITY.md) for how to report
them privately.

By participating you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md).
