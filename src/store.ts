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

// Day-1: in-memory. Later: DynamoDB adapter.
const ORDERS = new Map<string, Order>();
const TICKETS = new Map<string, Ticket>();

export const TEST_USER_ID = "user_demo_001";

export const store = {
  putOrder(order: Order) {
    ORDERS.set(order.id, order);
  },
  putTicket(ticket: Ticket) {
    TICKETS.set(ticket.id, ticket);
  },
  getTicket(ticketId: string) {
    return TICKETS.get(ticketId);
  },
  listTicketsByUser(userId: string) {
    return Array.from(TICKETS.values()).filter((t) => t.userId === userId);
  },
};
