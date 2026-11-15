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

## Tools used
OpenAPI / Swagger, Node.js, Postman / Newman, Git, GitHub Actions, SQL