import { Manager, Socket } from 'socket.io-client'

class SocketIOManager {
  private static _instance: SocketIOManager

  private readonly _manager: Manager
  private readonly _socket: Socket

  private constructor() {
    this._manager = new Manager(import.meta.env.VITE_SERVER_URL, {
      autoConnect: false,
      withCredentials: true,
    })
    this._socket = this._manager.socket('/')
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new SocketIOManager()
    }

    return this._instance
  }

  async connectToServer() {
    return new Promise((resolve, reject) =>
      this._manager.open((error) => {
        if (error) {
          reject(error)
        } else {
          resolve(true)
        }
      })
    )
  }
}

export { SocketIOManager }
