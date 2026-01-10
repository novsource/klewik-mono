import type { ComponentPropsWithoutRef } from 'react'
import { useRef } from 'react'

import { Divider } from '~shared/ui/divider'

import { cn } from '~shared/utils'

import {
  WysiwygEditorToolbarContextProvider,
} from '../context/toolbar.context'
import { WysiwygEditorCommandButton } from './controls/wysiwyg-editor-command-button.ui'
import { WysiwygEditorHeadingCommandsSelect } from './controls/wysiwyg-editor-command-select.ui'

export type WysiwygEditorToolbarProps = ComponentPropsWithoutRef<'div'>

export const WysiwygEditorToolbar = (props: WysiwygEditorToolbarProps) => {
  const { className, ...restProps } = props

  const toolbarRef = useRef<HTMLDivElement>(null)

  return (
    <WysiwygEditorToolbarContextProvider toolbarRef={toolbarRef}>
      <div
        ref={toolbarRef}
        className={cn('sticky top-0 w-full h-10 bg-dark-foreground-light rounded-small overflow-clip', className)}
        {...restProps}
      >
        <div className="flex h-full w-full px-1.75 py-1.5 items-center gap-x-0.5">

          <WysiwygEditorCommandButton.Undo />
          <WysiwygEditorCommandButton.Redo />

          <Divider className="mx-1 tablet:mx-2" orientation="vertical" />

          <WysiwygEditorCommandButton.Bold />
          <WysiwygEditorCommandButton.Italic />
          <WysiwygEditorCommandButton.Underline />
          <WysiwygEditorCommandButton.Strike />

          <Divider className="mx-1 tablet:mx-2" orientation="vertical" />

          <WysiwygEditorHeadingCommandsSelect showSelectedHeader={false} />
        </div>
      </div>
    </WysiwygEditorToolbarContextProvider>
  )
}
