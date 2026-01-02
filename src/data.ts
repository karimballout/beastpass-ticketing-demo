export type TicketTier = { id: string; name: string; priceSar: number; perks: string[] };

export type Event = {
  id: string;
  title: string;
  city: string;
  venue: string;
  startsAt: string; // ISO
  description: string;
  ticketTiers: TicketTier[];
};

export const EVENTS: Event[] = [
  {
    id: "soundstorm-2026",
    title: "SOUNDSTORM",
    city: "Riyadh",
    venue: "Banban",
    startsAt: "2026-02-01T18:00:00.000Z",
    description: "A flagship festival experience with multi-stage lineups and immersive production.",
    ticketTiers: [
      { id: "ga", name: "General Admission", priceSar: 199, perks: ["Entry", "All stages access"] },
      { id: "vip", name: "VIP", priceSar: 699, perks: ["Fast track entry", "VIP lounge access"] },
    ],
  },
  {
    id: "xp-music-futures-2026",
    title: "XP Music Futures",
    city: "Riyadh",
    venue: "JAX District",
    startsAt: "2026-03-10T17:00:00.000Z",
    description: "A music conference + showcases exploring the future of sound and culture.",
    ticketTiers: [
      { id: "conf", name: "Conference Pass", priceSar: 349, perks: ["Talks", "Workshops", "Networking"] },
      { id: "showcase", name: "Showcase Night", priceSar: 149, perks: ["Entry", "Showcase access"] },
    ],
  },
];

export function findEvent(eventId: string) {
  return EVENTS.find((e) => e.id === eventId);
}

export function findTier(event: Event, tierId: string) {
  return event.ticketTiers.find((t) => t.id === tierId);
}
