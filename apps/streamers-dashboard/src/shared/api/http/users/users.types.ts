import type z from 'zod'

import type { UserDTOSchema } from './users.contracts'

export type UserDTO = z.infer<typeof UserDTOSchema>
