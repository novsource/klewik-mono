'use client'

import { useEffect, useRef } from 'react'

import { useAppContext } from '~context/app-context'
import { useIntersection } from '~hooks/use-intersection'
import { Typography } from '~ui/typography'
import { IntegrationPlatformChip } from '../../components/integration-chip'

const IntegrationsInfo = () => {
	const {
		state: { integrations },
		dispatchers,
	} = useAppContext()
	const integrationsCardWrapperRef = useRef<HTMLDivElement | null>(null)

	const { entry, inView } = useIntersection(integrationsCardWrapperRef, {
		threshold: 0,
	})

	useEffect(() => {
		if (integrations.inView !== inView || integrations.entry !== entry) {
			dispatchers?.integrations({
				inView,
				entry,
			})
		}
	}, [inView, entry, dispatchers, integrations])

	return (
		<div
			ref={integrationsCardWrapperRef}
			className="flex flex-col gap-y-2.5 tablet:gap-y-4"
		>
			<div className="flex flex-col gap-y-1.5 items-start">
				<Typography className="text-sm font-semibold text-gray-accent" tag="p">
					Транслируется на стриминговые платформы
				</Typography>
				<div className="flex divide-x-1 divide-gray/50 -ml-1">
					<IntegrationPlatformChip
						href="https://www.twitch.tv/nyamuras"
						integrationName="Twitch"
					/>
					<IntegrationPlatformChip
						href="https://www.youtube.com"
						integrationName="Youtube"
					/>
				</div>
			</div>
			<div className="flex flex-col gap-y-1.5 items-start">
				<Typography className="text-sm font-semibold text-gray-accent" tag="p">
					Подключенные интеграции
				</Typography>
				<div className="flex divide-x-1 divide-gray/50 -ml-1">
					<IntegrationPlatformChip
						href="https://www.donationalerts.com/r/bratishkinoff"
						integrationName="Donation Alerts"
					/>
				</div>
			</div>
		</div>
	)
}

export { IntegrationsInfo }
