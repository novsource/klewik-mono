import { baseHttpClient, HttpClientRequestOptions } from '@/api/instance'

import { useCallback, useEffect, useState } from 'react'

type UseFetchReturn<T> = {
  state: {
    error: NullablePossible<Error>
    isLoading: boolean
    data: NullablePossible<T>
  }
}

export const useFetch = <T>(
  url: string,
  fetchOptions?: HttpClientRequestOptions
): UseFetchReturn<T> => {
  const [data, setData] = useState<NullablePossible<T>>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<NullablePossible<Error>>(null)

  const fetching = useCallback(async () => {
    const abortController = new AbortController()

    if (!isLoading) {
      setIsLoading(true)

      // Use GET method like default method
      baseHttpClient
        .request<T>(url, fetchOptions)
        .then((response) => {
          setData(response.data)
        })
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false))
    }
    return () => {
      if (isLoading) abortController.abort()
    }
  }, [url, fetchOptions])

  useEffect(() => {
    fetching()
  }, [fetching])

  return {
    state: { error, isLoading, data },
  }
}
