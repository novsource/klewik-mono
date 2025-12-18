import type { Meta, StoryObj } from '@storybook/react-vite'

import { Icons } from '..'

type BaseIconProps = {
  icon: keyof typeof Icons
  size: 'xs' | 'sm' | 'default' | 'lg'
}

const meta = {
  title: 'Base UI/Icons',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    icon: {
      control: 'select',
      options: Object.keys(Icons),
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg'],
    },
  },
  args: {
    size: 'default',
  },
} satisfies Meta<BaseIconProps>

export default meta

type IconStory = StoryObj<typeof meta>

export const All: IconStory = {
  render: (args) => {
    const { icon, ...restArgs } = args
    const iconName = icon as keyof typeof Icons

    const Comp = Icons[iconName]

    return <Comp {...restArgs} />
  },
  args: {
    icon: Object.keys(Icons)[0],
  },
}
