import { useCallback, useState } from 'react'

import { SocketIOManager } from '~shared/lib/socket.io'

type SocketIOHookOptions = {
  onConnect?: () => void
  onError?: (error: Error) => void
}

type SocketIOHook = {
  connectToServer(): Promise<unknown>
  isConnected: boolean
}

const useSocketIO = (props?: SocketIOHookOptions): SocketIOHook => {
  const [isConnected, setIsConnected] = useState(false)

  const connectToServer = useCallback(async () => {
    if (isConnected) {
      throw new Error('You already connected to server')
    }

    return SocketIOManager.getInstance()
      .connectToServer()
      .then(() => {
        setTimeout(() => {
          setIsConnected(true)
          props?.onConnect && props.onConnect()
        }, 3000)
      })
      .catch(props?.onError)
  }, [])

  return { connectToServer, isConnected }
}

export { useSocketIO }
