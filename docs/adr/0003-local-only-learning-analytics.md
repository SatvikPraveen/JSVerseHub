# ADR 0003: Local-only, xAPI-inspired learning analytics

- **Status**: Accepted
- **Date**: 2026-09-27

## Context

To study how learners use the platform and to feed the spaced-repetition and knowledge-tracing models, the
application needs a record of learning events: concept opened, section viewed, exercise attempted, quiz
answered, review completed, and so on.

Constraints:

- The platform has no accounts and no backend beyond a static file server. There is nothing to log in to
  and nothing to send data to.
- Learners are often minors or students on institutional devices. Collecting behavioural data centrally
  would require consent management, a privacy policy, data-protection review and secure storage, none of
  which a single-maintainer open-source project can responsibly promise.
- Researchers who want to run a study still need data in a standard, analysable form.

Alternatives considered:

- A remote Learning Record Store (LRS) speaking full xAPI. Rejected: requires a server, credentials and a
  privacy regime, and would make the project's "no data leaves the device" promise false.
- Third-party analytics (Google Analytics, Plausible, Mixpanel or similar). Rejected: sends data to a
  third party, is not designed for learning events, and is blocked on many school networks anyway.
- No analytics at all. Rejected: the learner models need an event stream, and the research goals of the
  project depend on being able to export one.

## Decision

`src/engine/learningAnalytics.js` implements a local-only statement log:

- Statements follow an xAPI-inspired `actor` / `verb` / `object` / `result` / `context` / `timestamp`
  shape. The schema is inspired by xAPI for familiarity and easier downstream analysis; it does not claim
  conformance with the xAPI specification and there is no LRS.
- The actor is an anonymous UUID generated on first use and stored locally. No name, email or device
  identifier is recorded.
- The log is a ring buffer of 5000 statements persisted in `localStorage` under `jsversehub-analytics`.
  The oldest statements are dropped when the buffer is full.
- The learner can export the log as JSON or CSV, can opt out (which stops further recording), and can
  clear the stored log.
- Nothing is transmitted. There are no network calls in the analytics module or anywhere else in the
  learner models.

Studies that need data collect it by asking participants to export their log and hand it over, with
whatever consent process the study's own ethics review requires. The platform does not do this for them.

## Consequences

Easier:

- The privacy story is simple and true: data stays on the device, and the code that guarantees it is
  short enough to audit.
- No server, no credentials, no data-protection obligations for the project itself.
- The learner models can consume the same statement stream that researchers export, so what is analysed
  offline is what drove the adaptive behaviour online.

Harder:

- There is no cross-device or cross-browser continuity. Clearing site data erases the log.
- Sample collection for studies is manual (export and submit) and depends on participants.
- The 5000-statement cap bounds storage use but means a long-term heavy user's earliest history is lost.
  The cap was chosen to stay well within typical `localStorage` quotas; it may be tuned, and any change
  should be recorded in `docs/research/`.
- Because the schema is "xAPI-inspired" rather than conformant, tools that expect strict xAPI will need a
  small conversion step.

The statement schema is treated as a public interface: fields may be added, but renaming or removing
fields requires a migration note, since exported logs may already be in use.
