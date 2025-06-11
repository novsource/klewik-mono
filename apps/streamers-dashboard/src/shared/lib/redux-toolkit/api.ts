import { BaseQueryFn } from '@reduxjs/toolkit/query'
import {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from 'axios'
import { rateLimitOptions as RateLimitOptions } from 'axios-rate-limit'

import { BaseHttpClient } from '../axios'

type AxiosBaseQueryOptions = {
  baseUrl: string
  axiosOptions?: CreateAxiosDefaults
  rateLimiterOptions?: RateLimitOptions
}

type AxiosBaseQueryArgs = {
  url: string
  method?: AxiosRequestConfig['method']
  data?: AxiosRequestConfig['data']
  params?: AxiosRequestConfig['params']
  headers?: AxiosRequestConfig['headers']
  withCredentials?: AxiosRequestConfig['withCredentials']
}

type AxiosBaseQueryResult = AxiosResponse<unknown, unknown>['data']

type ServerErrorData = {
  message: string
  hint?: string
  reason?: string
}

type AxiosBaseQueryError = {
  status: AxiosError['status']
  message: AxiosError['message']
  reason?: string
  hint?: string
}

type AxiosQueryArgs = AxiosBaseQueryArgs & {
  rewriteBaseURL?: boolean
}

type AxiosQueryFn = BaseQueryFn<
  AxiosQueryArgs,
  AxiosBaseQueryResult,
  AxiosBaseQueryError
>

const axiosBaseQuery =
  (options: AxiosBaseQueryOptions): AxiosQueryFn =>
  /*@ts-ignore */
  async ({
    url,
    method,
    data,
    headers,
    params,
    rewriteBaseURL = false,
    withCredentials = false,
  }) => {
    try {
      const axios = new BaseHttpClient({
        axiosOptions: options.axiosOptions,
        rateLimiterOptions: options.rateLimiterOptions,
      })

      const queryURL = rewriteBaseURL
        ? new URL(url)
        : new URL(url, options.baseUrl)
      const result = await axios.request(queryURL.toJSON(), {
        method,
        data,
        params,
        headers,
        withCredentials,
      })

      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError as AxiosError<ServerErrorData>

      return {
        error: {
          status: err.response?.status || 400,
          message: err.response?.data.message,
          reason: err.response?.data?.reason || '',
          hint: err.response?.data.hint || '',
        },
      }
    }
  }

const axiosAuthBaseQuery =
  (options: AxiosBaseQueryOptions): AxiosQueryFn =>
  async (args, api, extraOptions) => {
    const initBaseUrl = import.meta.env.VITE_SERVER_URL

    const baseQuery = axiosBaseQuery({
      ...options,
      baseUrl: initBaseUrl,
      axiosOptions: { withCredentials: true },
      rateLimiterOptions: { maxRPS: 3 },
    })

    const url = new URL(`/api/v1${options.baseUrl}${args.url}`, initBaseUrl)

    let result = await baseQuery(
      { ...args, ...options, url: url.toString(), rewriteBaseURL: true },
      api,
      extraOptions
    )

    if (result.error && result.error.status === 401) {
      const refreshResult = await baseQuery(
        { url: '/api/v1/auth/refresh', method: 'POST' },
        api,
        extraOptions
      )

      if (refreshResult.error === undefined) {
        result = await baseQuery(
          { ...args, ...options, url: url.toString() },
          api,
          extraOptions
        )
      } else {
        //TODO: Add method for logout user
      }
    }
    return result
  }

export { axiosBaseQuery, axiosAuthBaseQuery }
export type { AxiosBaseQueryError }
