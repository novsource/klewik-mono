import { z } from 'zod'

const EventSourceMessageSchema = z.object({
  id: z.string().nonempty(),
  event: z.string().nonempty().max(50),
  data: z.string(),
  retry: z.undefined(),
})

export { EventSourceMessageSchema }
