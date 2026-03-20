import type { Meta, StoryObj } from '@storybook/react-vite'

import type { BadgeProps } from '../ui/badge'

import { Badge } from '../ui/badge'

const meta = {
  title: 'Base UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'error', 'default', 'warning'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
  },
  args: {
    children: 'Badge',
    size: 'default',
    variant: 'default',
  },
} satisfies Meta<BadgeProps>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'error', 'default', 'warning'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
  },
  args: {
    children: 'Badge',
    size: 'default',
    variant: 'success',
  },
}
