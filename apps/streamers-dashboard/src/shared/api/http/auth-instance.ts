import type { AxiosError, AxiosResponse } from 'axios'

import { Mutex } from 'async-mutex'

import type {
  BaseApiClientOptions,
  HttpClientRequestOptions,
} from '~shared/lib/axios'
import {
  BaseHttpClient,
} from '~shared/lib/axios'

const mutex = new Mutex()

class AuthHttpClient extends BaseHttpClient {
  constructor(options?: BaseApiClientOptions) {
    super({ ...options, axiosOptions: { withCredentials: true } })
  }

  async request<T>(
    url: string,
    options?: HttpClientRequestOptions,
  ): Promise<AxiosResponse<T, any>> {
    const fetchOptions = { url, ...options, method: options?.method ?? 'GET' }

    await mutex.waitForUnlock()

    return this._internalRequest<T>(url, fetchOptions).catch(async (error) => {
      const axiosError = error as AxiosError

      const isAuthError = axiosError.status === 401

      if (!isAuthError)
        throw error

      const isShouldRetry = !!fetchOptions.retry

      if (!mutex.isLocked()) {
        try {
          const release = await mutex.acquire()

          if (isShouldRetry) {
            await this._retryFetching<T>('/api/v1/auth/refresh', {
              ...fetchOptions,
              url: '/api/v1/auth/refresh',
              method: 'POST',
            }, fetchOptions.retriesCount)
          }
          else {
            await this._internalRequest<T>('/api/v1/auth/refresh', {
              ...fetchOptions,
              url: '/api/v1/auth/refresh',
              method: 'POST',
            })
          }

          release()
        }
        catch {
          throw axiosError
        }
      }

      await mutex.waitForUnlock()
      return this._internalRequest<T>(url, fetchOptions)
    })
  }
}

export const authHttpClient = new AuthHttpClient({
  axiosOptions: { withCredentials: true },
  rateLimiterOptions: { maxRPS: 3 },
})
