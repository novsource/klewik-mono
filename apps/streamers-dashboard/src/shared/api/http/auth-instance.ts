import { AxiosError, AxiosResponse } from 'axios'

import {
  BaseApiClientOptions,
  BaseHttpClient,
  HttpClientRequestOptions,
} from '~shared/lib/axios'

class AuthHttpClient extends BaseHttpClient {
  constructor(options?: BaseApiClientOptions) {
    super({ ...options, axiosOptions: { withCredentials: true } })
  }

  request<T>(
    url: string,
    options?: HttpClientRequestOptions
  ): Promise<AxiosResponse<T, any>> {
    const isAlreadyFetching = this._requestPromisesCollection.has(url)

    if (isAlreadyFetching) {
      return this._requestPromisesCollection.get(url) as Promise<
        AxiosResponse<T>
      >
    }

    const fetchOptions = { url, ...options, method: options?.method ?? 'GET' }

    return new Promise((resolve, reject) => {
      const response = this._internalRequest<T>(url, fetchOptions)

      return response.then(resolve).catch((err: AxiosError) => {
        console.log(err)
        if (err.status === 401) {
          const refreshRequest = fetchOptions.retry
            ? this._retryFetching<T>(
                '/auth/refresh',
                {
                  ...fetchOptions,
                  url: '/api/v1/auth/refresh',
                  method: 'POST',
                },
                fetchOptions.retriesCount
              )
            : this._internalRequest<T>('/auth/refresh', {
                ...fetchOptions,
                url: '/api/v1/auth/refresh',
                method: 'POST',
              })

          return refreshRequest
            .then(() => {
              const response = fetchOptions.retry
                ? this._retryFetching<T>(
                    url,
                    fetchOptions,
                    fetchOptions.retriesCount
                  )
                : this._internalRequest<T>(url, fetchOptions)

              return response.then(resolve).catch(reject)
            })
            .catch(reject)
        }
      })
    })
  }
}

const authHttpClient = new AuthHttpClient({
  axiosOptions: { withCredentials: true },
  rateLimiterOptions: { maxRPS: 3 },
})

export { authHttpClient }
