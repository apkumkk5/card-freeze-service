# Card Freeze Service

![API tests](https://github.com/apkumkk5/card-freeze-service/actions/workflows/api-tests.yml/badge.svg)

A portfolio project that takes one banking feature from business requirement to an automatically tested API.

## The business problem
Customers who misplace their card must call the bank to block it. Calls take time, and the card can be misused while they wait.

## The solution
An API that lets customers check, freeze and unfreeze their card from a mobile app, instantly.

## What's in this project
| Stage | Artifact |
|---|---|
| Requirement | Business rules BR-1 to BR-7 (only ACTIVE cards can be frozen, every change is audited, and so on) |
| User stories | Check status, Freeze, Unfreeze, with Given/When/Then acceptance criteria |
| Data design | SQL tables: customers, cards, card_status_history |
| API spec | `openapi.yaml` (OpenAPI 3.0) |
| API | `server.js` (Node.js) |
| Tests | `card-freeze-tests.postman_collection.json` (8 requests, 12 checks) |
| CI/CD | `.github/workflows/api-tests.yml` runs every test on each push |

## Endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/cards/{cardId}/status` | Check a card's status |
| POST | `/cards/{cardId}/freeze` | Freeze a card (needs a reason) |
| POST | `/cards/{cardId}/unfreeze` | Unfreeze a card |

## Run it locally
Run `node server.js`, then open http://localhost:3000/health

## Load test (JMeter)

`card-status-load-test.jmx` checks NFR-1: 95% of status requests must respond in under 500 ms.

**Test setup**

| Setting | Value |
|---|---|
| Endpoint | GET /cards/crd_4821/status |
| Users | 10 |
| Requests per user | 100 |
| Total requests | 1,000 |

**How to run it**

1. Start the API: `node server.js`
2. In a second terminal, run:

    jmeter -n -t card-status-load-test.jmx -l results.jtl -e -o report

3. Open `report/index.html` and read the **95th pct** column.

**Result (local run)**

| Measure | Result |
|---|---|
| Requests | 1,000 |
| Errors | 0% |
| p95 | 1 ms |
| NFR-1 (p95 under 500 ms) | Pass on local |

This was run on a local machine. It must be re-tested in a test environment before sign-off.

## Tools used
OpenAPI / Swagger, Node.js, Postman / Newman, Git, GitHub Actions, SQL, JMeter