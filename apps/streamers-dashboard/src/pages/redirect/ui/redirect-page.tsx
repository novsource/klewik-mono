import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import { RedirectDisplay } from '~features/integrations/connect-integration/ui'

const RedirectPage = () => {
  const params = useSearchParams()

  useEffect(() => {
    const provider = params[0].get('provider')

    if (!provider) throw new Error('Provider not found')

    if (!['donalerts', 'donatepay'].includes(provider)) {
      throw new Error('Invalid provider')
    }
  }, [])

  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="relative flex gap-x-16 tablet:gap-x-36 items-center pb-8">
        <RedirectDisplay provider={params[0].get('provider') || 'donalerts'} />
      </div>
    </div>
  )
}

export { RedirectPage }
