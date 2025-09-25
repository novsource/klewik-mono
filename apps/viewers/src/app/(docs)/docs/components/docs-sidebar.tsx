'use client'

import type { ComponentProps } from 'react'
import type { DocsRoutes, DocsRoutesItem } from '~/constants'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useHash } from '~hooks/index'
import { Typography } from '~ui/typography'
import { cn } from '~utils/cn'

type SidebarListItemsMarkerProps = Omit<ComponentProps<'span'>, 'style'> & {
	activeItemId: string
}

function SidebarListItemsMarker(props: SidebarListItemsMarkerProps) {
	const { activeItemId, className, ...restProps } = props

	const [isShowed, setIsShowed] = useState(false)
	const [top, setTop] = useState(0)
	const [height, setHeight] = useState(0)

	const internalRef = useRef<HTMLSpanElement>(null)

	useEffect(() => {
		const element = internalRef.current

		if (!element)
			return

		const sidebar = element.parentElement!

		const activeItem = Array.from(sidebar.childNodes.values()).find((node) => {
			const castNode = node as HTMLElement

			const itemId = castNode.dataset.routeId

			if (!itemId) {
				return false
			}

			return itemId === activeItemId
		})

		if (activeItem) {
			const { top, height } = (activeItem as HTMLElement).getBoundingClientRect()
			const sidebarRect = sidebar.getBoundingClientRect()

			setIsShowed(true)
			setTop(top - sidebarRect.top)
			setHeight(height)
		}
		else {
			setIsShowed(false)
			setTop(0)
			setHeight(0)
		}
	}, [activeItemId])

	return (
		<span
			ref={internalRef}
			className={cn('bg-green-accent absolute -left-0.25 w-0.25 transition-all', className)}
			style={{
				display: isShowed ? 'inline-block' : 'none',
				top,
				height,
			}}
			{...restProps}
		/>
	)
}

type SidebarListItemProps = ComponentProps<'li'> & {
	route: DocsRoutesItem
	isActive?: boolean
}

function SidebarListItem(props: SidebarListItemProps) {
	const { route, isActive = false, className, ...restProps } = props

	return (
		<li
			className={cn('text-md cursor-default leading-5 transition-colors', className)}
			data-route-id={route.id}
			{...restProps}
		>
			<a
				className={cn(
					!isActive && 'text-gray/70 hover:text-gray-light',
					isActive && 'text-green-accent',
				)}
				href={`#${route.id}`}
			>
				{route.title}
			</a>
		</li>
	)
}

type SidebarProps = {
	routes: DocsRoutes
	hash: string
}

function SidebarList(props: SidebarProps) {
	const { routes, hash } = props

	const sidebarRoutes = useMemo(() => {
		return Object.entries(routes).map(([_, route]) => {
			const isActive = route.id === hash

			return <SidebarListItem key={route.id} isActive={isActive} route={route} />
		})
	}, [routes, hash])

	return (
		<ul className="border-dark-accent relative flex h-full w-full flex-col justify-end gap-y-2 border-l-1 pl-4">
			<SidebarListItemsMarker activeItemId={hash} />
			{sidebarRoutes}
		</ul>
	)
}

export type DocsSidebarProps = ComponentProps<'aside'> & {
	routes: DocsRoutes
}

function getHashPath(routes: DocsRoutes, windowHash: string) {
	const isHashEmpty = windowHash.length === 0

	if (isHashEmpty)
		return ''

	const isActiveHeaderNotExist = !Object.keys(routes).includes(windowHash)

	if (isActiveHeaderNotExist)
		return routes[0]

	return windowHash
}

function DocsSidebar(props: DocsSidebarProps) {
	const { routes, className, ...restProps } = props

	const [currentHash, setCurrentHash] = useState<string>('')

	const { hash: windowHash } = useHash()

	useEffect(() => {
		if (Object.keys(routes).length === 0) {
			return setCurrentHash('')
		}

		const hash = getHashPath(routes, windowHash)

		setCurrentHash(hash)
	}, [routes, windowHash])

	return (
		<aside className={cn('h-full w-56', className)} {...restProps}>
			<nav className="fixed top-16 h-fit py-4">
				<Typography className="mb-2.5" tag="h4">Разделы</Typography>
				<SidebarList hash={currentHash} routes={routes} />
			</nav>
		</aside>
	)
}

export default DocsSidebar
