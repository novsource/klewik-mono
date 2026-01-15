import { useMemo } from 'react'
import type { ReactNode } from 'react'

import { CharacterCount, Placeholder } from '@tiptap/extensions'
import { EditorContext, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

type WysiwygEditorProviderProps = {
  children: ReactNode
}

export const WysiwygEditorProvider = (props: WysiwygEditorProviderProps) => {
  const { children } = props

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

  const editorProviderValue = useMemo(() => ({ editor }), [editor])

  return <EditorContext.Provider value={editorProviderValue}>{ children }</EditorContext.Provider>
}
