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
}

type AxiosBaseQueryResult = AxiosResponse<unknown, unknown>['data']

type AxiosBaseQueryError = {
  status: AxiosError['status']
  data: AxiosError['response']
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
      const err = axiosError as AxiosError

      return {
        error: {
          status: err.response?.status || 400,
          data: err.response?.data || err.message,
        },
      }
    }
  }

const axiosAuthBaseQuery =
  (options: AxiosBaseQueryOptions): AxiosQueryFn =>
  async (args, api, extraOptions) => {
    const baseQuery = axiosBaseQuery({
      ...options,
      baseUrl: import.meta.env.VITE_SERVER_URL + '/api' + options.baseUrl,
      axiosOptions: { withCredentials: true },
      rateLimiterOptions: { maxRPS: 3 },
    })

    let result = await baseQuery(args, api, extraOptions)

    if (result.error && result.error.status === 401) {
      const refreshResult = await baseQuery(
        { url: '/auth/refresh' },
        api,
        extraOptions
      )

      if (refreshResult.data) {
        result = await baseQuery(args, api, extraOptions)
      } else {
        //TODO: Add method for logout user
      }
    }
    return result
  }

export { axiosBaseQuery, axiosAuthBaseQuery }
