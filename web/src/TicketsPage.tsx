import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { fetchMyTickets, type Ticket } from "./api";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState<string>("");
  const [qrMap, setQrMap] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchMyTickets()
      .then(setTickets)
      .catch((e) => setError(e?.message ?? "Failed to load tickets"));
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function buildAll() {
      const entries: [string, string][] = [];
      for (const t of tickets) {
        const url = await QRCode.toDataURL(t.qrPayload, { margin: 1, scale: 5 });
        entries.push([t.id, url]);
      }
      if (!cancelled) setQrMap(Object.fromEntries(entries));
    }
    if (tickets.length) buildAll().catch(() => {});
    return () => { cancelled = true; };
  }, [tickets]);

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ marginBottom: 8 }}>My Tickets</h1>

      {error && (
        <div style={{ padding: 12, border: "1px solid #f99", borderRadius: 8, marginBottom: 16 }}>
          <strong>API error:</strong> {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12 }}>
        {tickets.map((t) => (
          <div key={t.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14 }}>
            <div style={{ fontWeight: 700 }}>Ticket {t.id}</div>
            <div style={{ opacity: 0.8 }}>Event: {t.eventId}</div>
            <div style={{ opacity: 0.8 }}>Tier: {t.tierId}</div>
            <div style={{ opacity: 0.8 }}>Status: {t.status}</div>

            <div style={{ marginTop: 10 }}>
              {qrMap[t.id] ? (
                <img
                  src={qrMap[t.id]}
                  alt="Ticket QR"
                  style={{ width: 200, height: 200, borderRadius: 12, border: "1px solid #333" }}
                />
              ) : (
                <div style={{ width: 200, height: 200, borderRadius: 12, border: "1px solid #333", display: "grid", placeItems: "center", opacity: 0.7 }}>
                  Generating...
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {tickets.length === 0 && !error && (
        <div style={{ marginTop: 16, opacity: 0.75 }}>No tickets yet. Go buy one first.</div>
      )}
    </div>
  );
}
