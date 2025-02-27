import { createApi } from '@reduxjs/toolkit/query'

import { BaseHttpClient } from '~shared/lib/axios'
import { axiosBaseQuery } from '~shared/lib/redux-toolkit'

const baseHttpClient = new BaseHttpClient({ rateLimiterOptions: { maxRPS: 3 } })

const baseApi = createApi({
  baseQuery: axiosBaseQuery({
    axiosInstance: baseHttpClient,
    baseUrl: import.meta.env.VITE_SERVER_URL + '/api',
  }),
  endpoints: () => ({}),
})

export { baseApi, baseHttpClient }
