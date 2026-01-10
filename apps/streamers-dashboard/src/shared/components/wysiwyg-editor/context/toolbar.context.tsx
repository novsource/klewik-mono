import type { WysiwygEditorCommand } from '../hooks/use-wysiwyg-editor'

import type { ReactNode, RefObject } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'

import { useResizeObserver } from '~shared/hooks'

type WysiwygEditorToolbarContextState = {
  state: {
    toolbarWidth: number
    hiddenCommands: WysiwygEditorCommand[]
  }
  actions: {
    hideCommand: (command: WysiwygEditorCommand) => void
    revealCommand: (command: WysiwygEditorCommand) => void
  }
}

const initialContextState: WysiwygEditorToolbarContextState = {
  state: {
    toolbarWidth: 0,
    hiddenCommands: [],
  },
  actions: {
    hideCommand: () => ({}),
    revealCommand: () => ({}),
  },

}

const WysiwygGEditorToolbarContext = createContext(initialContextState)

export const useWysiwygEditorToolbarContext = () => {
  const context = useContext(WysiwygGEditorToolbarContext)

  if (!context) {
    throw new Error('You should use toolbar context inside provider')
  }

  return context
}

type WysiwygEditorToolbarContextProviderProps = {
  toolbarRef: RefObject<HTMLElement>
  children: ReactNode
}

export const WysiwygEditorToolbarContextProvider = (props: WysiwygEditorToolbarContextProviderProps) => {
  const { toolbarRef, children } = props

  const [toolbarWidth, setToolbarWidth] = useState(initialContextState.state.toolbarWidth)
  const [hiddenCommands, setHiddenCommands] = useState(initialContextState.state.hiddenCommands)

  useResizeObserver(toolbarRef, {
    onChange: (entries) => {
      const [entry] = entries

      const currentWidth = entry.target.clientWidth

      if (toolbarWidth !== currentWidth) {
        setToolbarWidth(currentWidth)
      }
    },
  })

  const hideCommand = (command: WysiwygEditorCommand) => {
    setHiddenCommands(curr => [...curr, command])
  }

  const revealCommand = (command: WysiwygEditorCommand) => {
    setHiddenCommands(curr => curr.filter(com => command !== com))
  }

  const contextValue = useMemo<WysiwygEditorToolbarContextState>(() => ({
    state: {
      toolbarWidth,
      hiddenCommands,
    },
    actions: {
      hideCommand,
      revealCommand,
    },
  }), [hiddenCommands, toolbarWidth])

  return <WysiwygGEditorToolbarContext.Provider value={contextValue}>{ children }</WysiwygGEditorToolbarContext.Provider>
}
