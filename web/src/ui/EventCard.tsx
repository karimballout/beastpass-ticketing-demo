import type { Event } from "../api";
import { Button } from "./Button";

type Props = {
  event: Event;
  onBuy?: (tierId: string) => void;
  busyTierId?: string;
};

export function EventCard({ event, onBuy, busyTierId }: Props) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14 }}>
      <div style={{ fontWeight: 700, fontSize: 18 }}>{event.title}</div>
      <div style={{ opacity: 0.8 }}>
        {event.city} · {event.venue}
      </div>
      <div style={{ opacity: 0.7, marginTop: 6 }}>{new Date(event.startsAt).toLocaleString()}</div>
      <p style={{ marginBottom: 10, opacity: 0.9 }}>{event.description}</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {event.ticketTiers.map((t) => {
          const loading = busyTierId === t.id;
          return (
            <Button
              key={t.id}
              disabled={!!busyTierId}
              onClick={() => onBuy?.(t.id)}
            >
              {loading ? "Buying..." : `Buy ${t.name} · ${t.priceSar} SAR`}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
