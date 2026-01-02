import { createOrder } from "../src/handlers/createOrder";
import { validateTicket } from "../src/handlers/validateTicket";

describe("BEASTPass ticket flow", () => {
  it("issues a ticket and validates it (then blocks double-scan)", () => {
    const { ticket } = createOrder({ eventId: "soundstorm-2026", tierId: "ga" });

    expect(ticket.id).toMatch(/^tix_/);
    expect(ticket.status).toBe("ISSUED");

    const first = validateTicket({ qrPayload: ticket.qrPayload });
    expect(first.valid).toBe(true);
    if (first.valid) {
      expect(first.ticket.status).toBe("SCANNED");
      expect(first.ticket.scannedAt).toBeTruthy();
    }

    const second = validateTicket({ qrPayload: ticket.qrPayload });
    expect(second.valid).toBe(false);
    if (!second.valid) {
      expect(second.reason).toBe("ALREADY_SCANNED");
      expect(second.scannedAt).toBeTruthy();
    }
  });
});
