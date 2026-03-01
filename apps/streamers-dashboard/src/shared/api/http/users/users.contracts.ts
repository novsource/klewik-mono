import z from 'zod'

export const UserDTOSchema = z.object({
  id: z.number(),
  userUUID: z.uuid(),
  twitchDisplayName: z.string(),
  isBanned: z.boolean(),
  banReason: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})
