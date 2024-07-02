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
    items: [
      { key: 'item1', value: 'Item 1' },
      { key: 'item2', value: 'Item 2' },
    ],
    placeholder: 'Select an item',
  },
};

export const TimeZoneSelector: Story = {
  args: {
    items: moment.tz.names().map(name => ({ key: name, value: name })),
    placeholder: 'Select a time zone',
  },
};

export const TimeZoneDefault: Story = {
  args: {
    items: moment.tz.names().map(name => ({ key: name, value: name })),
    placeholder: 'Select a time zone',
    selected: moment.tz.guess(),
  },
};

export const DefaultSelected: Story = {
  args: {
    items: [
      { key: 'item1', value: 'Item 1' },
      { key: 'item2', value: 'Item 2' },
      { key: 'item3', value: 'Item 3' },
    ],
    placeholder: 'Select an item',
    selected: 'item2',
  },
};
