import { BaseHttpClient } from '~shared/lib/axios'

const baseHttpClient = new BaseHttpClient({ rateLimiterOptions: { maxRPS: 3 } })

export { baseHttpClient }
