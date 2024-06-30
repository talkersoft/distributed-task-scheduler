import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ActionButton } from './ActionButton';

const meta = {
  title: 'Components/Action Button',
  component: ActionButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    primary: { control: 'boolean' },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    primary: false,
    label: 'Secondary Button',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Large Button',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Small Button',
  },
};
