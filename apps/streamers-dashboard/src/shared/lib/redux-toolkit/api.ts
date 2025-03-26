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

type AxiosQueryFn = BaseQueryFn<
  AxiosBaseQueryArgs,
  AxiosBaseQueryResult,
  AxiosBaseQueryError
>

const axiosBaseQuery =
  (options: AxiosBaseQueryOptions): AxiosQueryFn =>
  /*@ts-ignore */
  async ({ url, method, data, headers, params }) => {
    try {
      const axios = new BaseHttpClient({
        axiosOptions: options.axiosOptions,
        rateLimiterOptions: options.rateLimiterOptions,
      })

      const result = await axios.request(options.baseUrl + url, {
        method,
        data,
        params,
        headers,
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
    const initBaseUrl = import.meta.env.VITE_SERVER_URL + '/api'

    const baseQuery = axiosBaseQuery({
      ...options,
      baseUrl: initBaseUrl,
      axiosOptions: { withCredentials: true },
      rateLimiterOptions: { maxRPS: 3 },
    })

    let result = await baseQuery(
      { ...args, url: options.baseUrl + args.url },
      api,
      extraOptions
    )

    if (result.error && result.error.status === 401) {
      const refreshResult = await baseQuery(
        { url: '/auth/refresh', method: 'POST' },
        api,
        extraOptions
      )

      if (refreshResult.error === undefined) {
        result = await baseQuery(
          { ...args, url: options.baseUrl + args.url },
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
