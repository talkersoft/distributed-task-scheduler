import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TabSelector } from './TabSelector';

const meta: Meta<typeof TabSelector> = {
  title: 'Components/TabSelector',
  component: TabSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    tabs: { control: 'object' },
    onSelect: { action: 'selected' },
  },
  args: {
    onSelect: fn(),
  },
} satisfies Meta<typeof TabSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
  },
};

export const WithCustomTabs: Story = {
  args: {
    tabs: ['Home', 'Profile', 'Settings'],
  },
};
