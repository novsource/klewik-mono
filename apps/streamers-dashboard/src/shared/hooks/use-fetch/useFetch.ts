import { useCallback, useEffect, useMemo, useState } from 'react'

import { HttpClientRequestOptions, baseHttpClient } from '@api/instance'
import { AxiosPromise } from 'axios'

type UseFetchReturn<T> = {
  state: {
    error: NullablePossible<Error>
    isPending: boolean
    data: NullablePossible<T>
  }
  func: {
    query: (fetchOptions?: HttpClientRequestOptions) => AxiosPromise<T>
    abort: () => void
  }
}

export const useFetch = <T>(
  url: string,
  initFetchOptions?: HttpClientRequestOptions
): UseFetchReturn<T> => {
  const [isPending, setIsPending] = useState<boolean>(false)
  const [data, setData] = useState<NullablePossible<T>>(null)
  const [error, setError] = useState<NullablePossible<Error>>(null)

  const abortController = useMemo(() => new AbortController(), [])

  const startFetching = useCallback(
    async (fetchOptions?: HttpClientRequestOptions) => {
      setIsPending(true)

      return baseHttpClient
        .request<T>(url, {
          ...initFetchOptions,
          ...fetchOptions,
          signal: abortController.signal,
        })
        .then((response) => {
          setData(response.data)
          return response
        })
        .catch((err) => {
          setError(err)
          throw err
        })
        .finally(() => setIsPending(false))
    },
    [url, initFetchOptions]
  )

  useEffect(() => {
    if (!isPending) startFetching()

    return () => {
      if (isPending) abortController.abort()
    }
  }, [startFetching, isPending])

  return {
    state: { error, isPending, data },
    func: { query: startFetching, abort: abortController.abort },
  }
}
