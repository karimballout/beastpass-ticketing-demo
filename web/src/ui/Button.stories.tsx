import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  args: {
    children: "Buy VIP · 699 SAR",
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: "primary" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "My Tickets" },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Buying..." },
};
