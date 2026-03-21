import { integrationsSelectors } from '~entities/integrations/store'

import { refreshTokens } from '~shared/api/http/auth/auth.api'

import { DONATION_ALERTS_ENDPOINTS } from '~shared/constants/integrations'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { useLazyConnectSSEDonationAlertsQuery } from '../api/donation-alerts'

export type DonationAlertsLocalStorageValue = {
  [auctionUUID: string]: {
    time: number
    key: string
    status: 'success' | ''
  }
}

export type UseAuthDonationAlertsOptions = {
  onSuccess?: () => void
  onError?: () => void
}

export const useAuthDonationAlerts = (options?: UseAuthDonationAlertsOptions) => {
  const { isValid } = useStoreSelector(integrationsSelectors.getDonationAlertsStatus)

  const [connectSSEDonationAlerts, connectSSEDonationAlertsQueryState] = useLazyConnectSSEDonationAlertsQuery()

  const openDonationAlertAuthWindow = async () => {
    if (isValid)
      return

    // Refresh tokens cause when we redirect can be auth error
    const refreshTokensResponse = await refreshTokens()

    if (refreshTokensResponse.status !== 200) {
      return
    }

    const url = new URL(DONATION_ALERTS_ENDPOINTS.AUTHORIZE_URL)
    const donalertsUrlParams = new URLSearchParams({
      client_id: import.meta.env.VITE_DONALERTS_APP_ID,
      redirect_url: import.meta.env.VITE_DA_REDIRECT_URI,
      response_type: 'code',
      scope: import.meta.env.VITE_DONALERTS_SCOPES,
    })

    url.search = donalertsUrlParams.toString()

    window.open(url, '_self')
  }

  const attachDonationsToSSE = async (auctionUUID: string) => {
    const response = await connectSSEDonationAlerts({ auctionUUID })

    if (response.isSuccess) {
      options?.onSuccess?.()
    }

    if (response.isError) {
      options?.onError?.()
    }
  }

  return {
    state: {
      isValid,
      attachDonationsToSSEQueryState: connectSSEDonationAlertsQueryState,
    },
    actions: {
      attachDonationsToSSE,
      openDonationAlertAuthWindow,
    },
  }
}

export type UseConnectDonationAlertsSSEOptions = {
  onSuccess?: () => void
  onError?: () => void
}

export const useConnectDonationAlertsSSE = (options?: UseConnectDonationAlertsSSEOptions) => {
  const [connectSSEDonationAlerts, connectSSEDonationAlertsQueryState] = useLazyConnectSSEDonationAlertsQuery()

  const connectSSE = async (auctionUUID: string) => {
    const response = await connectSSEDonationAlerts({ auctionUUID })

    if (response.isSuccess) {
      options?.onSuccess?.()
    }

    if (response.isError) {
      options?.onError?.()
    }
  }

  return {
    state: connectSSEDonationAlertsQueryState,
    actions: { connectSSE },
  }
}
