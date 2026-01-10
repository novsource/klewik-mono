import type { Meta, StoryObj } from '@storybook/react-vite'

import { WysiwygEditorToolbar } from '../ui/wysiwyg-editor-toolbar.ui'
import { WysiwygEditor, WysiwygEditorViewArea } from '../ui/wysiwyg-editor.ui'

const meta = {
  title: 'Shared Components/Wysiwyg Editor',
  render: () => {
    return (
      <WysiwygEditor>
        <WysiwygEditorToolbar />
        <WysiwygEditorViewArea />
      </WysiwygEditor>
    )
  },
} satisfies Meta<typeof WysiwygEditor>

export default meta

type Story = StoryObj<typeof meta>

export const Example: Story = {}
