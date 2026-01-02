import type { Meta, StoryObj } from "@storybook/react";
import { EventCard } from "./EventCard";
import type { Event } from "../api";

const mock: Event = {
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
};

const meta: Meta<typeof EventCard> = {
  title: "Molecules/EventCard",
  component: EventCard,
  args: {
    event: mock,
  },
};
export default meta;

type Story = StoryObj<typeof EventCard>;

export const Default: Story = {};

export const Busy: Story = {
  args: { busyTierId: "vip" },
};
