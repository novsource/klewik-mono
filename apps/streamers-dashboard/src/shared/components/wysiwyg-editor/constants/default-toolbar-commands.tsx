import type { WysiwygEditorCommand } from '../hooks/use-toolbar-button-action'

import type { ReactNode } from 'react'

import { Icons } from '~shared/ui/icons'

export type WysiwygToolbarCommandsGroupItem = {
  command: WysiwygEditorCommand
  icon?: ReactNode
}

export const DEFAULT_TOOLBAR_BUTTON_COMMANDS: WysiwygToolbarCommandsGroupItem[][] = [[
  { command: 'undo', icon: <Icons.Undo size="xs" /> },
  { command: 'redo', icon: <Icons.Redo size="xs" /> },
], [
  { command: 'bold', icon: <Icons.Bold width={14} height={14} /> },
  { command: 'italic', icon: <Icons.Italic width={14} height={14} /> },
  { command: 'underline', icon: <Icons.Underline width={14} height={14} /> },
  { command: 'strikeThrough', icon: <Icons.Cross width={14} height={14} /> },
]]
