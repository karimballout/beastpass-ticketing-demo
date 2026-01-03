import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { createOrder, fetchEvents, type Event, type Ticket } from "./api";
import "./App.css";

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string>("");
  const [busyTier, setBusyTier] = useState<string>("");
  const [lastTicket, setLastTicket] = useState<Ticket | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch((e) => setError(e?.message ?? "Unknown error"));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function makeQr() {
      setQrDataUrl("");
      if (!lastTicket) return;

      const url = await QRCode.toDataURL(lastTicket.qrPayload, { margin: 1, scale: 6 });
      if (!cancelled) setQrDataUrl(url);
    }

    makeQr().catch((e) => setError(e?.message ?? "Failed to generate QR"));
    return () => { cancelled = true; };
  }, [lastTicket]);

  async function buy(eventId: string, tierId: string) {
    setError("");
    setBusyTier(`${eventId}:${tierId}`);
    try {
      const { ticket } = await createOrder({ eventId, tierId });
      setLastTicket(ticket);
    } catch (e: any) {
      setError(e?.message ?? "Purchase failed");
    } finally {
      setBusyTier("");
    }
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 24, fontFamily: "system-ui" }}>
      {error && (
        <div style={{ padding: 12, border: "1px solid #f99", borderRadius: 8, marginBottom: 16 }}>
          <strong>API error:</strong> {error}
        </div>
      )}

      {lastTicket && (
        <div style={{ padding: 14, border: "1px solid #8bd", borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <span>Last issued ticket</span>
            <span style={{ opacity: 0.8 }}>Status: {lastTicket.status}</span>
          </div>

          <div style={{ marginTop: 6, opacity: 0.85 }}>Ticket ID: {lastTicket.id}</div>

          <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginTop: 12, flexWrap: "wrap" }}>
            <div style={{ minWidth: 220 }}>
              <div style={{ opacity: 0.85, marginBottom: 8 }}>Scan this QR (mobile scanner later):</div>
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Ticket QR"
                  style={{ width: 220, height: 220, borderRadius: 12, border: "1px solid #333" }}
                />
              ) : (
                <div style={{ width: 220, height: 220, borderRadius: 12, border: "1px solid #333", display: "grid", placeItems: "center", opacity: 0.7 }}>
                  Generating...
                </div>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ opacity: 0.85, marginBottom: 8 }}>QR payload:</div>
              <pre style={{ whiteSpace: "pre-wrap", margin: 0, padding: 10, borderRadius: 8, background: "#111", color: "#ddd" }}>
                {lastTicket.qrPayload}
              </pre>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12 }}>
        {events.map((e) => (
          <div key={e.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{e.title}</div>
            <div style={{ opacity: 0.8 }}>{e.city} · {e.venue}</div>
            <div style={{ opacity: 0.7, marginTop: 6 }}>
              {new Date(e.startsAt).toLocaleString()}
            </div>
            <p style={{ marginBottom: 10, opacity: 0.9 }}>{e.description}</p>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {e.ticketTiers.map((t) => {
                const key = `${e.id}:${t.id}`;
                const loading = busyTier === key;
                return (
                  <button
                    key={t.id}
                    onClick={() => buy(e.id, t.id)}
                    disabled={!!busyTier}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid #444",
                      background: "#1b1b1b",
                      color: "white",
                      cursor: busyTier ? "not-allowed" : "pointer",
                      opacity: loading ? 0.7 : 1,
                    }}
                    title={t.perks.join(" • ")}
                  >
                    {loading ? "Buying..." : `Buy ${t.name} · ${t.priceSar} SAR`}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
