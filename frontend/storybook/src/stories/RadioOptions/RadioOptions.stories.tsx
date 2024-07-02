/* Copyright Talkersoft LLC */
/* /frontend/storybook/src/stories/RadioOptions/RadioOptions.stories.tsx */
import type { Meta, StoryObj } from '@storybook/react';
import RadioOptions from './RadioOptions';

const meta: Meta<typeof RadioOptions> = {
  title: 'Components/RadioOptions',
  component: RadioOptions,
  tags: ['autodocs'],
  argTypes: {
    options: { control: { type: 'object' } },
    direction: { control: { type: 'radio', options: ['vertical', 'horizontal'] } },
    onChange: { action: 'changed' },
    value: { control: { type: 'text' } },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  args: {
    options: ['Immediately', 'Recurring', 'Schedule'],
    direction: 'vertical',
    value: 'Recurring',
  },
};

export const Horizontal: Story = {
  args: {
    options: ['Immediately', 'Recurring', 'Schedule'],
    direction: 'horizontal',
    value: 'Recurring',
  },
};
