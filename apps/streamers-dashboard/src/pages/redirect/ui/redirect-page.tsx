import { useSearchParams } from 'react-router-dom'

import { RedirectDisplay } from '~features/integrations/connect-integration/ui'

const RedirectPage = () => {
  const params = useSearchParams()

  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="relative flex gap-x-16 tablet:gap-x-36 items-center pb-8">
        <RedirectDisplay provider={params[0].get('provider')} />
      </div>
    </div>
  )
}

export { RedirectPage }
