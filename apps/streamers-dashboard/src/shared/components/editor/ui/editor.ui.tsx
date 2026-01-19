import type { Editor as TiptapEditor } from '@tiptap/react'
import type { BubbleMenuProps } from '@tiptap/react/menus'

import type { WysiwygEditorPossibleCommands } from '../constants/editor-commands'

import type { ComponentPropsWithoutRef } from 'react'
import { useMemo, useState } from 'react'

import { EditorContent, useEditorState } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'

import { useResizeObserver } from '~shared/hooks'

import { Button } from '~shared/ui/button'
import { Divider } from '~shared/ui/divider'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import type { SelectTriggerProps } from '~shared/ui/select'
import { Select, SelectContent, SelectItem, SelectList, SelectTrigger } from '~shared/ui/select'

import { cn } from '~shared/utils'

import {
  WYSIWYG_EDITOR_TOOLBAR_COMMANDS,
  WYSIWYG_LIST_COMMANDS,
  WYSIWYG_TEXT_FORMATTING_COMMANDS,
  WYSIWYG_TEXT_STYLES_FORMATTING_COMMANDS,
} from '../constants/editor-commands'
import {
  callWysiwygEditorCommand,
  getWysiwygEditorCommandsState,
  WysiwygEditorExtraCommandsPopover,
  WysiwygEditorHeadingCommandsButton,
  WysiwygEditorListCommandsButton,
  WysiwygEditorTextFormattingButton,
  WysiwygEditorViewedCommandsGroup,
} from './editor-commands.ui'

export type WysiwygEditorProps = Omit<ComponentPropsWithoutRef<'div'>, 'className'> & {
  editor: TiptapEditor
  slotsClassNames?: Partial<Record<'base' | 'wrapper', string>>
}

export const WysiwygEditor = (props: WysiwygEditorProps) => {
  const { editor, slotsClassNames, ...restProps } = props

  return (
    <div id={editor.instanceId} className={cn('relative w-full h-full overflow-y-scroll', slotsClassNames?.base)} {...restProps}>
      <div className={cn('flex flex-col gap-y-4 h-full w-full px-4 py-2', slotsClassNames?.wrapper)}>
        <WysiwygEditorToolbar editor={editor} />
        <EditorContent editor={editor} className="focus:outline-none min-h-24 grow" />
        <WysiwygEditorBubbleMenu editor={editor} />

        <WysiwygEditorCharactersCounter editor={editor} />
      </div>
    </div>
  )
}

type EditorBubbleMenuProps = BubbleMenuProps & {
  editor: TiptapEditor
}

function WysiwygEditorBubbleMenu(props: EditorBubbleMenuProps) {
  const { editor } = props

  return (
    <BubbleMenu
      editor={editor}
      options={{
        autoPlacement: {
          allowedPlacements: ['bottom', 'bottom-end', 'bottom-start'],
        },
      }}
    >
      <div className="w-fit h-10 bg-dark rounded-small border-dark-light border-1">
        <div className="flex h-full px-2 gap-x-0.75 items-center">

          <WysiwygEditorHeadingSelect editor={editor} />

          <Divider className="mx-2" orientation="vertical" />

          {WYSIWYG_TEXT_STYLES_FORMATTING_COMMANDS.map((command) => {
            return <WysiwygEditorTextFormattingButton key={command} editor={editor} command={command} />
          })}
        </div>
      </div>
    </BubbleMenu>
  )
}

type EditorToolbarProps = {
  editor: TiptapEditor
}

const defaultHiddenCommands = WYSIWYG_EDITOR_TOOLBAR_COMMANDS.reduce((acc, curr) => {
  acc[curr] = false

  return acc
}, {} as Record<WysiwygEditorPossibleCommands[number], boolean>)

const textFormattingGroupCommands = [...WYSIWYG_TEXT_STYLES_FORMATTING_COMMANDS]
const listsGroupCommands = [...WYSIWYG_LIST_COMMANDS]
const headingGroupCommands = [...WYSIWYG_TEXT_FORMATTING_COMMANDS]

function WysiwygEditorToolbar(props: EditorToolbarProps) {
  const { editor } = props

  const [toolbarWidth, setToolbarWidth] = useState(0)
  const [hiddenCommandsStatuses, setHiddenCommandsStatuses] = useState({ ...defaultHiddenCommands })

  const state = useEditorState({ editor, selector: getWysiwygEditorCommandsState })

  const { ref: toolbarRef } = useResizeObserver<HTMLDivElement>({
    onChange: (entries) => {
      const [entry] = entries

      const width = entry.contentRect.width

      if (width !== toolbarWidth) {
        setToolbarWidth(width)
      }
    },
  })

  const hiddenCommands = useMemo(() => {
    return (Object.keys(hiddenCommandsStatuses) as Array<WysiwygEditorPossibleCommands[number]>)
      .reduce((acc, curr) => {
        const isCommandHidden = hiddenCommandsStatuses[curr]

        if (isCommandHidden) {
          acc.push(curr)
        }

        return acc
      }, [] as Array<WysiwygEditorPossibleCommands[number]>)
  }, [hiddenCommandsStatuses])

  return (
    <div ref={toolbarRef} className="sticky top-2 w-full h-10 bg-dark rounded-small overflow-clip z-50 border-1 border-dark-light">
      <Flex className="relative px-2 h-full" align="center" justify="between">
        <Flex className="relative h-full" align="center">
          <Flex className="flex-nowrap">
            <Button
              variant="ghost"
              isIconOnly
              icon={<Icons.Undo size="xs" />}
              size="xs"
              disabled={!state.undo.isCanBeUsed}
              onClick={() => editor.commands.undo()}
            />
            <Button
              variant="ghost"
              isIconOnly
              icon={<Icons.Redo size="xs" />}
              size="xs"
              disabled={!state.redo.isCanBeUsed}
              onClick={() => editor.commands.redo()}
            />
          </Flex>

          <WysiwygEditorViewedCommandsGroup
            toolbarWidth={toolbarWidth}
            commands={textFormattingGroupCommands}
            onViewedCommandsChange={(commands) => {
              const result = textFormattingGroupCommands.reduce((acc, command) => {
                acc[command] = !commands.includes(command)

                return acc
              }, {} as typeof hiddenCommandsStatuses)

              setHiddenCommandsStatuses(curr => ({ ...curr, ...result }))
            }}
          >
            {(showedCommands) => {
              const isShouldShowGroupDivider = showedCommands.length !== 0

              return (
                <>
                  {isShouldShowGroupDivider && <Divider className="mx-2" orientation="vertical" />}
                  {showedCommands.map(command => (
                    <WysiwygEditorTextFormattingButton key={command} editor={editor} command={command} />
                  ))}
                </>
              )
            }}
          </WysiwygEditorViewedCommandsGroup>

          <WysiwygEditorViewedCommandsGroup
            toolbarWidth={toolbarWidth}
            commands={headingGroupCommands}
            onViewedCommandsChange={(commands) => {
              const result = headingGroupCommands.reduce((acc, command) => {
                acc[command] = !commands.includes(command)

                return acc
              }, {} as typeof hiddenCommandsStatuses)

              setHiddenCommandsStatuses(curr => ({ ...curr, ...result }))
            }}
          >
            {(showedCommands) => {
              const isShouldShowGroupDivider = showedCommands.length !== 0

              return (
                <>
                  {isShouldShowGroupDivider && <Divider className="mx-2" orientation="vertical" />}
                  {showedCommands.map((command) => {
                    return <WysiwygEditorHeadingCommandsButton key={command} editor={editor} command={command} />
                  })}
                </>
              )
            }}
          </WysiwygEditorViewedCommandsGroup>

          <WysiwygEditorViewedCommandsGroup
            toolbarWidth={toolbarWidth}
            commands={listsGroupCommands}
            onViewedCommandsChange={(commands) => {
              const result = listsGroupCommands.reduce((acc, command) => {
                acc[command] = !commands.includes(command)

                return acc
              }, {} as typeof hiddenCommandsStatuses)

              setHiddenCommandsStatuses(curr => ({ ...curr, ...result }))
            }}
          >
            {(showedCommands) => {
              const isShouldShowGroupDivider = showedCommands.length !== 0

              return (
                <>
                  {isShouldShowGroupDivider && <Divider className="mx-2" orientation="vertical" />}
                  {showedCommands.map((command) => {
                    return <WysiwygEditorListCommandsButton key={command} editor={editor} command={command} />
                  })}
                </>
              )
            }}
          </WysiwygEditorViewedCommandsGroup>

        </Flex>

        <WysiwygEditorExtraCommandsPopover editor={editor} commands={hiddenCommands} />
      </Flex>
    </div>
  )
}

type WysiwygEditorHeadingSelectProps = {
  editor: TiptapEditor
  triggerProps?: Omit<SelectTriggerProps, 'render'>
}

type HeadingSelectItemData = {
  value: 'heading1' | 'heading2' | 'paragraph'
  label: string
}

const headersSelectItems: HeadingSelectItemData[] = [
  {
    value: 'heading1',
    label: 'Header 1',
  },
  {
    value: 'heading2',
    label: 'Header 2',
  },
  {
    value: 'paragraph',
    label: 'Text',
  },
]

function WysiwygEditorHeadingSelect(props: WysiwygEditorHeadingSelectProps) {
  const { editor, triggerProps } = props

  const state = useEditorState({ editor, selector: getWysiwygEditorCommandsState })

  const activeHeading = state.heading1.isActive ? 'heading1' : state.heading2.isActive ? 'heading2' : 'paragraph'
  const isAnyHeadingActive = activeHeading === 'heading1' || activeHeading === 'heading2'

  return (
    <Select
      items={headersSelectItems}
      value={activeHeading}
      defaultValue="paragraph"
      size="sm"
      onValueChange={(value) => {
        const command = value as typeof WYSIWYG_TEXT_FORMATTING_COMMANDS[number]

        callWysiwygEditorCommand(editor, command)
      }}
    >
      <SelectTrigger
        render={props => (
          <Button
            {...props}
            className={cn('border-none gap-0.5', isAnyHeadingActive && 'text-green-accent/80 hover:bg-green-dark/50')}
            variant={triggerProps?.hideSelectedValue ? 'ghost' : 'default'}
            startContent={triggerProps?.hideSelectedValue ? <Icons.HeadingSymbol /> : null}
            size="xs"
            onClick={(event) => {
              event.preventDefault()
            }}
          />
        )}
        {...triggerProps}
      />
      <SelectContent
        side="bottom"
        align="start"
        sideOffset={8}
        alignItemWithTrigger={false}
        style={{ zIndex: 101 }}
      >
        <SelectList>
          {headersSelectItems.map((item) => {
            const isCommandActive = state[item.value as typeof WYSIWYG_TEXT_FORMATTING_COMMANDS[number]].isActive

            return (
              <SelectItem
                className={cn(isCommandActive && ' text-green-accent/70 data-[highlighted]:bg-green-dark data-[highlighted]:text-green-accent')}
                key={item.label}
                value={item.value}
                label={item.label}
              />
            )
          })}
        </SelectList>
      </SelectContent>
    </Select>
  )
}

type WysiwygEditorCharactersCounterProps = {
  editor: TiptapEditor
}

function WysiwygEditorCharactersCounter(props: WysiwygEditorCharactersCounterProps) {
  const { editor } = props

  const state = useEditorState({ editor, selector: (context) => {
    return { charactersCount: context.editor.storage.characterCount.characters() }
  } })

  return (
    <span className="text-gray-light text-md">
      { `${state.charactersCount} / 800` }
    </span>
  )
}
