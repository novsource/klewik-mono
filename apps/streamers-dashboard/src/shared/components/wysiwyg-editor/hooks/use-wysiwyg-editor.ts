import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, MouseEvent } from 'react'

import type { EditorState } from 'react-simple-wysiwyg'
import { useEditorState } from 'react-simple-wysiwyg'

import { isFunction } from '~shared/utils'

import { useWysiwygEditorToolbarContext } from '../context/toolbar.context'

type TextFormattingCommand = 'bold' | 'underline' | 'strikeThrough' | 'italic' | 'formatBlock'
type EditorHistoryCommand = 'undo' | 'redo'
type CustomCommand = ((state: EditorState) => void)

export type WysiwygHeadings = 'h1' | 'h2' | 'h3' | 'p'
export type WysiwygEditorCommand = TextFormattingCommand | EditorHistoryCommand | CustomCommand

export const useToolbarActionButton = (command: WysiwygEditorCommand) => {
  const internalButtonRef = useRef<HTMLButtonElement>(null)

  const { state, actions } = useWysiwygEditorToolbarContext()
  const { isActive, callAction } = useWysiwygEditorCommand(command)

  const isButtonHidden = useMemo(() => {
    return state.hiddenCommands.includes(command)
  }, [state.hiddenCommands, command])

  useLayoutEffect(() => {
    const element = internalButtonRef.current

    if (!element)
      return

    const distanceToParentEnd = state.toolbarWidth - element.offsetLeft

    if (distanceToParentEnd <= 72 && !isButtonHidden) {
      actions.hideCommand(command)
    }

    if (distanceToParentEnd > 72 && isButtonHidden) {
      actions.revealCommand(command)
    }
  }, [state.toolbarWidth, command, actions, isButtonHidden])

  const actionHandler = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    callAction()
  }

  return {
    ref: internalButtonRef,
    isShouldBeHidden: isButtonHidden,
    actionHandler,
    isActive,
  }
}

type WysiwygCommandGroup = Readonly<[commandName: string, command: WysiwygEditorCommand, commandArgument: string]>
type WysiwygCommandActivityState = [commandName: string, isActive: boolean]

export const useWysiwygEditorGroupedActions = <T extends WysiwygCommandGroup>(items: T[]) => {
  const editorState = useEditorState()
  const callCommand = useBaseWysiwygEditorCommand()

  const isEditorContentElementFocused = Boolean(editorState.$el?.contains(document.activeElement))

  const actionsItems = useMemo<WysiwygCommandActivityState[]>(() => {
    return items.reduce<WysiwygCommandActivityState[]>((acc, item) => {
      const [_, command] = item

      const isActiveCommand = typeof command === 'string' && isEditorContentElementFocused && document.queryCommandState(command)

      acc.push([item[0], isActiveCommand])

      return acc
    }, [])
  }, [items, isEditorContentElementFocused])

  const actionHandler = (commandName: T[0]) => {
    const actionValues = items.find(item => item[0] === commandName)

    if (!actionValues)
      return

    const [_, command, commandArgument] = actionValues

    const shouldFocusEditor = !isEditorContentElementFocused || document.activeElement !== editorState.$el

    callCommand(command, { shouldFocusEditor, commandArgument })
  }

  const onSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault()

    const target = event.target
    const selectedValue = target.value
    const selectedIndex = Number.parseInt(selectedValue, 10)

    actionHandler(items[selectedIndex][0])
  }

  return {
    items: actionsItems,
    actionHandler,
    onSelect,
  }
}

export function useWysiwygEditorCommand(command: WysiwygEditorCommand) {
  const [isActive, setIsActive] = useState(false)

  const editorState = useEditorState()
  const callCommand = useBaseWysiwygEditorCommand()

  const isEditorContentElementFocused = Boolean(editorState.$el?.contains(document.activeElement))
  const iShouldBeActive = typeof command === 'string' && isEditorContentElementFocused && document.queryCommandState(command)

  if (!isActive && iShouldBeActive) {
    setIsActive(true)
  }

  if (isActive && !iShouldBeActive) {
    setIsActive(false)
  }

  const callAction = (commandArg?: string) => {
    callCommand(command, {
      shouldFocusEditor: isActive,
      commandArgument: commandArg,
    })
  }

  return { isActive, callAction }
}

type WysiwygCallCommandOptions = {
  shouldFocusEditor?: boolean
  commandArgument?: string
}
function useBaseWysiwygEditorCommand() {
  const editorState = useEditorState()

  const callCommand = (command: WysiwygEditorCommand, options?: WysiwygCallCommandOptions) => {
    const editorElement = editorState.$el

    if (editorElement && options?.shouldFocusEditor) {
      editorElement.focus()
    }

    if (isFunction(command)) {
      command(editorState)
    }
    else {
      document.execCommand(command, false, options?.commandArgument)
    }
  }

  return callCommand
}
