import { z } from "zod";
import { store, type Ticket } from "../store";

export const ValidateTicketSchema = z.object({
  qrPayload: z.string().min(1),
});

export type ValidateTicketInput = z.infer<typeof ValidateTicketSchema>;

export type ValidateResult =
  | { valid: true; ticket: Ticket }
  | { valid: false; reason: string; scannedAt?: string };

export function validateTicket(input: ValidateTicketInput): ValidateResult {
  let payload: { ticketId: string; eventId: string; orderId: string };

  try {
    payload = JSON.parse(input.qrPayload);
  } catch {
    return { valid: false, reason: "INVALID_QR_FORMAT" };
  }

  const ticket = store.getTicket(payload.ticketId);
  if (!ticket) return { valid: false, reason: "TICKET_NOT_FOUND" };

  if (ticket.status === "SCANNED") {
    return { valid: false, reason: "ALREADY_SCANNED", scannedAt: ticket.scannedAt };
  }

  ticket.status = "SCANNED";
  ticket.scannedAt = new Date().toISOString();

  store.putTicket(ticket);
  return { valid: true, ticket };
}
