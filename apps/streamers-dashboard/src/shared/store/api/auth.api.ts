import { createApi } from '@reduxjs/toolkit/query/react'

import { axiosBaseQuery } from '~shared/lib/redux-toolkit'

const splittedAuthApi = createApi({
  baseQuery: axiosBaseQuery({ baseUrl: `/api/v1/auth` }),
  reducerPath: 'authApi',
  endpoints: () => ({}),
})

export { splittedAuthApi }
