import type { RefObject } from 'react'
import { useCallback, useLayoutEffect, useRef } from 'react'

type UseScrollIntoViewOptions = ScrollIntoViewOptions & {
	scrollOnInit: boolean
	scrollMargin?: number
}

const useScrollIntoView = (
	target: RefObject<HTMLElement | null>,
	options: UseScrollIntoViewOptions,
) => {
	const { scrollOnInit, scrollMargin, ...scrollIntoViewOptions } = options

	const isScrolledOnInit = useRef(false)

	const scrollIntoView = useCallback(
		(options?: ScrollIntoViewOptions) => {
			const element = target.current

			if (!element)
				return

			element.style.scrollMargin = `${scrollMargin}px`
			element.scrollIntoView(options ?? scrollIntoViewOptions)
		},
		[target, scrollIntoViewOptions, scrollMargin],
	)

	useLayoutEffect(() => {
		if (scrollOnInit && !isScrolledOnInit.current) {
			scrollIntoView(options)
			isScrolledOnInit.current = true
		}
	}, [scrollIntoView, scrollOnInit, options])

	return scrollIntoView
}

export { useScrollIntoView }
