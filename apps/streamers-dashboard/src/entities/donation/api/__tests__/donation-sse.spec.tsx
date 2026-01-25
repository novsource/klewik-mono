import type { ReactNode } from 'react'

import { Provider } from 'react-redux'

import { act, renderHook, waitFor } from '@testing-library/react'
import { sse } from 'msw'
import { setupServer } from 'msw/node'

import { store as appStore, createStore } from '~app/store/store'

import { createSingleFakeDonation } from '~entities/donation/model/__tests__/donations.mocks'

import { donationsSSEClient } from '~shared/api/sse/clients/donations'
import type { DonationsEventSourceMessage, DonationsSSEEventsMap } from '~shared/api/sse/clients/donations'

import { useLazyConnectDonationsSSEQuery } from '~shared/store/api'

import { wait } from '~shared/utils'

const DONATIONS_SSE_URL = '/api/v1/auctions/:uuid/sse/donations-events'

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
      sse<DonationsSSEEventsMap>(DONATIONS_SSE_URL, ({ client }) => {
        const message: DonationsEventSourceMessage = {
          id: '1',
          data: JSON.stringify(createSingleFakeDonation()),
          event: 'donations/add',
        }

        // @ts-expect-error client incorrect event types
        client.send(message)

        queueMicrotask(() => client.close())
      }),
    )

    const onOpenMockedListener = vi.fn()
    const onMessageMockedListener = vi.fn()
    const onCloseMockedListener = vi.fn()

    donationsSSEClient.onSSEEvent('onopen', onOpenMockedListener)
    donationsSSEClient.onSSEEvent('onmessage', onMessageMockedListener)
    donationsSSEClient.onSSEEvent('onclose', onCloseMockedListener)

    const renderWrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{ children }</Provider>

    const { result } = renderHook(() => useLazyConnectDonationsSSEQuery(), { wrapper: renderWrapper })

    const [connectToDonationsSSE] = result.current

    await act(async () => {
      const response = await connectToDonationsSSE({ auctionUUID: '1234' })
      expect(response.isSuccess).toBeTruthy()
    })

    expect(onOpenMockedListener).toBeCalledTimes(1)
  })

  it('should receive messages', async () => {
    server.use(
      sse<DonationsSSEEventsMap>(DONATIONS_SSE_URL, ({ client }) => {
        const message: DonationsEventSourceMessage = {
          id: '1',
          data: JSON.stringify(createSingleFakeDonation()),
          event: 'donations/add',
        }

        // @ts-expect-error client incorrect event types
        client.send(message)

        queueMicrotask(() => client.close())
      }),
    )

    const onMessageMockedListener = vi.fn()

    donationsSSEClient.onSSEEvent('onmessage', onMessageMockedListener)

    const renderWrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{ children }</Provider>

    const { result } = renderHook(() => useLazyConnectDonationsSSEQuery(), { wrapper: renderWrapper })

    const [connectToDonationsSSE] = result.current

    await act(async () => {
      const response = await connectToDonationsSSE({ auctionUUID: '1234' })
      expect(response.isSuccess).toBeTruthy()
    })

    expect(onMessageMockedListener).toBeCalledTimes(1)
  })

  it('should react on sse connection closing', async () => {
    server.use(
      sse<DonationsSSEEventsMap>(DONATIONS_SSE_URL, ({ client }) => {
        // Immediately close connection
        queueMicrotask(() => client.close())
      }),
    )

    const onOpenMockedListener = vi.fn()
    const onCloseMockedListener = vi.fn()

    donationsSSEClient.onSSEEvent('onopen', onOpenMockedListener)
    donationsSSEClient.onSSEEvent('onclose', onCloseMockedListener)

    const renderWrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{ children }</Provider>

    const { result } = renderHook(() => useLazyConnectDonationsSSEQuery(), { wrapper: renderWrapper })

    const [connectToDonationsSSE] = result.current

    await act(async () => {
      const response = await connectToDonationsSSE({ auctionUUID: '1234' })
      expect(response.isSuccess).toBeTruthy()
    })

    expect(onOpenMockedListener).toBeCalledTimes(1)
    expect(onCloseMockedListener).toBeCalledTimes(1)
  })

  it('should validate incoming messages', async () => {
    server.use(
      sse<DonationsSSEEventsMap>(DONATIONS_SSE_URL, async ({ client }) => {
        const validMessage: DonationsEventSourceMessage = {
          id: '1',
          data: JSON.stringify(createSingleFakeDonation()),
          event: 'donations/add',
          retry: undefined,
        }

        // @ts-expect-error client incorrect event types
        client.send(validMessage)

        await wait(500)

        const invalidMessage: DonationsEventSourceMessage = {
          id: '2',
          data: JSON.stringify('invalid data'),
          event: 'donations/add',
        }

        // @ts-expect-error client incorrect event types
        client.send(invalidMessage)

        queueMicrotask(() => client.close())
      }),
    )

    const onMessageMockedListener = vi.fn()
    const onErrorMockedListener = vi.fn()

    donationsSSEClient.onSSEEvent('onmessage', onMessageMockedListener)
    donationsSSEClient.onSSEEvent('onerror', onErrorMockedListener)

    const onDonationsAddingMockedListener = vi.fn()

    donationsSSEClient.onEvent('donations/add', onDonationsAddingMockedListener)

    const renderWrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{ children }</Provider>

    const { result } = renderHook(() => useLazyConnectDonationsSSEQuery(), { wrapper: renderWrapper })

    const [connectToDonationsSSE] = result.current

    await act(async () => {
      await connectToDonationsSSE({ auctionUUID: '1234' })
    })

    expect(onMessageMockedListener).toBeCalledTimes(2)

    // Receive one valid message
    expect(onDonationsAddingMockedListener).toBeCalledTimes(1)

    // Receive one invalid message
    await waitFor(async () => expect(onErrorMockedListener).toBeCalledTimes(1))
  })

  it('should validate incoming data from messages from differents events', async () => {
    server.use(
      sse<DonationsSSEEventsMap>(DONATIONS_SSE_URL, async ({ client }) => {
        const addingEventMessage: DonationsEventSourceMessage = {
          id: '1',
          data: JSON.stringify(createSingleFakeDonation()),
          event: 'donations/add',
          retry: undefined,
        }

        // @ts-expect-error client incorrect event types
        client.send(addingEventMessage)

        queueMicrotask(() => client.close())
      }),
    )

    const onAddingEventMessageMockedListener = vi.fn()

    donationsSSEClient.onEvent('donations/add', onAddingEventMessageMockedListener)

    const renderWrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{ children }</Provider>

    const { result } = renderHook(() => useLazyConnectDonationsSSEQuery(), { wrapper: renderWrapper })

    const [connectToDonationsSSE] = result.current

    await act(async () => {
      await connectToDonationsSSE({ auctionUUID: '1234' })
    })

    expect(onAddingEventMessageMockedListener).toBeCalledTimes(1)
  })
})
