import process from 'node:process'
import { revalidatePath } from 'next/cache'

import { z } from 'zod'

const RevalidateRequestBodySchema = z.object({
	secret: z.literal(process.env.REVALIDATE_SECRET_KEY),
})

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ auctionUUID: string }> },
) {
	const validatedBody = await RevalidateRequestBodySchema.safeParseAsync(
		await request.json(),
	)

	if (!validatedBody.success) {
		return new Response('Invalid request body', { status: 401 })
	}

	const { auctionUUID } = await params

	const validatedUUID = await z.string().uuid().safeParseAsync(auctionUUID)

	if (!validatedUUID.success) {
		return new Response('Invalid auction id', { status: 400 })
	}

	revalidatePath(`/${validatedUUID.data}`)

	return new Response(null, { status: 200 })
}
