import Constants from "expo-constants";

type Extra = { apiBaseUrl?: string };

function apiBase() {
  const extra = (Constants.expoConfig?.extra ?? {}) as Extra;
  if (!extra.apiBaseUrl) throw new Error("Missing expo.extra.apiBaseUrl in app.config.ts");
  return extra.apiBaseUrl.replace(/\/$/, "");
}

export type Ticket = {
  id: string;
  orderId: string;
  userId: string;
  eventId: string;
  tierId: string;
  status: "ISSUED" | "SCANNED";
  issuedAt: string;
  scannedAt?: string;
  qrPayload: string;
};

export async function fetchMyTickets(): Promise<Ticket[]> {
  const res = await fetch(`${apiBase()}/me/tickets`);
  if (!res.ok) throw new Error(`Failed to fetch tickets: ${res.status}`);
  const json = await res.json();
  return json.tickets as Ticket[];
}

export async function validateTicket(qrPayload: string) {
  const res = await fetch(`${apiBase()}/tickets/validate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ qrPayload }),
  });
  const json = await res.json();
  return { status: res.status, json };
}
