import type { Meta, StoryObj } from '@storybook/react';
import { RadioOptions } from './RadioOptions';

const meta: Meta<typeof RadioOptions> = {
  title: 'Components/RadioOptions',
  component: RadioOptions,
  tags: ['autodocs'],
  argTypes: {
    options: { control: { type: 'object' } },
    direction: { control: { type: 'radio', options: ['vertical', 'horizontal'] } },
    onChange: { action: 'changed' },
  },
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
