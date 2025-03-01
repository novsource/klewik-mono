import { createApi } from '@reduxjs/toolkit/query/react'

import { axiosAuthBaseQuery } from '~shared/lib/redux-toolkit'

const splittedAuctionSlotsApi = createApi({
  baseQuery: axiosAuthBaseQuery({ baseUrl: '/auction' }),
  reducerPath: 'auctionSlotsApi',
  endpoints: () => ({}),
})

export { splittedAuctionSlotsApi }
