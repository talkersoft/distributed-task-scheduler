import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { DataSelector } from './DataSelector';
import moment from 'moment-timezone';

const meta = {
  title: 'Components/Data Selector',
  component: DataSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    items: { control: 'object' },
    placeholder: { control: 'text' },
    selected: { control: 'text' },
    onChange: { action: 'changed' },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof DataSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: ['Item 1', 'Item 2'],
    placeholder: 'Select an item',
  },
};

export const TimeZoneSelector: Story = {
  args: {
    items: moment.tz.names(),
    placeholder: 'Select a time zone',
  },
};

export const TimeZoneDefault: Story = {
  args: {
    items: moment.tz.names(),
    placeholder: 'Select a time zone',
    selected: moment.tz.guess(),
  },
};
