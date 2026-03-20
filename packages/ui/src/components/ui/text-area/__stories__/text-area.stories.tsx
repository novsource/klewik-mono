import type { Meta, StoryObj } from '@storybook/react-vite'

import type { TextAreaProps } from '../ui/text-area.ui'

import { TextArea } from '../ui/text-area.ui'

const meta = {
  title: 'Base UI/Text Area',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    note: {
      control: 'text',
    },
  },
  render: props => <TextArea {...props} />,
} satisfies Meta<TextAreaProps>

export default meta

type Story = StoryObj<typeof meta>

export const Example: Story = {
  render: (props) => {
    return (
      <div style={{ width: 300, height: 300 }}>
        <TextArea {...props} />
      </div>
    )
  },
}
