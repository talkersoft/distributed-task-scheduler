import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { DateSelector, DateSelectorProps } from './DateSelector';

const meta = {
  title: 'Components/Date Selection',
  component: DateSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholderText: { control: 'text' },
    selected: { control: 'date' },
    minDate: { control: 'date' },
    maxDate: { control: 'date' },
  },
  args: { onChange: fn() },
} satisfies Meta<typeof DateSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DateSelectorBasic: Story = {
  args: {},
};

export const DateSelectorCustomPlaceholder: Story = {
  args: {
    placeholderText: 'Please choose a date',
  },
};

export const DateSelectorRestrictedFutureSelection: Story = {
  args: {
    placeholderText: 'Choose any date from now into the future',
    minDate: new Date(),
  },
};

export const DateSelectorRestrictedRangeSelection: Story = {
  args: {
    placeholderText: 'Choose any date from now up to 3 months into the future',
    minDate: new Date(),
    maxDate: (() => {
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 3);
      return maxDate;
    })(),
  },
};
