import type { Meta, StoryObj } from '@storybook/react-vite'

import type { ButtonProps } from '../ui/button'
import type { BaseButtonStory } from './button.meta'

import type { ReactNode } from 'react'

import { Icons } from '../../icons'

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

export const Example: StoryObj<Meta<ButtonProps>> = {
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'action', 'error', 'ghost'],
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
    loading: {
      control: 'boolean',
    },
  },
  args: {
    variant: 'default',
  },
}

export const Variants: BaseButtonStory = {
  args: {
    variant: 'action',
  },
  argTypes: {
    variant: Example.argTypes?.variant,
  },
}

export const WithIconsContent: BaseButtonStory = {
  argTypes: {
    startContent: Example.argTypes?.startContent,
    endContent: Example.argTypes?.endContent,
  },
}

export const IconOnly: BaseButtonStory = {
  argTypes: {
    isIconOnly: Example.argTypes?.isIconOnly,
    icon: Example.argTypes?.icon,
  },
  args: {
    isIconOnly: true,
    icon: <Icons.Logo />,
  },
}
