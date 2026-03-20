import type { z } from 'zod'

import type { loginAdminSchema } from './login-admin.contracts'

export type LoginAdmin = z.infer<typeof loginAdminSchema>
