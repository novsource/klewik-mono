import type { ReactNode } from 'react'

import { useMediaQuery } from '~shared/hooks'

import { isFunction } from '~shared/utils'

import { MediaQueryViewTogglerContextProvider, useMediaQuerySwitcherContext } from '../context/media-query-view-toggler.context'

export type MediaQueryViewTogglerProps = {
  query: string
  children: ReactNode | ((isMatched: boolean) => ReactNode)
}

export const MediaQueryViewToggler = (props: MediaQueryViewTogglerProps) => {
  const { query, children } = props

  const isMatched = useMediaQuery(query)

  return (
    <MediaQueryViewTogglerContextProvider isMatched={isMatched}>
      {isFunction(children) ? children(isMatched) : children}
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
