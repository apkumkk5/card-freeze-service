// Card Freeze Service: a small practice API that follows openapi.yaml.
// Run it with:  node server.js
const http = require("http");
const PORT = 3000;

// Practice data (kept in memory; resets when you restart the server)
const cards = {
  crd_4821: { cardId: "crd_4821", customerId: "cust_001", last4: "4821", status: "ACTIVE",          statusChangedAt: "2026-10-01T09:00:00Z" },
  crd_5555: { cardId: "crd_5555", customerId: "cust_001", last4: "5555", status: "LOST",            statusChangedAt: "2026-09-15T14:20:00Z" },
  crd_7001: { cardId: "crd_7001", customerId: "cust_002", last4: "7001", status: "CLOSED",          statusChangedAt: "2026-08-30T11:00:00Z" },
  crd_6310: { cardId: "crd_6310", customerId: "cust_002", last4: "6310", status: "TEMPORARY_BLOCK", statusChangedAt: "2026-11-10T18:30:00Z" }
};
const history = []; // audit log (BR-6)

const REASONS = ["MISPLACED", "TRAVEL", "SUSPECTED_FRAUD", "OTHER"];
const REQUESTERS = ["CUSTOMER_APP", "CALL_CENTER"];

// Send a JSON answer
function reply(res, code, body) {
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}
function error(res, code, errorCode, message) {
  reply(res, code, { code: errorCode, message: message });
}
// Only these 4 fields go back to the app (never customerId)
function view(card) {
  return { cardId: card.cardId, last4: card.last4, status: card.status, statusChangedAt: card.statusChangedAt };
}

const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    // Health check, so you can test in a browser: http://localhost:3000/health
    if (req.method === "GET" && req.url === "/health") return reply(res, 200, { ok: true });

    // Which endpoint? /cards/{cardId}/status | freeze | unfreeze
    const match = req.url.match(/^\/cards\/([^/]+)\/(status|freeze|unfreeze)$/);
    if (!match) return error(res, 404, "NOT_FOUND", "No such endpoint");
    const cardId = match[1];
    const action = match[2];

    // Security: a login token is required (401)
    const auth = req.headers["authorization"] || "";
    if (!auth.startsWith("Bearer ") || auth.length < 8) return error(res, 401, "UNAUTHORIZED", "Access token is missing or expired");

    // Find the card (404)
    const card = cards[cardId];
    if (!card) return error(res, 404, "CARD_NOT_FOUND", "No card with ID " + cardId);

    // GET /cards/{cardId}/status
    if (action === "status" && req.method === "GET") return reply(res, 200, view(card));

    // POST /cards/{cardId}/freeze
    if (action === "freeze" && req.method === "POST") {
      let data;
      try { data = body ? JSON.parse(body) : {}; } catch { return error(res, 400, "INVALID_REQUEST", "Body is not valid JSON"); }
      if (!REASONS.includes(data.reason)) return error(res, 400, "INVALID_REQUEST", "reason is missing or not allowed");
      if (!REQUESTERS.includes(data.requestedBy)) return error(res, 400, "INVALID_REQUEST", "requestedBy is missing or not allowed");
      if (card.status !== "ACTIVE") return error(res, 409, "INVALID_STATUS", "Card status " + card.status + " cannot be frozen");
      return changeStatus(res, card, "TEMPORARY_BLOCK", data.reason, data.requestedBy);
    }

    // POST /cards/{cardId}/unfreeze
    if (action === "unfreeze" && req.method === "POST") {
      if (card.status !== "TEMPORARY_BLOCK") return error(res, 409, "NOT_FROZEN", "Card is not frozen");
      return changeStatus(res, card, "ACTIVE", null, "CUSTOMER_APP");
    }

    return error(res, 405, "METHOD_NOT_ALLOWED", "Method not allowed");
  });
});

// Change a card's status and record it in the audit log
function changeStatus(res, card, newStatus, reason, requestedBy) {
  const now = new Date().toISOString();
  history.push({ cardId: card.cardId, oldStatus: card.status, newStatus: newStatus, reason: reason, requestedBy: requestedBy, changedAt: now });
  card.status = newStatus;
  card.statusChangedAt = now;
  console.log("History:", history[history.length - 1]);
  return reply(res, 200, view(card));
}

server.listen(PORT, () => console.log("Card Freeze Service running at http://localhost:" + PORT));