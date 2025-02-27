import { BaseQueryFn } from '@reduxjs/toolkit/query'
import { AxiosError, AxiosRequestConfig } from 'axios'

import type { BaseHttpClient } from '../axios'

type AxiosBaseQueryOptions = {
  axiosInstance: BaseHttpClient
  baseUrl: string
}

const axiosBaseQuery =
  (
    options: AxiosBaseQueryOptions
  ): BaseQueryFn<
    {
      url: string
      method?: AxiosRequestConfig['method']
      data?: AxiosRequestConfig['data']
      params?: AxiosRequestConfig['params']
      headers?: AxiosRequestConfig['headers']
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await options.axiosInstance.request(
        options.baseUrl + url,
        {
          method,
          data,
          params,
          headers,
        }
      )
      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError as AxiosError
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      }
    }
  }

export { axiosBaseQuery }
