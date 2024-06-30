import type { Meta, StoryObj } from '@storybook/react';
import { RadioOptions } from './RadioOptions';

const meta: Meta<typeof RadioOptions> = {
  title: 'Components/RadioOptions',
  component: RadioOptions,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  args: {
    options: ['Immediately', 'Recurring', 'Specific Time'],
    direction: 'vertical',
  },
};

export const Horizontal: Story = {
  args: {
    options: ['Immediately', 'Recurring', 'Specific Time'],
    direction: 'horizontal',
  },
};
