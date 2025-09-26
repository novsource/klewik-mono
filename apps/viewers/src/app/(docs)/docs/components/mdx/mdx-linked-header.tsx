'use client'

import type { TypographyProps, TypographyTags } from '~ui/typography'
import { useEffect, useMemo } from 'react'
import { useIntersectionObserver } from '~hooks/index'
import { Divider } from '~ui/divider'
import { Typography } from '~ui/typography'
import { cn } from '~utils/cn'
import { useLinkedHeadersContext } from '../../context'

type LinkedHeaderLevels = 1 | 2 | 3

type TypographyPropsByLevel<Level extends LinkedHeaderLevels> = Omit<TypographyProps<`h${Level}`>, 'tag'>

const getTypographyTagByLevel = (level: LinkedHeaderLevels) => {
	const levelToTag = {
		1: 'h1',
		2: 'h2',
		3: 'h3',
	}

	return levelToTag[level] as TypographyTags
}

type LinkedHeaderProps<Level extends LinkedHeaderLevels> = TypographyPropsByLevel<Level>
	& {
		id: string
		className?: string
		level?: LinkedHeaderLevels
		showTopDivider?: boolean
		children: string
	}

export const MDXLinkedHeader = <Level extends LinkedHeaderLevels = 1>(props: LinkedHeaderProps<Level>) => {
	const {
		id,
		level = 1,
		showTopDivider = true,
		className,
		children,
		...restProps
	} = props

	const { updateHeadersInView, removeFromView } = useLinkedHeadersContext()

	const { ref, inView, entry } = useIntersectionObserver({ threshold: 0.8 })

	useEffect(() => {
		if (!entry)
			return

		if (inView && entry) {
			updateHeadersInView({
				id,
				top: entry.boundingClientRect.top,
				bottom: entry.boundingClientRect.bottom,
			})
		}

		if (!inView)
			removeFromView(id)
	}, [inView, entry, id])

	const typographyTag = getTypographyTagByLevel(level)

	const styles = useMemo(() =>
		cn(
			level === 2 && 'pt-6',
			level === 3 && 'mt-4',
			className,
		), [typographyTag, className])

	const isShouldRenderDivider = (level === 2) && showTopDivider

	return (
		<>
			{isShouldRenderDivider && <Divider orientation="horizontal" />}
			<Typography
				ref={ref}
				id={id}
				className={styles}
				tag={typographyTag}
				{...restProps}
			>
				{ children }
			</Typography>
		</>

	)
}
