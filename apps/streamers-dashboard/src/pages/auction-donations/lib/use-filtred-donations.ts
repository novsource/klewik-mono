/**@todo Rework with all donations properties */
import { useEffect, useState } from 'react'

import { Donation } from '~entities/donation/model'

type FiltredDonationsOptions = {
  status: Donation['processingStatus'] | 'default'
}

/**
 *
 * @param data
 * @param options
 */
const useFiltredDonations = (
  data: Donation[],
  options: FiltredDonationsOptions
) => {
  const [filtredDonations, setFiltredDonations] = useState(() => data)

  useEffect(() => {
    setFiltredDonations(() => {
      if (options.status === 'default') return data

      return data.filter(
        (donation) => donation.processingStatus === options.status
      )
    })
  }, [data, options.status])

  return filtredDonations
}

export { useFiltredDonations }
