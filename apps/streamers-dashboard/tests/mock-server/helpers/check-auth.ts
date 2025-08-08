import { HttpResponse } from 'msw'
import { z } from 'zod'

type RequestCookies = Partial<Record<'accessToken' | 'refreshToken' | 'deviceId', string>>

const CookiesSchema = z.object({
  accessToken: z.string().uuid(),
  refreshToken: z.string().uuid(),
  deviceId: z.string().uuid(),
})

export const checkJWT = (cookies: RequestCookies) => {
  const validatedCookiesResult = CookiesSchema.safeParse(cookies)

  if (!validatedCookiesResult.success) {
    return new HttpResponse(null, { status: 401 })
  }

  return null
}
