# JSVerseHub

**A research-grade interactive JavaScript learning platform.** Fifteen JavaScript topics are presented as
planets in a galaxy; each planet bundles authored sections with runnable examples, graded exercises and a
quiz. Underneath the game layer, the platform keeps an explicit, inspectable model of what the learner knows
and schedules practice accordingly: SM-2 spaced repetition, Bayesian Knowledge Tracing and a local,
privacy-preserving learning-analytics log that can be exported for studies.

[![CI](https://github.com/SatvikPraveen/JSVerseHub/actions/workflows/ci.yml/badge.svg)](https://github.com/SatvikPraveen/JSVerseHub/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node >= 18](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](.node-version)
[![Cite](https://img.shields.io/badge/cite-CITATION.cff-blue.svg)](CITATION.cff)

<p align="center"><img src="public/images/ui/logo.png" alt="JSVerseHub logo" width="160"></p>

## Why this project exists

Most "learn JavaScript" sites are content with a progress bar. JSVerseHub is built to be a **testbed for
learning-science ideas in programming education**: every design choice is traceable to a principle in the
literature, every learner interaction is logged in a documented schema, and the learner model is a
transparent algorithm whose parameters can be fitted from exported data. The repository ships with a
pre-registrable evaluation protocol so that the design can be tested rather than assumed to work.

See [docs/research](docs/research/README.md) for the pedagogical framework, evaluation protocol, data schema
and bibliography, and [docs/adr](docs/adr/README.md) for the architecture decision records.

## What is inside

| Layer              | Module                            | What it does                                                                |
| ------------------ | --------------------------------- | --------------------------------------------------------------------------- |
| Content            | `src/concepts/<id>/index.js`      | 15 authored modules: sections, runnable examples, exercises, quizzes        |
| Content pipeline   | `src/engine/contentRegistry.js`   | Lazy-loads each module as its own chunk and normalises it for the viewer    |
| Progression        | `src/engine/stateManager.js`      | Prerequisite-gated unlocks, XP, levels, achievements, persistence           |
| Spaced repetition  | `src/engine/spacedRepetition.js`  | SM-2 scheduler; quiz questions become review cards                          |
| Learner model      | `src/engine/knowledgeTracing.js`  | Two-state Bayesian Knowledge Tracing per concept and tagged skill           |
| Learning analytics | `src/engine/learningAnalytics.js` | xAPI-inspired statement log, on-device only, JSON/CSV export                |
| Facade             | `src/engine/learningModel.js`     | Feeds every quiz answer into all three models; exposes summaries and export |
| UI                 | `src/components/*`                | Galaxy map, planet cards, concept viewer, progress modal with mastery panel |

Concepts: Basics, DOM, Async, ES6+, OOP, Functional, Patterns, Storage, Events, Testing, Security,
Algorithms, Canvas, API, Performance.

### The learner model in one paragraph

Each quiz answer is an observation for Bayesian Knowledge Tracing (prior 0.20, learn 0.15, slip 0.10,
guess 0.25; mastery at P(known) >= 0.95). The same answer grades an SM-2 review card (quality 0-5 from
correctness, latency and hints; intervals 1, 6, then previous x ease, ease bounded at 1.3) and is written to
the analytics log with its correctness, latency and concept context. The progress modal shows per-concept
P(known) bars, the number of reviews due, an estimated retention figure, and an "Export learning data"
button that produces the file described in [DATA_SCHEMA.md](docs/research/DATA_SCHEMA.md). Parameters are
literature defaults, not yet fitted to JSVerseHub data; `knowledgeTracing.logLikelihood` exists so they can
be fitted offline following the [evaluation protocol](docs/research/EVALUATION_PROTOCOL.md).

## Getting started

Requirements: Node.js 18 or newer (20 recommended; see `.node-version`) and npm 9+.

```bash
git clone https://github.com/SatvikPraveen/JSVerseHub.git
cd JSVerseHub
npm ci
npm run dev          # http://localhost:3000 with CSS/JS watchers
```

Production:

```bash
npm run build        # webpack production build into dist/
npm start            # Express serves dist/ on PORT (default 3000)
# or
docker compose up --build
```

## Development workflow

| Command                   | Purpose                                                             |
| ------------------------- | ------------------------------------------------------------------- |
| `npm test`                | Jest (26 suites, 805 tests, jsdom)                                  |
| `npm run test:coverage`   | Coverage report in `coverage/`                                      |
| `npm run lint`            | ESLint (airbnb-base + prettier) and Stylelint                       |
| `npm run format`          | Prettier                                                            |
| `npm run validate`        | lint + format check + tests with coverage thresholds (what CI runs) |
| `npm run optimize:images` | Resize and quantise PNG assets (idempotent)                         |
| `npm run analyze`         | Bundle analyzer                                                     |

Git hooks (husky): `pre-commit` runs lint-staged; `pre-push` runs `npm run lint && npm run test:ci`.
CI runs the same gates on Node 18, 20 and 22 and then a production build.

Coverage is reported honestly rather than aspirationally: the engine modules with real unit tests
(`contentRegistry`, `spacedRepetition`, `knowledgeTracing`, `learningAnalytics`, `learningModel`,
`stateManager`) must stay above 85% statements; the rest of the codebase (UI components and the large
teaching-content modules) has a lower floor. See ADR 0006.

## Project layout

```
src/
  concepts/<id>/      authored teaching content (one lazy chunk each)
  engine/             state, routing, rendering, content pipeline, learner models
  components/         Navbar, Modal, GalaxyMap, PlanetCard, ConceptViewer
  utils/              logger, DOM helpers, debounce/throttle, colours
  styles/             CSS (custom properties, galaxy theme, responsive rules)
  main.js             bootstrap
public/               index.html and optimised image assets
tests/                Jest suites (unit + integration)
scripts/              image optimisation, deployment helpers
docs/
  research/           pedagogical framework, evaluation protocol, data schema, references
  adr/                architecture decision records
  architecture.md, concept-mapping.md, USER_GUIDE.md, QUICKSTART.md, changelog.md
  archive/            historical v1.0 planning/status documents (not current)
.github/workflows/    CI
```

## Privacy

All learner data stays in the browser (`localStorage`). The application makes no network requests other than
for its own static assets, records no names, emails, IPs or user agents, identifies the learner only by a
random UUID, and lets the learner disable or wipe the log at any time. Details and guarantees are in
[docs/research/DATA_SCHEMA.md](docs/research/DATA_SCHEMA.md) and [SECURITY.md](SECURITY.md).

## Contributing and citing

Contributions are welcome; read [CONTRIBUTING.md](CONTRIBUTING.md) first (it includes a step-by-step guide to
adding a concept and the evidence requirements for changing learner-model parameters). Conduct is governed by
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). If you use JSVerseHub in research, cite it with the metadata in
[CITATION.cff](CITATION.cff).

## Status and limitations

- Version 2.0.0. Fully functional; all quality gates pass.
- No learner study has been run yet. The framework is the hypothesis; the protocol is how to test it.
- Learner-model parameters are defaults, skill tags are coarse (mostly one per concept), exercise checks are
  lightweight predicates, and the retention estimate is uncalibrated. These are listed with more detail in
  the [pedagogical framework](docs/research/PEDAGOGICAL_FRAMEWORK.md#5-known-limitations).

## License

MIT. Copyright (c) 2025-2026 Satvik Praveen.
