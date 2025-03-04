import { createApi } from '@reduxjs/toolkit/query/react'

import { axiosAuthBaseQuery } from '~shared/lib/redux-toolkit'

const splittedSSEApi = createApi({
  baseQuery: axiosAuthBaseQuery({ baseUrl: '/sse' }),
  endpoints: () => ({}),
})

export { splittedSSEApi }
