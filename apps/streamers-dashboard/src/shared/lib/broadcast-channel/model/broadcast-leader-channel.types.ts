import { EventSourceMessage } from '~shared/lib/fetch-event-source/models'

export type DefaultChannelEventMap<SourceMessage extends EventSourceMessage> = {
  'new-leader': () => void
  message: (message: SourceMessage) => void
}
