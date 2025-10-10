import { useEffect, useRef } from 'react'

import type { DonationsEventSourceMessage, DonationsSSEChannelEventsMap } from '~shared/api/sse/clients/donations'
import { DonationsEventSourceMessageSchema, ProcessedDonationDTOSchema } from '~shared/api/sse/clients/donations'

import type { BaseEmitter } from '~shared/lib/emitter'
import type { SSEEvents } from '~shared/lib/fetch-event-source'

type UseDonationsSSEOptions = DonationsSSEChannelEventsMap

export const useDonationsSSE = (sseEmitter: BaseEmitter<SSEEvents>, options?: UseDonationsSSEOptions) => {
  const sseEmitterRef = useRef(sseEmitter)

  const processDonationMessage = (message: DonationsEventSourceMessage) => {
    switch (message.event) {
      case 'donations/add': {
        const eventHandler = options?.['donations/add']

        if (!eventHandler)
          return

        const jsonMessageData = JSON.parse(message.data)
        const validatedData = ProcessedDonationDTOSchema.safeParse(jsonMessageData)

        if (validatedData.error)
          return sseEmitter.emit('onerror', new Error('Invalid message data'))

        eventHandler(validatedData.data)
        break
      }
    }
  }

  useEffect(() => {
    const removeHandler = sseEmitterRef.current.on('onmessage', (message) => {
      if (Array.isArray(message)) {
        message.forEach((msg) => {
          const validatedMessage = DonationsEventSourceMessageSchema.safeParse(msg)

          if (!validatedMessage.success) {
            return sseEmitter.emit('onerror', new Error('Can\'t validate message'))
          }

          processDonationMessage(validatedMessage.data)
        })
      }
    })

    return () => {
      removeHandler()
    }
  })
}
