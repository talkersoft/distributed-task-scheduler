import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TextInput } from './TextInput';
import { isValidCron } from 'cron-validator';

const meta = {
  title: 'Components/Text Input',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    errorMessage: { control: 'text' },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Default Input',
    placeholder: 'Enter text...',
  },
};

export const WithValidation: Story = {
  args: {
    label: 'Validated Input',
    placeholder: 'Enter text...',
    validate: (value: string) => value.length >= 5,
    errorMessage: 'Input must be at least 5 characters long',
  },
};

export const CronValidation: Story = {
  args: {
    label: 'Cron Expression Input',
    placeholder: 'Enter cron expression...',
    validate: (value: string) => isValidCron(value, { alias: true }),
    errorMessage: 'Invalid cron expression',
  },
};
