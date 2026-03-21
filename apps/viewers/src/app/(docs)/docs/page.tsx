import type { Metadata } from 'next'
import { allDocs as allDocsMdx } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { MDXContent } from './components/mdx'

export function generateMetadata(): Metadata {
	return {
		title: 'Документация к поинтовому аукциону Klewik',
	}
}

export default function DocsPage() {
	if (!allDocsMdx)
		return notFound()

	const sortedDocsByOrder = allDocsMdx.sort((first, second) => {
		return first.order - second.order
	})

	return (
		sortedDocsByOrder.map(doc => (
			<section className="mb-12 flex w-full flex-col [&>p]:my-3" key={doc._id}>
				<MDXContent code={doc.body.code} />
			</section>
		))
	)
}
