import { createApi } from '@reduxjs/toolkit/query/react'

import { axiosAuthBaseQuery } from '~shared/lib/redux-toolkit'

const splittedAuctionApi = createApi({
  baseQuery: axiosAuthBaseQuery({ baseUrl: '/auction' }),
  reducerPath: 'auctionApi',
  endpoints: () => ({}),
})

export { splittedAuctionApi }
