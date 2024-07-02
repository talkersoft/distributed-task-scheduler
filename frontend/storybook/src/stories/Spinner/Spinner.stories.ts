// Copyright Talkersoft LLC
// /frontend/storybook/src/stories/Spinner/Spinner.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import Spinner from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'number' } },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 50,
  },
};

export const Small: Story = {
  args: {
    size: 30,
  },
};

export const Large: Story = {
  args: {
    size: 70,
  },
};
