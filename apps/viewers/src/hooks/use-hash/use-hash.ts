import { useEffect, useState } from 'react'

export const useHash = () => {
	const [currentHash, setCurrentHash] = useState<string>('')

	useEffect(() => {
		setCurrentHash(window.location.hash.substring(1))
	}, [])

	useEffect(() => {
		const handleHashChange = () => {
			const hash = window.location.hash.substring(1)

			setCurrentHash(hash)
		}

		window.addEventListener('hashchange', handleHashChange)
		return () => window.removeEventListener('hashchange', handleHashChange)
	}, [])

	useEffect(() => {
		const windowHash = window.location.hash.substring(1)

		const isWindowHashShouldBeUpdated = windowHash !== currentHash && currentHash.length !== 0

		if (isWindowHashShouldBeUpdated) {
			window.location.hash = currentHash
		}
	}, [currentHash])

	const setHash = (hash: string) => {
		setCurrentHash(hash)
	}

	return { hash: currentHash, setHash }
}
