# Evaluation Protocol

A pre-registrable plan for evaluating JSVerseHub's learning design. It is
written so that a study can be run with the software as shipped, using only the
data the platform records on-device and the export button in the progress
modal.

## 1. Research questions

- RQ1 (learning): Do learners who use the platform improve on an independent
  JavaScript assessment from pre-test to post-test?
- RQ2 (spacing): Does completing scheduled reviews improve delayed retention
  compared with no reviews?
- RQ3 (learner model): How well do the BKT mastery estimates predict a
  learner's next answer, and how much better after parameters are fitted?
- RQ4 (engagement): Which gamification signals (XP, achievements, unlocks) are
  associated with continued use, controlling for prior knowledge?

## 2. Design

Recommended: two-arm randomised design with a 2-week delayed post-test.

| Arm       | Condition                                                                                                             |
| --------- | --------------------------------------------------------------------------------------------------------------------- |
| Control   | Platform with the review queue hidden (`LearningModel.setAnalyticsEnabled` stays on; reviews are simply not surfaced) |
| Treatment | Platform with the review queue and mastery panel visible                                                              |

Both arms complete the same pre-test, use the platform for the same nominal
time (suggested: 3 sessions of 45 minutes over one week), and take an immediate
and a 2-week delayed post-test. Assignment is by coin flip per participant,
recorded by the researcher; the platform itself does not randomise.

Minimum sample: with an expected medium effect (d = 0.5), alpha = 0.05 and
power = 0.8, about 64 participants per arm for a two-sample comparison. Pilot
with 10-15 first to check instruments and logging.

## 3. Instruments

- Pre/post-test: 20 items sampled from the concept quizzes but NOT shown in the
  platform during the study (hold out one question per concept via the
  `skill` tag or a separate item bank). Score = proportion correct.
- Platform logs: the JSON export from the progress modal, one file per
  participant per session (see [DATA_SCHEMA.md](DATA_SCHEMA.md)).
- Optional: a short self-report on perceived usefulness of the mastery panel.

## 4. Procedure

1. Consent. Explain that all data is stored in the participant's browser and
   only shared through the export file they hand over.
2. Pre-test on paper or in a separate form.
3. Sessions. Participants use their assigned build. At the end of each session
   they open the progress modal and export the learning data file.
4. Immediate post-test after the final session.
5. Delayed post-test after 14 days, without platform access in between.

## 5. Measures and analysis

- RQ1: paired t-test (or Wilcoxon) pre vs immediate post within arm; report
  effect size (Cohen's d) and 95% CI.
- RQ2: mixed ANOVA with arm (between) x time (immediate, delayed); the key
  contrast is the arm x time interaction on the delayed test. Also correlate
  number of completed `reviewed` statements with delayed score.
- RQ3: from each participant's `answered` statements, compute for each answer
  the model's prediction `predictCorrect(P(L))` before the update. Report AUC
  and RMSE with default parameters, then re-fit `pInit, pTransit, pSlip, pGuess`
  per concept by maximising `logLikelihood` on a 70% split and re-evaluate on
  the remaining 30%. Report the improvement.
- RQ4: survival analysis of days-until-last-session with achievements earned
  per session as a time-varying covariate; or simpler, Spearman correlation
  between achievements and total time-on-task from the analytics summary.
- Retention calibration: for each review, bin `retentionEstimate` at the time of
  review into deciles and plot observed recall rate per bin (reliability
  diagram).

## 6. Data handling

- Files contain only an anonymous UUID as actor. Do not add participant names
  to file names; keep a separate key sheet if linkage to test scores is needed.
- Store exports on encrypted institutional storage; delete the key sheet after
  analysis.
- The platform does not transmit data. Confirm in the browser's network panel
  during the pilot; the only requests are for static assets.

## 7. Threats to validity

- Testing effect from the pre-test itself; mitigate with the held-out item
  bank and a no-pre-test group if resources allow.
- Time-on-task differences between arms; report and control for
  `timeOnTaskMs` from the summary.
- Default BKT parameters may under- or over-estimate mastery; RQ3 quantifies
  this.
- Self-selection in voluntary studies.

## 8. Reporting checklist

Report: participant counts per arm and attrition, instrument reliability
(Cronbach's alpha on the test), all pre-registered analyses regardless of
outcome, effect sizes with CIs, the exact commit hash of the build used
(`git rev-parse HEAD`), and the exported schema version.
