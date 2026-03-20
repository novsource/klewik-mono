import { createApi } from '@reduxjs/toolkit/query/react'

import { axiosAuthBaseQuery } from '~shared/lib/redux-toolkit'

export const splittedWheelApi = createApi({
  baseQuery: axiosAuthBaseQuery({ baseUrl: '/auctions' }),
  endpoints: () => ({}),
})
