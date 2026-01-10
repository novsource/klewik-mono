import type { WysiwygEditorCommand } from '../../hooks/use-wysiwyg-editor'

import type { MouseEvent } from 'react'
import { useLayoutEffect, useMemo, useRef } from 'react'

import { useMergedRefs } from '~shared/hooks'

import type { ButtonProps } from '~shared/ui/button'
import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'

import { cn } from '~shared/utils'

import { useWysiwygEditorToolbarContext } from '../../context/toolbar.context'
import { useWysiwygEditorCommand } from '../../hooks/use-wysiwyg-editor'

const WysiwygEditorUndoCommandButton = (props: ButtonProps) => {
  return (
    <WysiwygEditorCommandButton
      command="undo"
      title="undo"
      isIconOnly
      icon={<Icons.Undo />}
      {...props}
    />
  )
}

const WysiwygEditorRedoCommandButton = (props: ButtonProps) => {
  return (
    <WysiwygEditorCommandButton
      command="redo"
      title="redo"
      isIconOnly
      icon={<Icons.Redo />}
      {...props}
    />
  )
}

const WysiwygEditorBoldCommandButton = (props: ButtonProps) => {
  return (
    <WysiwygEditorCommandButton
      command="bold"
      title="bold text"
      isIconOnly
      icon={<Icons.Bold size="xs" />}
      {...props}
    />
  )
}

const WysiwygEditorItalicCommandButton = (props: ButtonProps) => {
  return (
    <WysiwygEditorCommandButton
      command="italic"
      title="italic text"
      isIconOnly
      icon={<Icons.Italic size="xs" />}
      {...props}
    />
  )
}

const WysiwygEditorUnderlineCommandButton = (props: ButtonProps) => {
  return (
    <WysiwygEditorCommandButton
      command="underline"
      title="underline text"
      isIconOnly
      icon={<Icons.Underline size="xs" />}
      {...props}
    />
  )
}

const WysiwygEditorCrossCommandButton = (props: ButtonProps) => {
  return (
    <WysiwygEditorCommandButton
      command="strikeThrough"
      title="cross text"
      isIconOnly
      icon={<Icons.Cross size="xs" />}
      {...props}
    />
  )
}

type WysiwygEditorCommandButtonProps = ButtonProps & {
  title: string
  command: WysiwygEditorCommand
}

function WysiwygEditorCommandButton(props: WysiwygEditorCommandButtonProps) {
  const { title, command, className, ref: propsPassedRef, ...restProps } = props

  const internalButtonRef = useRef<HTMLButtonElement>(null)

  const { state, actions } = useWysiwygEditorToolbarContext()
  const { isActive, callAction } = useWysiwygEditorCommand(command)

  const mergedRef = useMergedRefs(internalButtonRef, propsPassedRef)

  const isShouldBeHidden = useMemo(() => {
    return state.hiddenCommands.includes(command)
  }, [state.hiddenCommands, command])

  useLayoutEffect(() => {
    const element = internalButtonRef.current

    if (!element)
      return

    const distanceToParentEnd = state.toolbarWidth - element.offsetLeft

    if (distanceToParentEnd <= 72 && !isShouldBeHidden) {
      actions.hideCommand(command)
    }

    if (distanceToParentEnd > 72 && isShouldBeHidden) {
      actions.revealCommand(command)
    }
  }, [state.toolbarWidth, command, actions, isShouldBeHidden])

  const actionHandler = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    callAction()
  }

  return (
    <Button
      ref={mergedRef}
      className={cn([
        ' hover:text-white/80 hover:bg-dark-accent/40 active:bg-dark/80',
        'data-[active=true]:text-green-accent/80 data-[active=true]:hover:bg-green-dark/50',
        isShouldBeHidden && 'invisible',
      ], className)}
      variant="ghost"
      size="xs"
      data-active={isActive}
      onMouseDown={actionHandler}
      tabIndex={-1}
      title={title}
      {...restProps}
    />
  )
}

WysiwygEditorCommandButton.Undo = WysiwygEditorUndoCommandButton
WysiwygEditorCommandButton.Redo = WysiwygEditorRedoCommandButton
WysiwygEditorCommandButton.Bold = WysiwygEditorBoldCommandButton
WysiwygEditorCommandButton.Strike = WysiwygEditorCrossCommandButton
WysiwygEditorCommandButton.Italic = WysiwygEditorItalicCommandButton
WysiwygEditorCommandButton.Underline = WysiwygEditorUnderlineCommandButton

export { WysiwygEditorCommandButton }
