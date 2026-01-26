import type { EditorStateSnapshot, Editor as TiptapEditor } from '@tiptap/react'

import type {
  WYSIWYG_LIST_COMMANDS as LIST_COMMANDS,
  WYSIWYG_TEXT_STYLES_FORMATTING_COMMANDS as TEXT_STYLES_FORMATTING_COMMANDS,
  WYSIWYG_TEXT_FORMATTING_COMMANDS,
  WysiwygEditorPossibleCommands,
} from '../constants/editor-commands'

import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import { useEditorState } from '@tiptap/react'

import type { ButtonProps } from '~shared/ui/button'
import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { Popover, PopoverContent, PopoverTrigger } from '~shared/ui/popover'

import { cn } from '~shared/utils'

import {
  WYSIWYG_HEADING_COMMANDS_ICONS,
  WYSIWYG_LIST_COMMANDS_ICONS,
  WYSIWYG_TEXT_STYLES_FORMATTING_COMMANDS_ICONS,
} from '../constants/commands-icons'
import {
  WYSIWYG_EDITOR_COMMANDS_LABELS as EDITOR_COMMANDS_LABELS,
  WYSIWYG_EDITOR_TOOLBAR_COMMANDS as EDITOR_TOOLBAR_COMMANDS,
} from '../constants/editor-commands'

type SelectorEditorReturningStateItem = {
  isActive: boolean
  isCanBeUsed: boolean
}

export const callWysiwygEditorCommand = (editor: TiptapEditor, command: WysiwygEditorPossibleCommands[number]) => {
  const prepareCommandsChain = editor.chain().focus

  const commands: Record<WysiwygEditorPossibleCommands[number], () => void> = {
    redo: () => editor.commands.redo(),
    undo: () => editor.commands.undo(),
    bold: () => prepareCommandsChain().toggleBold().run(),
    heading1: () => prepareCommandsChain().toggleHeading({ level: 1 }).run(),
    heading2: () => prepareCommandsChain().toggleHeading({ level: 2 }).run(),
    paragraph: () => prepareCommandsChain().setParagraph().run(),
    italic: () => prepareCommandsChain().toggleItalic().run(),
    strike: () => prepareCommandsChain().toggleStrike().run(),
    underline: () => prepareCommandsChain().toggleUnderline().run(),
    bulletList: () => editor.chain().focus().toggleBulletList().run(),
    orderedList: () => editor.chain().focus().toggleOrderedList().run(),
  }

  const commandFn = commands[command]
  commandFn()
}

export const getWysiwygEditorCommandsState = (context: EditorStateSnapshot<TiptapEditor>) => {
  const contextEditor = context.editor

  const canBeUsedByCommands: Record<WysiwygEditorPossibleCommands[number], boolean> = {
    bold: contextEditor.can().chain().toggleBold().run() ?? false,
    underline: contextEditor.can().chain().toggleUnderline().run() ?? false,
    italic: contextEditor.can().chain().toggleBold().run() ?? false,
    strike: contextEditor.can().chain().toggleStrike().run() ?? false,
    bulletList: contextEditor.can().chain().toggleBulletList().run() ?? false,
    orderedList: contextEditor.can().chain().toggleOrderedList().run() ?? false,
    heading1: contextEditor.can().chain().toggleHeading({ level: 1 }).run() ?? false,
    heading2: contextEditor.can().chain().toggleHeading({ level: 2 }).run() ?? false,
    paragraph: contextEditor.can().chain().setParagraph().run() ?? false,
    redo: contextEditor.can().chain().redo().run() ?? false,
    undo: contextEditor.can().chain().undo().run() ?? false,
  }

  return EDITOR_TOOLBAR_COMMANDS.reduce((acc, command) => {
    acc[command] = {
      isActive: contextEditor.isActive(command) ?? false,
      isCanBeUsed: canBeUsedByCommands[command],
    }

    return acc
  }, {} as Record<WysiwygEditorPossibleCommands[number], SelectorEditorReturningStateItem>)
}
export type WysiwygEditorExtraCommandsPopoverProps = {
  editor: TiptapEditor
  commands: Array<WysiwygEditorPossibleCommands[number]>
}

export function WysiwygEditorExtraCommandsPopover(props: WysiwygEditorExtraCommandsPopoverProps) {
  const { editor, commands } = props

  const [isOpen, setIsOpen] = useState(false)

  const state = useEditorState({ editor, selector: getWysiwygEditorCommandsState })

  const isPopoverDisabled = commands.length === 0

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        render={(
          <Button
            variant="ghost"
            isIconOnly
            icon={<Icons.Dots className="rotate-90" />}
            size="xs"
            disabled={isPopoverDisabled}
            onClick={() => setIsOpen(true)}
          />
        )}
      />

      <PopoverContent className="max-w-40 p-1" positionerProps={{ side: 'bottom', align: 'end', sideOffset: 8 }}>
        <ul className="flex flex-col gap-y-0.5">
          {commands.map((command) => {
            const label = EDITOR_COMMANDS_LABELS[command]

            const isDisabled = !state[command].isCanBeUsed

            return (
              <li
                key={label}
                className={cn(
                  'px-2 py-1 text-md text-gray-accent cursor-pointer hover:bg-dark-accent select-none',
                  isDisabled && 'cursor-not-allowed text-gray-light',
                )}
                onClick={() => {
                  if (isDisabled)
                    return

                  callWysiwygEditorCommand(editor, command)
                  setIsOpen(false)
                }}
              >
                {label}
              </li>
            )
          })}
        </ul>
      </PopoverContent>
    </Popover>
  )
}

export type WysiwygEditorViewedCommandsGroupProps<T extends string[]> = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  commands: T
  children: (commands: Array<T[number]>) => ReactNode
  toolbarWidth?: number
  onViewedCommandsChange?: (commands: T) => void
}

export function WysiwygEditorViewedCommandsGroup<T extends string[]>(props: WysiwygEditorViewedCommandsGroupProps<T>) {
  const {
    toolbarWidth = Number.MAX_SAFE_INTEGER,
    commands,
    children,
    className,
    onViewedCommandsChange: onCommandsChange,
    ...restProps
  } = props

  const [groupCommands, setGroupCommands] = useState(commands)
  const [displayedCommands, setDisplayedCommands] = useState(commands)

  const commandsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (groupCommands.length !== commands.length)
      setGroupCommands(commands)
  }, [commands, groupCommands])

  useEffect(() => {
    const element = commandsContainerRef.current

    if (!element)
      return

    const distanceToToolbarEnd = (toolbarWidth - 60) - element.offsetLeft
    const sizeForCommand = 36
    const maxCountCommands = Math.min(Math.floor(distanceToToolbarEnd / sizeForCommand), groupCommands.length)

    if (displayedCommands.length !== maxCountCommands && maxCountCommands >= 0) {
      const actualDisplayedCommands = groupCommands.slice(0, maxCountCommands) as T

      setDisplayedCommands(actualDisplayedCommands)
      onCommandsChange?.(actualDisplayedCommands)
    }
  }, [toolbarWidth, displayedCommands, groupCommands, onCommandsChange])

  return (
    <div
      ref={commandsContainerRef}
      className={cn('relative flex items-center h-full', className)}
      {...restProps}
    >
      {children(displayedCommands)}
    </div>
  )
}

export type WysiwygEditorHeadingCommandsButtonProps = ButtonProps & {
  editor: TiptapEditor
  command: typeof WYSIWYG_TEXT_FORMATTING_COMMANDS[number]
}

export function WysiwygEditorHeadingCommandsButton(props: WysiwygEditorHeadingCommandsButtonProps) {
  const { editor, command, ...restProps } = props

  const state = useEditorState({ editor, selector: getWysiwygEditorCommandsState })

  return (
    <WysiwygEditorBaseCommandButton
      className={cn(command === 'paragraph' && 'data-[active=true]:text-gray')}
      data-active={state[command].isActive}
      isIconOnly
      icon={WYSIWYG_HEADING_COMMANDS_ICONS[command]}
      disabled={!state[command].isCanBeUsed}
      onClick={() => callWysiwygEditorCommand(editor, command)}
      {...restProps}
    />
  )
}

export type WysiwygEditorListCommandsButtonProps = ButtonProps & {
  editor: TiptapEditor
  command: typeof LIST_COMMANDS[number]
}

export function WysiwygEditorListCommandsButton(props: WysiwygEditorListCommandsButtonProps) {
  const { editor, command, ...restProps } = props

  const state = useEditorState({ editor, selector: getWysiwygEditorCommandsState })

  return (
    <WysiwygEditorBaseCommandButton
      data-active={state[command].isActive}
      isIconOnly
      icon={WYSIWYG_LIST_COMMANDS_ICONS[command]}
      disabled={!state[command].isCanBeUsed}
      onClick={() => callWysiwygEditorCommand(editor, command)}
      {...restProps}
    />
  )
}

export type WysiwygEditorTextFormattingButtonProps = ButtonProps & {
  editor: TiptapEditor
  command: typeof TEXT_STYLES_FORMATTING_COMMANDS[number]
}

export function WysiwygEditorTextFormattingButton(props: WysiwygEditorTextFormattingButtonProps) {
  const { editor, command, ...restProps } = props

  const state = useEditorState({ editor, selector: getWysiwygEditorCommandsState })

  return (
    <WysiwygEditorBaseCommandButton
      isIconOnly
      icon={WYSIWYG_TEXT_STYLES_FORMATTING_COMMANDS_ICONS[command]}
      data-active={state[command].isActive}
      disabled={!state[command].isCanBeUsed}
      onClick={() => callWysiwygEditorCommand(editor, command)}
      {...restProps}
    />
  )
}

/*
  Base WYSIWYG command button

  Just decorate button
*/

type WysiwygEditorBaseCommandButtonProps = ButtonProps

function WysiwygEditorBaseCommandButton(props: WysiwygEditorBaseCommandButtonProps) {
  const { className, ...restProps } = props

  return (
    <Button
      className={cn([
        ' hover:text-white/80 hover:bg-dark-accent/40 active:bg-dark/80',
        'data-[active=true]:text-green-accent/80 data-[active=true]:hover:bg-green-dark/50',
        className,
      ])}
      variant="ghost"
      size="xs"
      {...restProps}
    />
  )
}
