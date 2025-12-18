import type { Meta, StoryObj } from '@storybook/react-vite'

import type { ButtonProps } from '../ui/button'
import type { BaseButtonStory } from './button.meta'

import type { ReactNode } from 'react'

import '~app/styles/index.css'

import { Icons } from '~shared/ui/icons'

import { Button } from '../ui/button'
import { baseButtonStorybookMeta } from './button.meta'

const baseMeta = {
  ...baseButtonStorybookMeta,
  title: 'Base UI/Button',
  render: args => <Button {...args} />,
} satisfies Meta<Omit<ButtonProps, 'asChild' | 'startContent' | 'endContent'>>

export default baseMeta

const mappedIcons = (Object.keys(Icons) as Array<keyof typeof Icons>).reduce((acc, iconName) => {
  const Icon = Icons[iconName]

  acc[iconName] = <Icon />

  return acc
}, {} as Record<keyof typeof Icons, ReactNode>)

export const Default: StoryObj<Meta<ButtonProps>> = {
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'default', 'action', 'outline', 'error', 'ghost-outline', 'ghost', 'link'],
    },
    startContent: {
      control: 'select',
      options: Object.keys(Icons),
      mapping: mappedIcons,
    },
    endContent: {
      control: 'select',
      options: Object.keys(Icons),
      mapping: mappedIcons,
    },
    icon: {
      control: 'select',
      options: Object.keys(Icons),
      mapping: mappedIcons,
    },
    isIconOnly: {
      control: 'boolean',
    },
  },
  args: {
    variant: 'default',
  },
}

export const WithIconsContent: BaseButtonStory = {
  args: {
    variant: 'action',
  },
  argTypes: {
    startContent: Default.argTypes?.startContent,
    endContent: Default.argTypes?.endContent,
  },
}

export const IconOnly: BaseButtonStory = {
  argTypes: {
    isIconOnly: Default.argTypes?.isIconOnly,
    icon: Default.argTypes?.icon,
  },
  args: {
    isIconOnly: true,
  },
}
