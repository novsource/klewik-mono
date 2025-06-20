import { createApi } from '@reduxjs/toolkit/query/react'

import { axiosAuthBaseQuery } from '~shared/lib/redux-toolkit'

const splittedDonationApi = createApi({
  baseQuery: axiosAuthBaseQuery({ baseUrl: '/auctions' }),
  reducerPath: 'donationsApi',
  endpoints: () => ({}),
})

export { splittedDonationApi }
