const API_BASE = import.meta.env.VITE_API_BASE_URL;

export type TicketTier = { id: string; name: string; priceSar: number; perks: string[] };
export type Event = {
  id: string;
  title: string;
  city: string;
  venue: string;
  startsAt: string;
  description: string;
  ticketTiers: TicketTier[];
};

export type Order = {
  id: string;
  userId: string;
  eventId: string;
  tierId: string;
  amountSar: number;
  status: "PAID";
  createdAt: string;
};

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

function assertApiBase() {
  if (!API_BASE) throw new Error("VITE_API_BASE_URL is not set");
}

export async function fetchEvents(): Promise<Event[]> {
  assertApiBase();
  const res = await fetch(`${API_BASE}/events`);
  if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`);
  const json = await res.json();
  return json.events as Event[];
}

export async function createOrder(params: { eventId: string; tierId: string }): Promise<{ order: Order; ticket: Ticket }> {
  assertApiBase();
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(params),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error ?? `Order failed: ${res.status}`);
  return json as { order: Order; ticket: Ticket };
}

export async function fetchMyTickets(): Promise<Ticket[]> {
  assertApiBase();
  const res = await fetch(`${API_BASE}/me/tickets`);
  if (!res.ok) throw new Error(`Failed to fetch tickets: ${res.status}`);
  const json = await res.json();
  return json.tickets as Ticket[];
}
