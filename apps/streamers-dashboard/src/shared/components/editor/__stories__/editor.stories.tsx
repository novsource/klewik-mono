import type { Meta, StoryObj } from '@storybook/react-vite'

import { CharacterCount, Placeholder } from '@tiptap/extensions'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { WysiwygEditor } from '../ui/editor.ui'

const meta: Meta = {
  title: 'Components/Wysiwyg editor',
  render: () => {
    const editor = useEditor({
      autofocus: true,
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2],
          },
        }),
        Placeholder.configure({
          placeholder: 'Начинайте ввод здесь...',
        }),
        CharacterCount.configure({
          limit: 100000,
        }),
      ],
    })

    return <WysiwygEditor editor={editor} />
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Example: Story = {}
