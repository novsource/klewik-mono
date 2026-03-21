import type { Meta, StoryObj } from '@storybook/react-vite'

import type { ButtonProps } from '../ui/button'

export const baseButtonStorybookMeta = {
  title: 'Base UI/Button',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Overwritteng button text',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg'],
    },
  },
  args: {
    children: 'Button',
    size: 'default',
  },
} satisfies Meta<ButtonProps>

export type BaseButtonStory = StoryObj<ButtonProps>
