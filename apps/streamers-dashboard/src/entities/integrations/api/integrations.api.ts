import { createApi } from '@reduxjs/toolkit/query/react'

import { axiosAuthBaseQuery } from '~shared/lib/redux-toolkit'

const splittedIntegrationsApi = createApi({
  baseQuery: axiosAuthBaseQuery({ baseUrl: '/auctions' }),
  reducerPath: 'integrationsApi',
  endpoints: () => ({}),
})

export { splittedIntegrationsApi }
