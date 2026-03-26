import { useCallback, useEffect, useState } from 'react'

import { BroadcastLeaderChannel } from '~shared/lib/broadcast-channel'
import type { EventSourceMessage } from '~shared/lib/fetch-event-source'

let tabChannel: NullablePossible<BroadcastLeaderChannel<EventSourceMessage, any>> = null

export function getTabChannel() {
  if (!tabChannel) {
    tabChannel = new BroadcastLeaderChannel('tab-leader')
  }

  return tabChannel
}

export type UseTabLeaderOptions = {
  onAnyTabBecomesLeader?: () => void
  onCurrentTabBecomesLeader?: () => void
}

export const useTabLeader = (options?: UseTabLeaderOptions) => {
  const channel = getTabChannel()

  const [isTabLeader, setIsTabLeader] = useState(channel.isLeader)

  const attachListenersToChannel = useCallback((incomingChannel: NonNullable<typeof tabChannel>) => {
    const unsubLeadership = incomingChannel.onChannelLeadership(() => {
      options?.onCurrentTabBecomesLeader?.()

      setIsTabLeader(true)
    })

    const unsubNewLeader = incomingChannel.onNewLeader(() => {
      options?.onAnyTabBecomesLeader?.()
    })

    return [unsubLeadership, unsubNewLeader]
  }, [setIsTabLeader, options])

  const recreateChannel = async () => {
    await channel.close()

    tabChannel = new BroadcastLeaderChannel('tab-leader')
    attachListenersToChannel(tabChannel)
  }

  useEffect(() => {
    attachListenersToChannel(channel)
  }, [channel, attachListenersToChannel])

  useEffect(() => {
    const handleUnload = () => {
      if (!channel.isClosed)
        channel.close()
    }

    window.addEventListener('beforeunload', handleUnload)

    return () => {
      handleUnload()
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [channel])

  return { channel, isTabLeader, recreateChannel }
}
