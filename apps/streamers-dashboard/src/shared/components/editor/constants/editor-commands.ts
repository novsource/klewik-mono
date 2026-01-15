export const WYSIWYG_TEXT_STYLES_FORMATTING_COMMANDS = [
  'bold',
  'italic',
  'strike',
  'underline',
] as const

export const WYSIWYG_TEXT_FORMATTING_COMMANDS = [
  'heading1',
  'heading2',
  'paragraph',
] as const

export const WYSIWYG_LIST_COMMANDS = [
  'bulletList',
  'orderedList',
] as const

export const WYSIWYG_HISTORY_CONTROL_COMMANDS = [
  'undo',
  'redo',
] as const

export const WYSIWYG_EDITOR_BUBBLE_MENU_COMMANDS
  = [...WYSIWYG_TEXT_STYLES_FORMATTING_COMMANDS, ...WYSIWYG_TEXT_FORMATTING_COMMANDS] as const

export const WYSIWYG_EDITOR_TOOLBAR_COMMANDS = [
  ...WYSIWYG_HISTORY_CONTROL_COMMANDS,
  ...WYSIWYG_TEXT_STYLES_FORMATTING_COMMANDS,
  ...WYSIWYG_TEXT_FORMATTING_COMMANDS,
  ...WYSIWYG_LIST_COMMANDS,
] as const

export const WYSIWYG_EDITOR_COMMANDS_LABELS: Record<WysiwygEditorPossibleCommands[number], string> = {
  bold: 'Bold',
  bulletList: 'Bullet list',
  orderedList: 'Ordered list',
  heading1: 'Heading 1',
  heading2: 'Heading 2',
  italic: 'Italic',
  paragraph: 'Text',
  redo: 'Redo',
  undo: 'Undo',
  strike: 'Strikethough',
  underline: 'Underline',
}

export type WysiwygEditorBubbleMenuCommands = typeof WYSIWYG_EDITOR_BUBBLE_MENU_COMMANDS
export type WysiwygEditorToolbarCommands = typeof WYSIWYG_EDITOR_TOOLBAR_COMMANDS

export type WysiwygEditorPossibleCommands = typeof WYSIWYG_EDITOR_TOOLBAR_COMMANDS
