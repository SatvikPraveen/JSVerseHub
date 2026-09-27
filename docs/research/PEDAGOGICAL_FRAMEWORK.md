# Pedagogical Framework

This document states the learning-science basis for JSVerseHub's design and maps
each principle to the code that implements it. Claims are limited to what the
literature supports and what the implementation actually does; see
[EVALUATION_PROTOCOL.md](EVALUATION_PROTOCOL.md) for how the design's
effectiveness can be measured rather than assumed.

## 1. Learning model

JSVerseHub treats a JavaScript concept (a "planet") as a bundle of
knowledge components: sections to read, worked examples to run, exercises to
attempt and a quiz to pass. The platform maintains an explicit, inspectable
estimate of what the learner knows and uses it to decide what to show next.

| Principle                           | Evidence base                                                                  | Implementation                                                                                                                    |
| ----------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Mastery learning                    | Bloom (1968); Kulik, Kulik & Bangert-Drowns (1990)                             | Planets unlock only after prerequisite concepts are completed (`stateManager.checkPlanetUnlocks`); quizzes require 70% to pass    |
| Retrieval practice / testing effect | Roediger & Karpicke (2006); Rowland (2014)                                     | Every concept ends in a quiz; review cards are recalled, not re-read (`spacedRepetition.js`)                                      |
| Spacing effect                      | Cepeda et al. (2006); Ebbinghaus (1885/1913)                                   | SM-2 schedules each question for review at expanding intervals (`spacedRepetition.review`)                                        |
| Worked examples and faded guidance  | Sweller & Cooper (1985); Renkl (2014)                                          | Sections show complete runnable examples before exercises with starter templates and graded hints                                 |
| Cognitive load management           | Sweller (1988); Mayer & Moreno (2003)                                          | One section at a time in the viewer; examples are segmented with titles; UI chrome is minimal inside the concept modal            |
| Immediate, informative feedback     | Hattie & Timperley (2007); Shute (2008)                                        | Quiz results show the correct option and an explanation per question                                                              |
| Learner modelling                   | Corbett & Anderson (1995); Pelánek (2017)                                      | Bayesian Knowledge Tracing per concept and per tagged skill (`knowledgeTracing.js`) with a mastery threshold of 0.95              |
| Metacognitive monitoring            | Dunlosky & Rawson (2012)                                                       | The progress modal exposes P(known) bars, the review queue and estimated retention so learners can calibrate                      |
| Gamification as scaffolding         | Deterding et al. (2011); Hamari, Koivisto & Sarsa (2014); Sailer et al. (2017) | XP, levels, achievements and planet unlocks reward completion; they are layered on top of, not substituted for, the mastery rules |

## 2. Knowledge tracing

Each concept and each `skill`-tagged quiz question is a knowledge component
tracked with standard two-state BKT:

- Prior P(L0) = 0.20, learning rate P(T) = 0.15, slip P(S) = 0.10, guess
  P(G) = 0.25. These are conservative textbook starting values; they are not
  fitted to JSVerseHub data yet. `knowledgeTracing.logLikelihood` is provided so
  that they can be fitted offline from exported logs (see the protocol).
- After each observed answer the belief is updated by Bayes' rule and then by
  the learning transition. Mastery is declared at P(L) >= 0.95, following the
  convention in cognitive tutors.
- The model is deliberately transparent (four parameters per skill, closed-form
  updates) rather than a deep knowledge-tracing network: with the small,
  on-device datasets a single learner produces, interpretability and
  fit-from-little-data matter more than raw predictive accuracy.

## 3. Spaced repetition

Quiz questions become review cards scheduled by SM-2:

- Quality grades 0-5 are derived from correctness, response latency relative to
  a 30 s expectation and hint usage (`qualityFromAnswer`).
- Intervals follow 1 day, 6 days, then `previous x ease`, with the ease factor
  bounded below at 1.3. A failed recall resets the repetition count and records
  a lapse.
- A simple exponential forgetting curve with the interval as half-life gives an
  "estimated retention" figure for the UI. This is a heuristic for feedback, not
  a calibrated memory model; the evaluation protocol includes a check of its
  calibration against observed recall.

SM-2 was chosen over Leitner (too coarse) and FSRS (more parameters, needs
fitting) because it is well studied, has few free parameters and its schedule
is explainable to the learner. See ADR 0004.

## 4. Analytics for research

Every interaction is recorded locally as an xAPI-inspired statement
(`learningAnalytics.js`, schema in [DATA_SCHEMA.md](DATA_SCHEMA.md)). The design
follows the learning-analytics principle of "collect what you can act on":
views, attempts, answers with correctness and latency, quiz outcomes, reviews.
Nothing leaves the device unless the learner exports it. This makes classroom
studies possible without a server while keeping consent explicit.

## 5. Known limitations

- Parameters are defaults, not fitted. Mastery estimates are therefore
  provisional until the protocol's parameter-fitting step has been run.
- Skill tags are coarse: most questions are tagged only with their concept.
  Finer knowledge components would improve BKT's diagnostic value.
- Exercises are checked with lightweight string/behaviour predicates supplied by
  the content authors, not a full test harness; they measure completion, not
  code quality.
- The forgetting-curve retention estimate is uncalibrated.
- No learner study has been run yet; the framework is the hypothesis, the
  protocol is how to test it.
