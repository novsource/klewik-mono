/** @todo Rework with all donations properties */
import { useEffect, useState } from 'react'

import type { ProcessedDonation } from '~entities/donation/model'

type FiltredDonationsOptions = {
  status: ProcessedDonation['processedStatus'] | 'default'
}

/**
 *
 * @param data
 * @param options
 */
const useFiltredDonations = (
  data: ProcessedDonation[],
  options: FiltredDonationsOptions,
) => {
  const [filtredDonations, setFiltredDonations] = useState(() => data)

  useEffect(() => {
    setFiltredDonations(() => {
      if (options.status === 'default')
        return data

      return data.filter(
        donation => donation.processedStatus === options.status,
      )
    })
  }, [data, options.status])

  return filtredDonations
}

export { useFiltredDonations }
