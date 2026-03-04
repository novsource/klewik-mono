import type { Meta, StoryObj } from '@storybook/react-vite'

import type { InputProps } from '../ui/input'

import { Example as ButtonExample } from '~shared/ui/button/__stories__/button.stories'

import { Input } from '../ui/input'

const meta = {
  title: 'Base UI/Input',
  argTypes: {
    label: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    errorMessage: {
      control: 'text',
    },
    size: {
      control: 'radio',
      options: ['sm', 'default', 'lg'],
    },
    variant: {
      control: 'radio',
      options: ['default', 'ghost'],
    },
    startContent: ButtonExample.argTypes?.startContent,
    endContent: ButtonExample.argTypes?.endContent,
  },
  args: {
    size: 'default',
  },
  parameters: {
    layout: 'centered',
  },
  render: (args) => {
    const { label, ...restArgs } = args

    return <Input label={label} {...restArgs} />
  },
} satisfies Meta<Omit<InputProps, 'slotClassNames'>>

export default meta

type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {
    variant: 'default',
    placeholder: 'Input placeholder',
  },
}
