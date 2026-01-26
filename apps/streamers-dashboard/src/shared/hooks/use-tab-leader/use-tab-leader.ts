import { useState } from 'react'

import { BroadcastLeaderChannel } from '~shared/lib/broadcast-channel'

export type UseTabLeaderOptions = {
  onAnyTabBecomesLeader?: () => void
  onCurrentTabBecomesLeader?: () => void
}

const tabsBroadcastChannel = new BroadcastLeaderChannel('appTabsCommunication')

export const useTabLeader = (options?: UseTabLeaderOptions) => {
  const [isTabLeader, setIsTabLeader] = useState(() => {
    tabsBroadcastChannel.onChannelLeadership(() => {
      options?.onCurrentTabBecomesLeader?.()

      setIsTabLeader(true)
    })
    tabsBroadcastChannel.onNewLeader(() => {
      options?.onAnyTabBecomesLeader?.()
    })

    return tabsBroadcastChannel.isLeader
  })

  return { channel: tabsBroadcastChannel, isTabLeader }
}
