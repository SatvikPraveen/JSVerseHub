# ADR 0001: Vanilla ES modules, no UI framework

- **Status**: Accepted
- **Date**: 2026-09-27

## Context

JSVerseHub teaches JavaScript. The user interface could have been built with React, Vue, Svelte or a
similar framework, which would have given us a component model, reactive rendering and a large ecosystem
for free.

Several forces pushed the other way:

- The platform's subject is the browser platform itself: the DOM, events, modules, storage, canvas, the
  History API. A learner who opens the source should see those APIs used directly, not hidden behind a
  framework's abstractions. Reading the platform's own code is part of the learning material.
- The application is small: a galaxy map, a concept viewer, a navbar and a modal. The component count does
  not justify a framework's runtime and build complexity.
- Bundle size matters for a site that may be used on school networks. A framework runtime adds tens of
  kilobytes before any application code.
- Fewer dependencies means fewer upgrade cycles and a smaller attack surface for a project maintained by a
  single person.

The alternative of using a framework was considered and rejected for the reasons above. Using TypeScript
was also considered; it was rejected because the compile step and type annotations would be one more thing
between the learner and the JavaScript being taught.

## Decision

The application is written in framework-free ES2022 JavaScript.

- Source is organised as ES modules under `src/` and bundled with webpack 5 and Babel.
- UI pieces under `src/components/` (`Navbar`, `Modal`, `GalaxyMap`, `PlanetCard`, `ConceptViewer`) are
  script-style modules that create their DOM directly and publish a singleton on `window`.
- Application state is managed by a hand-written `stateManager` that persists to `localStorage`.
- Routing is a hand-written hash/history router in `src/engine/navigation.js`.
- The only runtime dependencies are `express` (to serve the built files) and `core-js` (polyfills).

## Consequences

Easier:

- The bundle is small and the build is simple to understand.
- The code that runs the site is written in the same style as the code the site teaches.
- There is no framework version to track; the platform APIs are the dependency.

Harder:

- Components are hand-rolled. Rendering, event wiring and teardown are done by hand, and there is no
  reactive data binding; the components re-render explicitly when state changes.
- The `window`-singleton pattern makes components easy to reach from anywhere but also makes implicit
  coupling easy. Tests have to set up `window` globals under jsdom.
- Contributors used to a framework need to read the existing components before adding new ones, since
  there is no framework convention to lean on. `CONTRIBUTING.md` and the component files themselves are
  the documentation.

We accept these costs. If the UI ever grows enough that hand-rolled components become the main source of
bugs, this decision should be revisited in a new ADR rather than by introducing a framework piecemeal.
