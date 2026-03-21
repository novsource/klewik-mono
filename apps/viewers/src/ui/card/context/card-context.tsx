import type { ReactNode } from 'react'
import { createContext, use, useMemo } from 'react'

type CardContextValue = {
	size?: 'sm' | 'default' | 'lg'
	variant?: 'default' | 'slots'
}

export type CardContextProps = CardContextValue & {
	children: ReactNode
}

const CardContext = createContext<CardContextValue | null>(null)

export const CardProvider = ({
	children,
	...contextProps
}: CardContextProps) => {
	const styleProps = useMemo(
		() => ({ size: contextProps.size, variant: contextProps.variant }),
		[...Object.keys(contextProps)],
	)

	return (
		<CardContext value={styleProps}>
			{children}
			{' '}
		</CardContext>
	)
}

export const useCardContext = () => {
	const context = use(CardContext)

	if (!context)
		throw new Error('Can\'t use card with no context')

	return context
}
