import z from 'zod'

export type HttpError = {
  status: number
  reason?: string
  hint?: string
  message: string
}

const HttpErrorSchema = z.object({
  status: z.number().positive(),
  message: z.string(),
  reason: z.string().optional(),
  hint: z.string().optional(),
})

export const isHttpError = (value: unknown): value is HttpError => {
  const validationResult = HttpErrorSchema.safeParse(value)

  return validationResult.success
}
