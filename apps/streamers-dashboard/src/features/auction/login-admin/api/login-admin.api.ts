import type { LoginAdmin } from '../model'

import { splittedAuthApi } from '~shared/store/api'

type LoginAdminQueryArgs = LoginAdmin

const loginAdminApi = splittedAuthApi.injectEndpoints({
  endpoints: builder => ({
    loginAdmin: builder.mutation<void, LoginAdminQueryArgs>
    ({ query: data =>
      ({ url: '/login', data, method: 'POST' }) }),
  }),
  overrideExisting: false,
})

const { useLoginAdminMutation } = loginAdminApi

export { loginAdminApi, useLoginAdminMutation }
