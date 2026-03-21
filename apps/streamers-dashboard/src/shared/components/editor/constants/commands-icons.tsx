import type { WYSIWYG_LIST_COMMANDS, WYSIWYG_TEXT_FORMATTING_COMMANDS, WYSIWYG_TEXT_STYLES_FORMATTING_COMMANDS } from './editor-commands'

import type { ReactNode } from 'react'

import { Icons } from 'klewik-ui/icons'

export const WYSIWYG_TEXT_STYLES_FORMATTING_COMMANDS_ICONS: Record<typeof WYSIWYG_TEXT_STYLES_FORMATTING_COMMANDS[number], ReactNode> = {
  bold: <Icons.Bold width={14} height={14} />,
  italic: <Icons.Italic width={14} height={14} />,
  strike: <Icons.Cross width={14} height={14} />,
  underline: <Icons.Underline width={14} height={14} />,
}

export const WYSIWYG_LIST_COMMANDS_ICONS: Record<typeof WYSIWYG_LIST_COMMANDS[number], ReactNode> = {
  bulletList: <Icons.BulletList size="default" />,
  orderedList: <Icons.OrderedList size="default" />,
}

export const WYSIWYG_HEADING_COMMANDS_ICONS: Record<typeof WYSIWYG_TEXT_FORMATTING_COMMANDS[number], ReactNode> = {
  heading1: <Icons.Heading1 />,
  heading2: <Icons.Heading2 />,
  paragraph: <Icons.Text />,
}
