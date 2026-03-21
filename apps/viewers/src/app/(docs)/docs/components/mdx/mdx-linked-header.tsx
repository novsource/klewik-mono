'use client'

import type { TypographyProps } from '~ui/typography'
import { useEffect, useMemo } from 'react'
import { useIntersectionObserver } from '~hooks/index'
import { Divider } from '~ui/divider'
import { Title } from '~ui/typography'
import { cn } from '~utils/cn'
import { useLinkedHeadersContext } from '../../context'

type LinkedHeaderLevels = 1 | 2 | 3

type TypographyPropsByLevel<Level extends LinkedHeaderLevels> = Omit<TypographyProps<`h${Level}`>, 'tag'>

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

	const { addHeader, updateHeadersInView, removeFromView } = useLinkedHeadersContext()

	const { ref, inView, entry } = useIntersectionObserver<HTMLHeadingElement>({ threshold: 0.8 })

	useEffect(() => {
		addHeader({ id, inView })
	}, [id])

	useEffect(() => {
		if (!entry)
			return

		if (inView && entry) {
			updateHeadersInView(id)
		}

		if (!inView)
			removeFromView(id)
	}, [inView, entry, id])

	const styles = useMemo(() =>
		cn(
			level === 2 && 'pt-6',
			level === 3 && 'mt-4',
			className,
		), [level, className])

	const isShouldRenderDivider = (level === 2) && showTopDivider

	return (
		<>
			{isShouldRenderDivider && <Divider orientation="horizontal" />}
			<Title
				ref={ref}
				id={id}
				className={styles}
				level={level}
				{...restProps}
			>
				{ children }
			</Title>
		</>

	)
}
