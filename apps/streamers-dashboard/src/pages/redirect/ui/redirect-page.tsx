import { useEffect } from 'react'

import { useSearchParams } from 'react-router-dom'

import { RedirectDisplay } from '~features/integrations/connect-integration/ui'

import { Flex } from '~shared/ui/flex'

const RedirectPage = () => {
  const params = useSearchParams()

  useEffect(() => {
    const provider = params[0].get('provider')

    if (!provider)
      throw new Error('Provider not found')

    if (!['donationAlerts', 'donatepay'].includes(provider)) {
      throw new Error('Invalid provider')
    }
  }, [params])

  return (
    <Flex className="w-full h-full" align="center" justify="center">
      <Flex className="relative gap-x-16 pb-8 tablet:gap-x-36" align="center">
        <RedirectDisplay
          platform={params[0].get('provider') || 'donationAlerts'}
        />
      </Flex>
    </Flex>
  )
}

export { RedirectPage }
