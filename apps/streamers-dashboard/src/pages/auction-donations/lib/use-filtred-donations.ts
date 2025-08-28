/** @todo Rework with all donations properties */
import { useEffect, useMemo, useState } from 'react'

import type { ProcessedDonation, ProcessedDonationStatus } from '~entities/donation/model'

type FiltredDonationsOptions = {
  status: ProcessedDonationStatus | 'all'
}

type FiltredDonations = Record<ProcessedDonationStatus | 'all', ProcessedDonation[]>

const initialFilterDonationsState: FiltredDonations = {
  all: [],
  added: [],
  checkRequested: [],
  empty: [],
  error: [],
  inProgress: [],
  rejected: [],
}

const useFiltredDonations = (
  data: ProcessedDonation[],
  options: FiltredDonationsOptions,
) => {
  const [allFiltredDonations, setAllFiltredDonations]
    = useState<FiltredDonations>(() => structuredClone(initialFilterDonationsState))

  useEffect(() => {
    const newDonations = structuredClone(initialFilterDonationsState)

    for (const donation of data) {
      newDonations.all.push(donation)
      newDonations[donation.processData.status].push(donation)
    }

    setAllFiltredDonations(newDonations)
  }, [data])

  const donationsWithCurrentStatus = useMemo(() =>
    allFiltredDonations[options.status], [allFiltredDonations, options.status])

  return donationsWithCurrentStatus
}

export { useFiltredDonations }
