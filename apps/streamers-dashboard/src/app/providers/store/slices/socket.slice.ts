import { createSlice } from '@reduxjs/toolkit'
import { io } from 'socket.io-client'

type SocketState = {
  socket: NullablePossible<ReturnType<typeof io>>
  isConnected: boolean
}

const initialState: SocketState = {
  socket: null,
  isConnected: false,
}

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {},
})

export const { actions: socketActions, reducer: socketReducer } = socketSlice
