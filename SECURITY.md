# Security Policy

## Supported versions

JSVerseHub is developed on the `main` branch, and that is the only branch that receives security fixes.
Tagged releases are snapshots of `main`; if you self-host a tagged release, upgrade to the latest release or
to `main` to pick up fixes.

| Branch / version      | Supported |
| --------------------- | --------- |
| `main`                | Yes       |
| Latest tagged release | Yes       |
| Older tagged releases | No        |

## Reporting a vulnerability

Please do not open a public GitHub issue for a security vulnerability.

Email **satvikpraveen707@gmail.com** with:

- a description of the issue and the affected file(s) or feature,
- steps to reproduce, or a proof of concept,
- the impact as you understand it,
- whether you would like to be credited in the fix.

You should receive an acknowledgement within a few days. Once the report is confirmed, a fix is prepared on
`main` and the reporter is notified before the details are made public. Please give the maintainer a
reasonable amount of time to release a fix before disclosing publicly.

## Scope and threat model

JSVerseHub is a static single-page application served by a small Express server (`server.js`) that serves
`dist/` in production and `public/` in development. Knowing what the application does and does not do
helps in judging what counts as a vulnerability.

### Learner-authored code execution

The concept viewer (`src/components/ConceptViewer.js`) has a "Run" button that executes the code a learner
types into the editor. It does so with `new Function(...)` in the page's own JavaScript context. This is
sandboxed by convention, not by isolation:

- The code runs same-origin, with the same privileges as the application itself.
- The application makes no network calls of its own and holds no secrets, API keys or session tokens, so
  there is nothing for injected code to exfiltrate beyond what the learner already typed.
- The only persistent state is the learner's own progress in `localStorage`
  (`jsversehub-state`, `jsversehub-analytics`, `jsversehub-reviews`, `jsversehub-mastery`).

A learner running their own code in their own browser is the intended use, and is therefore not a
vulnerability in itself. What would be in scope is any path by which code that the learner did not write
gets executed: for example, if authored concept content, a URL parameter or a shared link could inject code
into the editor or the runner, or if the application ever started loading exercises from a remote source.

### Data handling

All learner data stays on the device. There is no account system, no server-side collection, no
third-party analytics, no cookies set by the application, and no personally identifiable information is
collected. The learning-analytics log uses a randomly generated anonymous actor id and is exported only when
the learner explicitly chooses to export it.

Reports about data leaving the device, or about exported data containing more than the documented fields,
are in scope.

### In scope

- Cross-site scripting or code injection through concept content, exercise templates, URL fragments or
  routing.
- Any behaviour that transmits learner data off the device.
- Dependency vulnerabilities that are actually reachable in the built application or in `server.js`.
- Problems in the build or release pipeline that could ship altered code.

### Out of scope

- Self-hosting misconfiguration: exposing the development server publicly, running without TLS, missing
  security headers on a reverse proxy in front of `server.js`, or serving the app from a domain shared with
  other applications. The repository ships a minimal server; hardening a deployment is the operator's
  responsibility.
- The "Run" button executing code that the learner typed themselves.
- Vulnerabilities in development-only dependencies (webpack, Jest, ESLint and similar) that do not affect
  the built application.
- Denial of service against a learner's own browser tab by their own code (for example an infinite loop in
  an exercise).

## Security-relevant conventions in the codebase

- ESLint forbids `eval`, implied eval and `new Function` in engine and component code; the single
  exception in `ConceptViewer.runCode` is marked with an inline disable and a comment explaining why.
- Concept modules under `src/concepts/` are allowed to demonstrate unsafe patterns for teaching purposes,
  but that code is displayed and optionally run by the learner; it is never executed automatically.
- The runtime dependency list is deliberately short (`express`, `core-js`). Adding runtime dependencies
  requires justification in the pull request.
