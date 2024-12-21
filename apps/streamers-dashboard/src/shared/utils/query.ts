type FetchParamsInit = Parameters<typeof fetch>['1']

function generateHashCode(str: string) {
  return str.split('').reduce((acc, char) => {
    return (acc << 5) - acc + char.charCodeAt(0)
  }, 0)
}

class Observable<T extends (...args: unknown[]) => void> {
  private subscribers: Array<T> = []

  public notify(data: unknown) {
    this.subscribers.forEach((func) => func(data))
  }

  public subscribe(item: T) {
    this.subscribers.push(item)
  }

  public unsubscribe(value: T) {
    this.subscribers.filter((item) => item !== value)
  }
}

const createQuery = () => {
  const queryStore = new Map<number, AbortController['abort']>()
  const onFulfillObserver = new Map<number, Observable<any>>()
  const onErrorObserver = new Map<number, Observable<any>>()

  async function query(
    input: string | URL,
    init?: FetchParamsInit
  ): Promise<Response> {
    return new Promise((resolve, reject) => {
      const url = new URL(input)
      const urlKey = generateHashCode(url.pathname)

      const isAlreadyFetching = !!queryStore.get(urlKey)

      if (!isAlreadyFetching) {
        const controller = new AbortController()

        queryStore.set(urlKey, controller.abort)

        onFulfillObserver.set(urlKey, new Observable())
        onErrorObserver.set(urlKey, new Observable())

        fetch(input, { ...init, signal: AbortSignal.timeout(3000) })
          .then((response) => onFulfillObserver.get(urlKey)?.notify(response))
          .catch((reason) => onErrorObserver.get(urlKey)?.notify(reason))
          .finally(() => {
            queryStore.delete(urlKey)

            onFulfillObserver.get(urlKey)?.unsubscribe(resolve)
            onErrorObserver.get(urlKey)?.unsubscribe(reject)
          })
      }

      onFulfillObserver.get(urlKey)?.subscribe(resolve)
      onErrorObserver.get(urlKey)?.subscribe(reject)
    })
  }

  return query
}

const query = createQuery()

export { query }
