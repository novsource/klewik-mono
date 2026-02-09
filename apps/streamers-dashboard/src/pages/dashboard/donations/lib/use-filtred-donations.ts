import type { DonationsStatusFilterValue } from '../ui/selects/donations-filter-select.ui'

/** @todo Rework with all donations properties */
import { useEffect, useMemo, useState } from 'react'

import type { ProcessedDonation } from '~entities/donation/model'

type FiltredDonationsOptions = {
  status: DonationsStatusFilterValue
}

type FiltredDonations = Record<DonationsStatusFilterValue, ProcessedDonation[]>

const initialFilterDonationsState: FiltredDonations = {
  all: [],
  added: [],
  checkRequested: [],
  empty: [],
  error: [],
  inProgress: [],
  rejected: [],
}

const filterDonations = (donations: ProcessedDonation[]) => {
  const filtredDonations = structuredClone(initialFilterDonationsState)

  for (const donation of donations) {
    filtredDonations.all.push(donation)
    filtredDonations[donation.processData.status].push(donation)
  }

  return filtredDonations
}

const useFiltredDonations = (
  data: ProcessedDonation[],
  options: FiltredDonationsOptions,
) => {
  const [filtredDonations, setFiltredDonations]
    = useState<FiltredDonations>(() => filterDonations(data))

  useEffect(() => {
    const filtredDonation = filterDonations(data)

    setFiltredDonations(filtredDonation)
  }, [data])

  const donationsWithCurrentStatus = useMemo(() => {
    if (!options.status)
      return filtredDonations.all

    return filtredDonations[options.status]
  }, [filtredDonations, options.status])

  return donationsWithCurrentStatus
}

export { useFiltredDonations }
