import { Caption } from '~ui/caption'
import { Divider } from '~ui/divider'
import { Spacer } from '~ui/spacer'
import { Typography } from '~ui/typography'
import { MDXLinkedHeader } from './_local/mdx-linked-header'
import Image from 'next/image'
import { DocsAnimation } from './_local/docs-animation'

export const mdxComponents = {
	LinkedHeader: MDXLinkedHeader,
	Spacer,
	Caption,
	Divider,
	Typography,
	NextImage: Image,
	DocsAnimation
}
