# Learning Data Schema

Schema version `1.0.0`. All data lives in the browser's `localStorage` and is
exported through the progress modal ("Export learning data"). Nothing is sent
to a server.

## Storage keys

| Key                    | Owner                  | Contents                              |
| ---------------------- | ---------------------- | ------------------------------------- |
| `jsversehub-state`     | `stateManager.js`      | Progress, XP, achievements, settings  |
| `jsversehub-analytics` | `learningAnalytics.js` | Statement log (ring buffer, 5000 max) |
| `jsversehub-reviews`   | `spacedRepetition.js`  | SM-2 cards keyed by card id           |
| `jsversehub-mastery`   | `knowledgeTracing.js`  | BKT skill beliefs keyed by skill id   |

## Export file

`LearningModel.exportAll()` produces:

```json
{
  "exportedAt": "2026-09-27T10:00:00.000Z",
  "analytics": { "schemaVersion": "1.0.0", "exportedAt": "...", "actorId": "<uuid>", "events": [ ...statements ] },
  "reviews": { "<cardId>": { ...card } },
  "mastery": { "<skillId>": { ...skill } }
}
```

## Statement

One statement per interaction, modelled on xAPI's actor/verb/object/result/
context but without the IRI vocabulary.

```json
{
  "id": "<uuid>",
  "schemaVersion": "1.0.0",
  "timestamp": "2026-09-27T10:00:00.000Z",
  "sessionId": "<uuid per page load>",
  "actor": { "anonymousId": "<uuid, stable per browser profile>" },
  "verb": "answered",
  "object": { "type": "question", "id": "basics:q3", "name": "optional label" },
  "result": { "success": true, "response": 1, "responseTimeMs": null, "score": 80 },
  "context": { "sessionElapsedMs": 120345, "conceptId": "basics", "skill": "basics" }
}
```

### Verbs

| Verb                | Object type   | When                                  | Result fields                                                            |
| ------------------- | ------------- | ------------------------------------- | ------------------------------------------------------------------------ |
| `initialized`       | `application` | LearningModel constructed (page load) |                                                                          |
| `viewed`            | `concept`     | Concept modal opened                  |                                                                          |
| `viewed`            | `section`     | Section displayed (`sectionViewed`)   |                                                                          |
| `attempted`         | `exercise`    | Exercise run/checked                  | `success` (bool or null), `hintsUsed`                                    |
| `answered`          | `question`    | Each quiz question on submission      | `success`, `response` (option index), `responseTimeMs`                   |
| `passed` / `failed` | `quiz`        | Quiz submitted                        | `score` (0-100), `success`, `timeExpired`, `mastery` (P(L) after update) |
| `completed`         | `concept`     | Concept marked complete               |                                                                          |
| `reviewed`          | `review-card` | Spaced-repetition review graded       | `quality` (0-5), `nextInterval` (days)                                   |
| `unlocked`          | `concept`     | Reserved for planet unlocks           |                                                                          |
| `exported`          | `application` | Export button pressed                 | `events` (count)                                                         |

Object ids are namespaced `conceptId:localId` where applicable.

## Review card (SM-2)

```json
{
  "id": "basics:q3",
  "repetitions": 2,
  "interval": 6,
  "easeFactor": 2.6,
  "due": 1790000000000,
  "lastReview": 1789500000000,
  "lapses": 0,
  "conceptId": "basics",
  "kind": "question",
  "history": [{ "at": 1789000000000, "quality": 5, "interval": 1 }]
}
```

`due` and `lastReview` are epoch milliseconds; `interval` is in days; `history`
keeps the last 50 reviews.

## Skill belief (BKT)

```json
{
  "pKnown": 0.83,
  "opportunities": 7,
  "correct": 5,
  "history": [{ "correct": true, "pKnown": 0.41, "at": 1789000000000 }]
}
```

`history` keeps the last 100 observations with the belief after each.

## CSV export

`LearningAnalytics.exportCSV()` flattens statements to:

`id,timestamp,sessionId,actorId,verb,objectType,objectId,success,score,responseTimeMs,context`

where `context` is a JSON string.

## Privacy properties

- No names, emails, IP addresses, user agents or URLs are recorded.
- `anonymousId` is a random UUID generated on first use and rotated on
  `clear()`.
- Learners can disable logging (`LearningModel.setAnalyticsEnabled(false)`) or
  wipe it (`reset()`); models keep working without the log.
