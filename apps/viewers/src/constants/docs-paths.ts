export type DocsRoutesItem = {
	id: string
	title: string
}

export type DocsRoutes = Record<string, DocsRoutesItem>

export const docsPaths: Readonly<DocsRoutes> = {
	about: {
		id: 'about',
		title: 'О проекте',
	},
	getStarted: {
		id: 'getStarted',
		title: 'Создание аукциона',
	},
	donations: {
		id: 'donations',
		title: 'Пожертвования',
	},
	integrations: {
		id: 'integrations',
		title: 'Интеграции',
	},
	slots: {
		id: 'slots',
		title: 'Слоты',
	},
	points: {
		id: 'points',
		title: 'Очки',
	},
	viewers: {
		id: 'viewers',
		title: 'Зрителям',
	},
} as const

export type DocsPaths = typeof docsPaths[number]
