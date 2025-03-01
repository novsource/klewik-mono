import { BaseHttpClient } from '~shared/lib/axios'

const authHttpClient = new BaseHttpClient({
  axiosOptions: { withCredentials: true },
  rateLimiterOptions: { maxRPS: 3 },
})

export { authHttpClient }
