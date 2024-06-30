import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#121212',
        },
        {
          name: 'light',
          value: '#FFFFFF',
        },
      ],
    },
  },
};

export default preview;
