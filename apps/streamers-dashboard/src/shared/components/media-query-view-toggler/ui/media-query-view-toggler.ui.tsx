import type { ReactNode } from 'react'

import { MediaQueryViewTogglerContextProvider, useMediaQuerySwitcherContext } from '../context/media-query-view-toggler.context'

export type MediaQueryViewTogglerProps = {
  query: string
  children: ReactNode
}

export const MediaQueryViewToggler = (props: MediaQueryViewTogglerProps) => {
  const { query, children } = props

  return (
    <MediaQueryViewTogglerContextProvider query={query}>
      {children}
    </MediaQueryViewTogglerContextProvider>
  )
}

MediaQueryViewToggler.MatchedItem = MediaQueryViewTogglerMatchedItem
MediaQueryViewToggler.NotMatchedItem = MediaQueryViewTogglerNotMatched

export type MediaQuerySwitcherItemProps = {
  children: ReactNode
}

function MediaQueryViewTogglerMatchedItem(props: MediaQuerySwitcherItemProps) {
  const { children } = props

  const { isMatched } = useMediaQuerySwitcherContext()

  if (!isMatched)
    return null

  return children
}

function MediaQueryViewTogglerNotMatched(props: MediaQuerySwitcherItemProps) {
  const { children } = props

  const { isMatched } = useMediaQuerySwitcherContext()

  if (isMatched)
    return null

  return children
}
