import type { ComponentProps, KeyboardEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

import type {
  ContentEditableEvent,
} from 'react-simple-wysiwyg'
import {
  Editor,
  EditorProvider,
  useEditorState,
} from 'react-simple-wysiwyg'

import DOMPurify from 'dompurify'
import * as htmlParser from 'node-html-parser'

import { useTextSelection } from '~shared/hooks'
import { useEventListener } from '~shared/hooks/use-event-listener'

import { Divider } from '~shared/ui/divider'
import { Popover, PopoverContent } from '~shared/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '~shared/ui/tooltip'

import { cn } from '~shared/utils'

import { WysiwygEditorCommandButton } from './controls/wysiwyg-editor-command-button.ui'
import { WysiwygEditorHeadingCommandsSelect } from './controls/wysiwyg-editor-command-select.ui'

export type WysiwygEditorProps = ComponentProps<'div'>

export const WysiwygEditor = (props: WysiwygEditorProps) => {
  const { children, className, ...restProps } = props
  return (
    <EditorProvider>
      <div
        className={cn('relative border-1 border-dark-accent rounded-small pt-2', className)}
        {...restProps}
      >
        <div className="flex flex-col gap-y-0.75">{ children }</div>
      </div>
    </EditorProvider>
  )
}

export type WysiwygEditorViewAreaProps = Omit<ComponentProps<typeof Editor>, 'value'> & {
  hideToolbarPopup?: boolean
}

export const WysiwygEditorViewArea = (props: WysiwygEditorViewAreaProps) => {
  const { className, hideToolbarPopup = false, ...restProps } = props

  const [dirtyHTML, setDirtyHTML] = useState('')
  const [isPressed, setIsPressed] = useState(false)

  const { $el } = useEditorState()
  const { text } = useTextSelection()

  useEffect(() => {
    document.execCommand('defaultParagraphSeparator', false, 'p')
  }, [])

  const sanitazedHTML = useMemo(() => {
    const sanitazeResult = DOMPurify.sanitize(dirtyHTML, { USE_PROFILES: { html: true } })
    const parsedSanitazedHTML = htmlParser.parse(sanitazeResult)

    const allH1Headers = parsedSanitazedHTML.getElementsByTagName('h1')
    const allH2Headers = parsedSanitazedHTML.getElementsByTagName('h2')
    const allH3Headers = parsedSanitazedHTML.getElementsByTagName('h3')

    allH1Headers.forEach(header => header.setAttribute('class', 'wysiwyg-editor__header'))
    allH2Headers.forEach(header => header.setAttribute('class', 'wysiwyg-editor__subheader'))
    allH3Headers.forEach(header => header.setAttribute('class', 'wysiwyg-editor__h3'))

    const isEditorEmpty = parsedSanitazedHTML.innerHTML.length === 0

    if (isEditorEmpty) {
      const initialParagraph = document.createElement('p')
      const breakLine = document.createElement('br')

      initialParagraph.appendChild(breakLine)
      parsedSanitazedHTML.insertAdjacentHTML('afterbegin', initialParagraph.outerHTML)
    }

    return parsedSanitazedHTML.innerHTML
  }, [dirtyHTML])

  const handlEditorValueChanges = (event: ContentEditableEvent) => {
    setDirtyHTML(event.target.value)
  }

  const isToolsPopoverOpened = !hideToolbarPopup && !isPressed && text.length !== 0 && $el?.contains(document.activeElement)

  useEventListener(window, 'mouseup', () => {
    setIsPressed(false)
  })

  const preventDivInsertingOnKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()

      document.execCommand('insertParagraph', false, undefined)
    }
  }

  return (
    <>
      <Editor
        className={cn('relative [&>p]:mb-4', className)}
        containerProps={{ className: 'pl-1 tablet:pl-3 pt-2' }}
        value={sanitazedHTML}
        onChange={handlEditorValueChanges}
        onKeyDown={preventDivInsertingOnKeyDown}
        onMouseDown={() => setIsPressed(true)}
        {...restProps}
      />
      <EditorToolsPopover isOpened={isToolsPopoverOpened} />
    </>
  )
}

type EditorToolsPopoverProps = {
  isOpened?: boolean
}

function EditorToolsPopover(props: EditorToolsPopoverProps) {
  const { isOpened } = props

  const coordsRef = useRef({ x: 0, y: 0 })

  const { ranges, text } = useTextSelection()

  const isSelectionNotEmpty = text.length !== 0
  const isRangesNotEmpty = ranges.length !== 0

  if (isRangesNotEmpty && isSelectionNotEmpty) {
    let x = 0
    let y = 0

    const isClientRectsNotEmpty = ranges.at(0)?.getClientRects().length !== 0

    if (isClientRectsNotEmpty) {
      const clientsRects = ranges.at(0)!.getClientRects()

      const maxRect = Array.from(clientsRects).reduce((result, rect) => {
        if (result.y < rect.y) {
          return rect
        }

        return result
      }, clientsRects.item(0)!)

      x = maxRect.x
      y = maxRect.y
    }
    else {
      const range = ranges.at(0)!

      const startContainer = range.startContainer
      const endContainer = range.endContainer

      const container = getAnchorContainerRect(startContainer.parentElement!, endContainer.parentElement!)

      x = container.x
      y = container.y
    }

    coordsRef.current = { x, y }
  }

  return (
    <Popover open={isOpened}>
      <PopoverContent
        initialFocus={false}
        className="px-2 py-1 w-fit flex items-center h-10"
        positionerProps={{
          side: 'bottom',
          style: {
            zIndex: 100,
            transform: `translate(${coordsRef.current.x}px,calc(${coordsRef.current.y}px + 2rem))`,
          },
        }}
      >
        <WysiwygEditorHeadingCommandsSelect
          showSelectedHeader={true}
          triggerProps={{
            className: 'border-none',
            variant: 'default',
            startContent: null,
          }}
        />

        <Divider className="mx-2" orientation="vertical" />

        <Tooltip delayDuration={500}>
          <TooltipTrigger>
            <WysiwygEditorCommandButton.Bold />
          </TooltipTrigger>
          <TooltipContent
            className="bg-dark text-base text-gray-accent z-[101]"
            side="bottom"
            align="center"
            alignOffset={200}
            disableArrow
          >
            Bold
          </TooltipContent>
        </Tooltip>

        <WysiwygEditorCommandButton.Italic />
        <WysiwygEditorCommandButton.Underline />
        <WysiwygEditorCommandButton.Strike />
      </PopoverContent>
    </Popover>
  )
}

function getAnchorContainerRect(firstContainer: HTMLElement, secondContainer: HTMLElement) {
  const firstContainerRect = firstContainer.getBoundingClientRect()
  const secondContainerRect = secondContainer.getBoundingClientRect()

  const anchorContainerRect
    = firstContainerRect.y > secondContainerRect.y
      ? firstContainerRect
      : secondContainerRect

  return anchorContainerRect
}
