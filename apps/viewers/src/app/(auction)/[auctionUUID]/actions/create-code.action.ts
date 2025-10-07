'use server'

import process from 'node:process'

type CreateCodeActionPayload = {
	auctionUUID: string
	formState: unknown
	formData: FormData
}

export const createCodeAction = async (payload: CreateCodeActionPayload) => {
	const { auctionUUID, formData } = payload

	const slotTitle = formData.get('title')

	if (!slotTitle || slotTitle.toString().length < 3)
		return { errorTitleLength: 'Слишком короткое название слота. Минимальный размер - 3 символа' }

	const rawFormData = {
		title: slotTitle.toString(),
	}

	const headers = new Headers()

	headers.set('Content-Type', 'application/json')
	const createCodeResponse = await fetch(`${process.env.SERVER_API_URL}/auctions/${auctionUUID}/donations/code`, {
		headers,
		method: 'POST',
		body: JSON.stringify({ ...rawFormData, secret: process.env.REVALIDATE_SECRET_KEY }),
	})

	const donationCode = await createCodeResponse.json()

	return { errorTitleLength: '', code: donationCode.code }
}
