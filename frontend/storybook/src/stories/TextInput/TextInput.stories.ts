// Copyright Talkersoft LLC
// /frontend/storybook/src/stories/TextInput/TextInput.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TextInput } from './TextInput';

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
    isValid: { control: 'boolean' },
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
    isValid: false,
    errorMessage: 'Input must be at least 5 characters long',
  },
};

export const CronValidation: Story = {
  args: {
    label: 'Cron Expression Input',
    placeholder: 'Enter cron expression...',
    isValid: false,
    errorMessage: 'Invalid cron expression',
  },
};
