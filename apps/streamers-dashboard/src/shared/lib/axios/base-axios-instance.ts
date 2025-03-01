import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios'
import axiosRateLimit, {
  rateLimitOptions as AxiosRateLimitOptions,
} from 'axios-rate-limit'

type BaseApiClientOptions = {
  axiosOptions?: CreateAxiosDefaults
  rateLimiterOptions?: AxiosRateLimitOptions
}

export type HttpClientRequestOptions = AxiosRequestConfig & {
  retry?: boolean
  retriesCount?: number
}

interface BaseHttpClientMethods {
  get<T>(url: string, options?: AxiosRequestConfig): Promise<AxiosResponse<T>>
  post<T>(url: string, options?: AxiosRequestConfig): Promise<AxiosResponse<T>>
  patch<T>(url: string, options?: AxiosRequestConfig): Promise<AxiosResponse<T>>
  put<T>(url: string, options?: AxiosRequestConfig): Promise<AxiosResponse<T>>
}

export class BaseHttpClient implements BaseHttpClientMethods {
  private readonly _defaultMaxRPS = 2
  private readonly _requestPromisesCollection = new Map<
    string,
    Promise<unknown>
  >([])
  private readonly _axiosInstance

  constructor(options?: BaseApiClientOptions) {
    this._axiosInstance = axiosRateLimit(
      axios.create({
        baseURL: import.meta.env.VITE_SERVER_URL,
        ...options?.axiosOptions,
      }),
      { maxRPS: this._defaultMaxRPS, ...options?.rateLimiterOptions }
    )
  }

  addRequestInterceptor(
    configHandler: <T extends InternalAxiosRequestConfig<unknown>>(
      config: T
    ) => T | Promise<T>,
    errorHandler?: <T extends unknown>(error: T) => Promise<T>
  ) {
    const interceptorId = this._axiosInstance.interceptors.request.use(
      configHandler,
      errorHandler
    )

    return () => {
      this._axiosInstance.interceptors.request.eject(interceptorId)
    }
  }

  addResponseInterceptor<V extends unknown, T extends unknown>(
    responseCb: (response: AxiosResponse<V, T>) => AxiosResponse<V, T>,
    errorHandler?: <T extends unknown>(error: T) => Promise<T>
  ) {
    const interceptorId = this._axiosInstance.interceptors.response.use(
      responseCb,
      errorHandler
    )

    return () => {
      this._axiosInstance.interceptors.response.eject(interceptorId)
    }
  }

  request<T>(url: string, options?: HttpClientRequestOptions) {
    const isAlreadyFetching = this._requestPromisesCollection.has(url)

    if (isAlreadyFetching) {
      return this._requestPromisesCollection.get(url) as Promise<
        AxiosResponse<T>
      >
    }

    const fetchOptions = { url, ...options, method: options?.method ?? 'GET' }

    if (fetchOptions.retry) {
      return this._retryFetching<T>(
        url,
        fetchOptions,
        fetchOptions.retriesCount
      )
    }
    return this._internalRequest<T>(url, fetchOptions)
  }

  get<T>(
    url: string,
    options?: HttpClientRequestOptions
  ): Promise<AxiosResponse<T>> {
    return this.request<T>(url, { ...options, method: 'GET' })
  }

  put<T>(
    url: string,
    options?: HttpClientRequestOptions
  ): Promise<AxiosResponse<T>> {
    return this.request<T>(url, { ...options, method: 'PUT' })
  }

  post<T>(
    url: string,
    options?: HttpClientRequestOptions
  ): Promise<AxiosResponse<T>> {
    return this.request<T>(url, { ...options, method: 'POST' })
  }

  patch<T>(
    url: string,
    options?: HttpClientRequestOptions
  ): Promise<AxiosResponse<T>> {
    return this.request<T>(url, { ...options, method: 'PATCH' })
  }

  private _retryFetching<T>(
    url: string,
    options?: HttpClientRequestOptions,
    count: number = 3,
    delay: number = 1000
  ): Promise<AxiosResponse<T>> {
    const onCatchHandler = (error: Error) => {
      count -= 1

      if (count === 0) {
        throw error
      }

      return this._wait(delay).then(() =>
        this._retryFetching<T>(url, options, count, delay)
      )
    }

    return this._internalRequest<T>(url, { url, ...options }).catch(
      onCatchHandler
    )
  }

  private _wait(delay: number = 1000) {
    return new Promise((resolve) => setTimeout(resolve, delay))
  }

  private _internalRequest<T>(url: string, config: HttpClientRequestOptions) {
    const request = this._axiosInstance
      .request<T>(config)
      .finally(() => this._requestPromisesCollection.delete(url))

    this._requestPromisesCollection.set(url, request)

    return request
  }
}
