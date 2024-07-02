import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { DateTimeSelector, DateTimeSelectorProps } from './DateTimeSelector';

const meta: Meta<typeof DateTimeSelector> = {
  title: 'Components/Date Time Selection',
  component: DateTimeSelector,
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
  args: { onChange: action('onChange') },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DateTimeSelectorBasic: Story = {
  args: {},
};

export const DateTimeSelectorCustomPlaceholder: Story = {
  args: {
    placeholderText: 'Please choose a date and time',
  },
};

export const DateTimeSelectorRestrictedFutureSelection: Story = {
  args: {
    placeholderText: 'Choose any date and time from now into the future',
    minDate: new Date(),
  },
};

export const DateTimeSelectorRestrictedRangeSelection: Story = {
  args: {
    placeholderText: 'Choose any date and time from now up to 3 months into the future',
    minDate: new Date(),
    maxDate: (() => {
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 3);
      return maxDate;
    })(),
  },
};

export const WithValidation: Story = {
  args: {
    placeholderText: 'Select a date and time',
    label: 'Validated Selector',
    isValid: false,
    errorMessage: 'Please select a valid date and time',
  },
};
