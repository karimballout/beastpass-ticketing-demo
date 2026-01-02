import { test, expect } from "@jest/globals";

const API_BASE = process.env.API_BASE || "http://127.0.0.1:3001";

test("API E2E: events -> order -> validate -> double-scan blocked", async () => {
  // events
  const eventsRes = await fetch(`${API_BASE}/events`);
  expect(eventsRes.status).toBe(200);
  const eventsJson: any = await eventsRes.json();
  expect(Array.isArray(eventsJson.events)).toBe(true);
  expect(eventsJson.events.length).toBeGreaterThan(0);

  // create order
  const orderRes = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ eventId: "soundstorm-2026", tierId: "ga" }),
  });
  expect(orderRes.status).toBe(201);
  const orderJson: any = await orderRes.json();
  expect(orderJson.ticket?.qrPayload).toBeTruthy();

  // validate first time
  const v1Res = await fetch(`${API_BASE}/tickets/validate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ qrPayload: orderJson.ticket.qrPayload }),
  });
  expect(v1Res.status).toBe(200);
  const v1Json: any = await v1Res.json();
  expect(v1Json.valid).toBe(true);
  expect(v1Json.ticket.status).toBe("SCANNED");

  // validate second time should fail
  const v2Res = await fetch(`${API_BASE}/tickets/validate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ qrPayload: orderJson.ticket.qrPayload }),
  });
  expect(v2Res.status).toBe(409);
  const v2Json: any = await v2Res.json();
  expect(v2Json.valid).toBe(false);
  expect(v2Json.reason).toBe("ALREADY_SCANNED");
});
