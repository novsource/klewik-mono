import type { WysiwygHeadings } from '../../hooks/use-wysiwyg-editor'

import { useEffect, useMemo, useState } from 'react'

import { shallowEqual } from 'react-redux'
import { useEditorState } from 'react-simple-wysiwyg'

import { useTextSelection } from '~shared/hooks'

import { Button } from '~shared/ui/button'
import type { ButtonProps } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { Select, SelectContent, SelectItem, SelectList, SelectTrigger } from '~shared/ui/select'

import { cn } from '~shared/utils'

import { WYSIWYG_EDITOR_BLOCK_ELEMENTS } from '../../constants/wysiwyg-editor-blocks'

const defaultHeadersFormats: Record<WysiwygHeadings, boolean> = {
  h1: false,
  h2: false,
  h3: false,
  p: true,
}

type HeadingSelectItemData = {
  value: WysiwygHeadings
  label: string
}

type HeadingTextSelectProps = {
  showSelectedHeader?: boolean
  triggerProps?: ButtonProps
}

const headersSelectItems: HeadingSelectItemData[] = [
  {
    value: 'h1',
    label: 'Header 1',
  },
  {
    value: 'h2',
    label: 'Header 2',
  },
  {
    value: 'h3',
    label: 'Header 3',
  },
  {
    value: 'p',
    label: 'Text',
  },
]

export const WysiwygEditorHeadingCommandsSelect = (props: HeadingTextSelectProps) => {
  const { showSelectedHeader = false, triggerProps, ...restProps } = props

  const { state, callCommand } = useToolbarHeadingTextFormatting()
  const { $el } = useEditorState()

  const activeHeader = useMemo<NullablePossible<WysiwygHeadings>>(() => {
    let result: WysiwygHeadings = 'p'

    for (const headerKey in state) {
      const castKey = headerKey as keyof typeof state

      const isHeadingKey = headerKey !== 'p'
      const isHeaderActive = state[castKey] && isHeadingKey

      if (isHeaderActive) {
        result = castKey
      }
    }

    return result
  }, [state])

  const isAnyHeadingActive = !!activeHeader && activeHeader !== 'p'

  return (
    <Select
      items={headersSelectItems}
      value={activeHeader}
      defaultValue={activeHeader}
      size="sm"
      onValueChange={(value) => {
        callCommand(value as WysiwygHeadings)
      }}
    >
      <SelectTrigger
        hideSelectedValue={!showSelectedHeader}
        render={props => (
          <Button
            {...props}
            className={cn('gap-0.5', isAnyHeadingActive && 'text-green-accent/80 hover:bg-green-dark/50')}
            variant="ghost"
            size="sm"
            startContent={<Icons.HeadingSymbol width={12} height={12} />}
            onClick={(event) => {
              event.preventDefault()
              $el?.focus()
            }}
            {...triggerProps}
          />
        )}
        {...restProps}
      />
      <SelectContent
        className="z-[101]"
        side="bottom"
        align="start"
        sideOffset={8}
        alignItemWithTrigger={false}
        style={{ zIndex: 101 }}
      >
        <SelectList>
          {headersSelectItems.map((item) => {
            const isCommandActive = state[item.value as WysiwygHeadings]

            return (
              <SelectItem
                className={cn(isCommandActive && 'text-green-accent/80 hover:bg-green-dark')}
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

function useToolbarHeadingTextFormatting() {
  const [headingState, setHeadingState] = useState<Record<WysiwygHeadings, boolean>>(defaultHeadersFormats)

  const { $el } = useEditorState()
  const { selection, rects } = useTextSelection()

  useEffect(() => {
    if (!selection || selection?.rangeCount === 0) {
      if (!shallowEqual(headingState, defaultHeadersFormats))
        setHeadingState({ ...defaultHeadersFormats })

      return
    }

    const anchestorContainer = selection.getRangeAt(0).commonAncestorContainer
    const isContainerIsTextNode = anchestorContainer.nodeType === Node.TEXT_NODE

    let node: NullablePossible<HTMLElement> = isContainerIsTextNode || !(anchestorContainer instanceof HTMLElement)
      ? anchestorContainer.parentElement!
      : anchestorContainer

    while (node && !WYSIWYG_EDITOR_BLOCK_ELEMENTS.includes(node.tagName) && !$el?.isEqualNode(node)) {
      node = node.parentElement
    }

    if (node && WYSIWYG_EDITOR_BLOCK_ELEMENTS.includes(node.tagName)) {
      const tag = node.tagName.toLowerCase() as WysiwygHeadings

      const isText = tag === 'p'
      const isTextAlreadyActive = headingState.p

      if (isText && isTextAlreadyActive)
        return

      if (isText && !isTextAlreadyActive) {
        setHeadingState({ ...defaultHeadersFormats, p: true })
      }
      else if (!headingState[tag]) {
        setHeadingState(curr => ({ ...curr, [tag]: true, p: false }))
      }
    }
    else {
      const isTextNotActive = !headingState.p

      if (isTextNotActive) {
        setHeadingState({ ...defaultHeadersFormats })
      }
    }
  }, [rects, selection, $el, headingState])

  const callCommand = (heading: WysiwygHeadings) => {
    const isActiveInDocument = Boolean($el?.contains(document.activeElement))

    if (!isActiveInDocument || document.activeElement !== $el) {
      $el?.focus()
    }

    const rects = selection?.getRangeAt(0).getClientRects()
    const range = selection?.getRangeAt(0)

    const container = range?.commonAncestorContainer

    if (!rects || !container)
      return

    const containerNodes = container.childNodes

    if (containerNodes.length > 1) {
      const clonedContent = range.cloneContents()

      for (const node of containerNodes) {
        const isNodeNotSelected
          = Boolean(Array.from(clonedContent.childNodes.values())
            .find(childNode => childNode.isEqualNode(node)))

        if (!isNodeNotSelected)
          continue

        const range = new Range()

        selection?.removeAllRanges()

        range.selectNode(node)
        selection?.addRange(range)

        document.execCommand('formatBlock', false, heading)
      }
    }
    else {
      document.execCommand('formatBlock', false, heading)
    }
  }

  return { state: headingState, callCommand }
}
