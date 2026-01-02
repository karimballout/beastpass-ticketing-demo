import { z } from "zod";
import { randomUUID } from "node:crypto";
import { findEvent, findTier } from "../data";
import { store, TEST_USER_ID, type Order, type Ticket } from "../store";

export const CreateOrderSchema = z.object({
  eventId: z.string().min(1),
  tierId: z.string().min(1),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

function shortId(prefix: string) {
  // UUID without dashes, trimmed for readability
  const id = randomUUID().replace(/-/g, "").slice(0, 12);
  return `${prefix}_${id}`;
}

export function createOrder(input: CreateOrderInput): { order: Order; ticket: Ticket } {
  const event = findEvent(input.eventId);
  if (!event) {
    const err = new Error("EVENT_NOT_FOUND");
    (err as any).code = 404;
    throw err;
  }

  const tier = findTier(event, input.tierId);
  if (!tier) {
    const err = new Error("TIER_NOT_FOUND");
    (err as any).code = 404;
    throw err;
  }

  const orderId = shortId("ord");
  const ticketId = shortId("tix");
  const now = new Date().toISOString();

  const order: Order = {
    id: orderId,
    userId: TEST_USER_ID,
    eventId: input.eventId,
    tierId: input.tierId,
    amountSar: tier.priceSar,
    status: "PAID",
    createdAt: now,
  };

  const qrPayload = JSON.stringify({ ticketId, eventId: input.eventId, orderId });

  const ticket: Ticket = {
    id: ticketId,
    orderId,
    userId: TEST_USER_ID,
    eventId: input.eventId,
    tierId: input.tierId,
    status: "ISSUED",
    issuedAt: now,
    qrPayload,
  };

  store.putOrder(order);
  store.putTicket(ticket);

  return { order, ticket };
}
