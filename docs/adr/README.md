# Architecture Decision Records

This directory holds the Architecture Decision Records (ADRs) for JSVerseHub.

An ADR is a short document that captures one significant technical decision: the situation that prompted
it, the decision itself, the alternatives that were considered, and the consequences we accept by choosing
it. ADRs are written when the decision is made and are not rewritten afterwards. If a decision is reversed
or changed, a new ADR is added that supersedes the old one, and the old one's status is updated to point to
it. The result is a record of _why_ the system looks the way it does, which is harder to recover from the
code alone.

## Format

Each ADR is a Markdown file named `NNNN-short-title.md` and contains:

- **Status**: Proposed, Accepted, Deprecated or Superseded by ADR-NNNN
- **Date**: when the status was last changed
- **Context**: the forces at play, including constraints and alternatives considered
- **Decision**: what was decided, stated plainly
- **Consequences**: what becomes easier, what becomes harder, and any follow-up work

Keep ADRs short. Details that belong in code comments, the README or `docs/research/` should live there and
be linked from the ADR.

## Index

| ADR                                           | Title                                                   | Status   |
| --------------------------------------------- | ------------------------------------------------------- | -------- |
| [0001](0001-vanilla-js-no-framework.md)       | Vanilla ES modules, no UI framework                     | Accepted |
| [0002](0002-lazy-loaded-content-registry.md)  | Lazy-loaded content registry with a normalisation layer | Accepted |
| [0003](0003-local-only-learning-analytics.md) | Local-only, xAPI-inspired learning analytics            | Accepted |
| [0004](0004-sm2-spaced-repetition.md)         | SM-2 for spaced repetition scheduling                   | Accepted |
| [0005](0005-bayesian-knowledge-tracing.md)    | Bayesian Knowledge Tracing as the learner model         | Accepted |
| [0006](0006-quality-gates-and-ci.md)          | Quality gates in git hooks and CI                       | Accepted |

## Adding an ADR

1. Copy the section structure from an existing ADR.
2. Use the next free number.
3. Add a row to the index above.
4. If the ADR supersedes another, update that ADR's status line.

Decisions about the learner models (ADRs 0003 to 0005) also fall under the "research contributions"
section of [CONTRIBUTING.md](../../CONTRIBUTING.md): a change to those models needs tests against
hand-computed values and a rationale note in `docs/research/`.
