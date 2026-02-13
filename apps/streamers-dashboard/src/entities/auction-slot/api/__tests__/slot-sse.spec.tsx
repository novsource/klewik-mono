import type { ReactNode } from 'react'

import { Provider } from 'react-redux'

import { act, renderHook, waitFor } from '@testing-library/react'
import { sse } from 'msw'
import { setupServer } from 'msw/node'

import { rootStore as appStore, createStore } from '~app/store/store'

import type { AuctionSlotsEventsMap, AuctionSlotsEventSourceMessage } from '~shared/api/sse/clients/auction-slots'
import { auctionSlotsSSEClient } from '~shared/api/sse/clients/auction-slots'

import { useLazyConnectAuctionSlotsSSEQuery } from '~shared/store/api'

import { wait } from '~shared/utils'

import { createFakeAuctionSlotsArray, createSingleFakeAuctionSlot } from '../../model/__tests__/auction-slot.mocks'

const SLOTS_SSE_URL = '/api/v1/auctions/:uuid/sse/slots-events'

const server = setupServer()

let store = appStore

beforeAll(() => server.listen())
beforeEach(() => {
  store = createStore()
})

afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('### sse auction slots api', () => {
  it('should connect', async () => {
    server.use(
      sse<AuctionSlotsEventsMap>(SLOTS_SSE_URL, ({ client }) => {
        const message: AuctionSlotsEventSourceMessage = {
          id: '1',
          data: JSON.stringify(createFakeAuctionSlotsArray()),
          event: 'auction-slots/add',
        }

        // @ts-expect-error client incorrect event types
        client.send(message)

        queueMicrotask(() => client.close())
      }),
    )

    const onOpenMockedListener = vi.fn()
    const onMessageMockedListener = vi.fn()
    const onCloseMockedListener = vi.fn()

    auctionSlotsSSEClient.onSSEEvent('onopen', onOpenMockedListener)
    auctionSlotsSSEClient.onSSEEvent('onmessage', onMessageMockedListener)
    auctionSlotsSSEClient.onSSEEvent('onclose', onCloseMockedListener)

    const renderWrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{ children }</Provider>

    const { result } = renderHook(() => useLazyConnectAuctionSlotsSSEQuery(), { wrapper: renderWrapper })

    const [connectToSlotsSSE] = result.current

    await act(async () => {
      const response = await connectToSlotsSSE({ auctionUUID: '1234' })
      expect(response.isSuccess).toBeTruthy()
    })

    expect(onOpenMockedListener).toBeCalledTimes(1)
  })

  it('should receive messages', async () => {
    server.use(
      sse<AuctionSlotsEventsMap>(SLOTS_SSE_URL, ({ client }) => {
        const message: AuctionSlotsEventSourceMessage = {
          id: '1',
          data: JSON.stringify(createFakeAuctionSlotsArray()),
          event: 'auction-slots/add',
        }

        // @ts-expect-error client incorrect event types
        client.send(message)

        queueMicrotask(() => client.close())
      }),
    )

    const onMessageMockedListener = vi.fn()

    auctionSlotsSSEClient.onSSEEvent('onmessage', onMessageMockedListener)

    const renderWrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{ children }</Provider>

    const { result } = renderHook(() => useLazyConnectAuctionSlotsSSEQuery(), { wrapper: renderWrapper })

    const [connectToSlotsSSE] = result.current

    await act(async () => {
      const response = await connectToSlotsSSE({ auctionUUID: '1234' })
      expect(response.isSuccess).toBeTruthy()
    })

    expect(onMessageMockedListener).toBeCalledTimes(1)
  })

  it('should react on sse connection closing', async () => {
    server.use(
      sse<AuctionSlotsEventsMap>(SLOTS_SSE_URL, ({ client }) => {
        // Immediately close connection
        queueMicrotask(() => client.close())
      }),
    )

    const onOpenMockedListener = vi.fn()
    const onCloseMockedListener = vi.fn()

    auctionSlotsSSEClient.onSSEEvent('onopen', onOpenMockedListener)
    auctionSlotsSSEClient.onSSEEvent('onclose', onCloseMockedListener)

    const renderWrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{ children }</Provider>

    const { result } = renderHook(() => useLazyConnectAuctionSlotsSSEQuery(), { wrapper: renderWrapper })

    const [connectToSlotsSSE] = result.current

    await act(async () => {
      const response = await connectToSlotsSSE({ auctionUUID: '1234' })
      expect(response.isSuccess).toBeTruthy()
    })

    expect(onOpenMockedListener).toBeCalledTimes(1)
    expect(onCloseMockedListener).toBeCalledTimes(1)
  })

  it('should validate incoming messages', async () => {
    server.use(
      sse<AuctionSlotsEventsMap>(SLOTS_SSE_URL, async ({ client }) => {
        const validMessage: AuctionSlotsEventSourceMessage = {
          id: '1',
          data: JSON.stringify(createFakeAuctionSlotsArray()),
          event: 'auction-slots/add',
          retry: undefined,
        }

        // @ts-expect-error client incorrect event types
        client.send(validMessage)

        await wait(500)

        const invalidMessage: AuctionSlotsEventSourceMessage = {
          id: '2',
          data: JSON.stringify('invalid data'),
          event: 'auction-slots/add',
        }

        // @ts-expect-error client incorrect event types
        client.send(invalidMessage)

        queueMicrotask(() => client.close())
      }),
    )

    const onMessageMockedListener = vi.fn()
    const onErrorMockedListener = vi.fn()

    auctionSlotsSSEClient.onSSEEvent('onmessage', onMessageMockedListener)
    auctionSlotsSSEClient.onSSEEvent('onerror', onErrorMockedListener)

    const onSlotsAddingMockedListener = vi.fn()

    auctionSlotsSSEClient.onEvent('auction-slots/add', onSlotsAddingMockedListener)

    const renderWrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{ children }</Provider>

    const { result } = renderHook(() => useLazyConnectAuctionSlotsSSEQuery(), { wrapper: renderWrapper })

    const [connectToSlotsSSE] = result.current

    await act(async () => {
      await connectToSlotsSSE({ auctionUUID: '1234' })
    })

    expect(onMessageMockedListener).toBeCalledTimes(2)

    // Receive one valid message
    expect(onSlotsAddingMockedListener).toBeCalledTimes(1)

    // Receive one invalid message
    await waitFor(async () => expect(onErrorMockedListener).toBeCalledTimes(1))
  })

  it('should validate incoming data from messages from differents events', async () => {
    server.use(
      sse<AuctionSlotsEventsMap>(SLOTS_SSE_URL, async ({ client }) => {
        const addingEventMessage: AuctionSlotsEventSourceMessage = {
          id: '1',
          data: JSON.stringify(createFakeAuctionSlotsArray()),
          event: 'auction-slots/add',
          retry: undefined,
        }

        // @ts-expect-error client incorrect event types
        client.send(addingEventMessage)

        await wait(500)

        const updateSlotEventMessage: AuctionSlotsEventSourceMessage = {
          id: '2',
          data: JSON.stringify(createSingleFakeAuctionSlot()),
          event: 'auction-slots/update',
        }

        // @ts-expect-error client incorrect event types
        client.send(updateSlotEventMessage)

        queueMicrotask(() => client.close())
      }),
    )

    const onAddingEventMessageMockedListener = vi.fn()
    const onUpdateSlotEventMessageMockedListener = vi.fn()

    auctionSlotsSSEClient.onEvent('auction-slots/add', onAddingEventMessageMockedListener)
    auctionSlotsSSEClient.onEvent('auction-slots/update', onUpdateSlotEventMessageMockedListener)

    const renderWrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{ children }</Provider>

    const { result } = renderHook(() => useLazyConnectAuctionSlotsSSEQuery(), { wrapper: renderWrapper })

    const [connectToSlotsSSE] = result.current

    await act(async () => {
      await connectToSlotsSSE({ auctionUUID: '1234' })
    })

    expect(onAddingEventMessageMockedListener).toBeCalledTimes(1)
    await waitFor(async () => expect(onUpdateSlotEventMessageMockedListener).toBeCalledTimes(1))
  })
})
