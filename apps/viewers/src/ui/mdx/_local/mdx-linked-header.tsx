'use client'

import type { TypographyProps, TypographyTags } from '~ui/typography'
import { Typography } from '~ui/typography'

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
		className?: string
		level?: LinkedHeaderLevels
		children: string
	}

export const MDXLinkedHeader = <Level extends LinkedHeaderLevels = 1>(props: LinkedHeaderProps<Level>) => {
	const {
		level = 1,
		className,
		children,
		...restProps
	} = props

	const typographyTag = getTypographyTagByLevel(level)

	return (
		<Typography
			className={className}
			tag={typographyTag}
			{...restProps}
		>
			{ children }
		</Typography>
	)
}
