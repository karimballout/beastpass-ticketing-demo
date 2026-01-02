import Fastify from "fastify";
import cors from "@fastify/cors";

import { EVENTS, findEvent } from "./src/data";
import { store, TEST_USER_ID } from "./src/store";
import { CreateOrderSchema, createOrder } from "./src/handlers/createOrder";
import { ValidateTicketSchema, validateTicket } from "./src/handlers/validateTicket";

async function main() {
  const app = Fastify({ logger: true });
  await app.register(cors, { origin: true, credentials: true });

  app.get("/health", async () => {
    return { ok: true, service: "beastpass-api", time: new Date().toISOString() };
  });

  app.get("/events", async () => ({ events: EVENTS }));

  app.get("/events/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const event = findEvent(id);
    if (!event) return reply.code(404).send({ error: "EVENT_NOT_FOUND" });
    return { event };
  });

  app.post("/orders", async (req, reply) => {
    const parsed = CreateOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "BAD_REQUEST", details: parsed.error.flatten() });
    }

    try {
      const result = createOrder(parsed.data);
      return reply.code(201).send(result);
    } catch (e: any) {
      const code = typeof e?.code === "number" ? e.code : 500;
      return reply.code(code).send({ error: e?.message ?? "INTERNAL_ERROR" });
    }
  });

  app.get("/me/tickets", async () => {
    const tickets = store.listTicketsByUser(TEST_USER_ID);
    return { tickets };
  });

  app.post("/tickets/validate", async (req, reply) => {
    const parsed = ValidateTicketSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "BAD_REQUEST", details: parsed.error.flatten() });
    }

    const result = validateTicket(parsed.data);
    if (result.valid) return result;

    // map reasons to HTTP codes
    const status =
      result.reason === "TICKET_NOT_FOUND" ? 404 :
      result.reason === "ALREADY_SCANNED" ? 409 :
      400;

    return reply.code(status).send(result);
  });

  const port = Number(process.env.PORT ?? 3000);
  const host = "0.0.0.0";
  await app.listen({ port, host });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
