import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import type { AxiosError, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults } from 'axios'
import type { rateLimitOptions as RateLimitOptions } from 'axios-rate-limit'

import type {
  EventSourceMessage,
  SSEClient,
  SSEClientConnectOptions,
  SSEClientListeners,
} from '../fetch-event-source'

import { Mutex } from 'async-mutex'

import { BaseHttpClient } from '../axios'

type AxiosBaseQueryOptions = {
  baseUrl: string
  axiosOptions?: CreateAxiosDefaults
  rateLimiterOptions?: RateLimitOptions
}

type AxiosBaseQueryArgs = {
  url: string
  method?: AxiosRequestConfig['method']
  isBodyFormData?: boolean
  data?: AxiosRequestConfig['data']
  params?: AxiosRequestConfig['params']
  headers?: AxiosRequestConfig['headers']
  withCredentials?: AxiosRequestConfig['withCredentials']
}

type ServerErrorData = {
  message: string
  hint?: string
  reason?: string
}

export type AxiosBaseQueryError = {
  status: AxiosError['status']
  message: AxiosError['message']
  reason?: string
  hint?: string
}

type AxiosBaseQueryResult = AxiosResponse<unknown, any>['data']

type AxiosQueryArgs = AxiosBaseQueryArgs & {
  rewriteBaseURL?: boolean
}

type AxiosQueryFn = BaseQueryFn<
  AxiosQueryArgs,
  AxiosBaseQueryResult,
  AxiosBaseQueryError
>

export const axiosBaseQuery
  = (options: AxiosBaseQueryOptions): AxiosQueryFn =>
    async (args, api) => {
      const {
        url,
        method = 'GET',
        data,
        isBodyFormData = false,
        headers,
        params,
        rewriteBaseURL = false,
      } = args

      const isDev = import.meta.env.VITE_DEV
      try {
        const axios = new BaseHttpClient({
          axiosOptions: options.axiosOptions,
          rateLimiterOptions: options.rateLimiterOptions,
        })

        const queryURL = rewriteBaseURL
          ? isDev
            ? url
            : new URL(url).toString()
          : isDev
            ? `${options.baseUrl}${url}`
            : new URL(url, options.baseUrl).toString()

        const isPostRequestMethod = method === 'POST'

        const contentTypeHeader = isPostRequestMethod && isBodyFormData
          ? 'multipart/form-data'
          : 'application/json'
        const requestHeaders = { ...headers, 'Content-Type': contentTypeHeader }

        const result = await axios.request(queryURL, {
          method,
          data,
          params,
          headers: requestHeaders,
          signal: api.signal,
        })

        return { data: result.data }
      }
      catch (axiosError) {
        const err = axiosError as AxiosError<ServerErrorData>

        return {
          error: {
            status: err.response?.status || 400,
            message: err.response?.data.message ?? '',
            reason: err.response?.data?.reason || '',
            hint: err.response?.data.hint || '',
          },
        }
      }
    }

const authMutex = new Mutex()
export const axiosAuthBaseQuery
  = (options: AxiosBaseQueryOptions): AxiosQueryFn =>
    async (args, api, extraOptions) => {
      const isDev = import.meta.env.VITE_DEV

      const initBaseUrl = import.meta.env.VITE_SERVER_URL

      await authMutex.waitForUnlock()
      const baseQuery = axiosBaseQuery({
        ...options,
        baseUrl: isDev ? null : import.meta.env.VITE_SERVER_URL,
        axiosOptions: { withCredentials: true },
        rateLimiterOptions: { maxRPS: 3 },
      })

      const url = isDev
        ? `/api/v1${options.baseUrl}${args.url}`
        : new URL(`/api/v1${options.baseUrl}${args.url}`, initBaseUrl).toString()

      let result = await baseQuery(
        {
          ...args,
          ...options,
          url,
          rewriteBaseURL: true,
        },
        api,
        extraOptions,
      )

      if (result.error && result.error.status === 401) {
        const isMutexUnlocked = !authMutex.isLocked()

        if (isMutexUnlocked) {
          const release = await authMutex.acquire()
          const refreshTokensResponse = await baseQuery(
            { url: '/api/v1/auth/refresh', method: 'POST', rewriteBaseURL: true },
            api,
            extraOptions,
          )

          if (refreshTokensResponse.error === undefined) {
            release()
            result = await baseQuery(
              { ...args, ...options, url, rewriteBaseURL: true },
              api,
              extraOptions,
            )
          }
          else {
            release()
            const errorURLParams = new URLSearchParams({ reason: 'auth' })
            window.location.replace(`/error?${errorURLParams.toString()}`)
          }
        }
        else {
          await authMutex.waitForUnlock()
          result = await baseQuery(
            { ...args, ...options, url, rewriteBaseURL: true },
            api,
            extraOptions,
          )
        }
      }
      return result
    }

export type SSEQueryArgs = {
  eventURL: string
  options?: SSEClientConnectOptions
}

type SSEQueryFn = BaseQueryFn<SSEQueryArgs>

// export const sseBaseQuery = (): SSEQueryFn =>
//   async (args) => {
//     const { url, listeners, options } = args

//     const sseClient = new BaseSSEClient()

//     const errorHandler = (error: unknown) => {
//       console.log('SSE Error: ', error)
//       throw error
//     }

//     try {
//       await sseClient.connect(url, listeners, {
//         ...options,
//         onerror: options?.onerror
//           ? chain(errorHandler, options.onerror)
//           : errorHandler,
//       })

//       return { data: null }
//     }
//     catch (error) {
//       return { error }
//     }
//   }

type SSEEventQueryOptions = {
  listeners?: SSEClientListeners
  connectOptions?: SSEClientConnectOptions
}

export const sseEventQuery
  = <Events extends Record<string, any> = Record<string, any>, SourceMessage extends EventSourceMessage = EventSourceMessage>(
    client: SSEClient<Events, SourceMessage>,
    options: SSEEventQueryOptions,
  ): SSEQueryFn => {
    const { connectOptions, listeners } = options
    return async (args) => {
      const { eventURL } = args

      try {
        if (!client.isConnected) {
          await client.connectToServer(eventURL, { ...connectOptions, ...listeners })

          return { data: null }
        }
      }
      catch (error) {
        if (error instanceof Error)
          throw error
      }

      return { data: null }
    }
  }
