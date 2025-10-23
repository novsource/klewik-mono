'use server'

import type { CreateCodeFormState } from '../components/create-code-dialog'
import process from 'node:process'

type CreateCodeActionPayload = {
	auctionUUID: string
	formState: unknown
	formData: FormData
}

export async function createDonationCodeAction(payload: CreateCodeActionPayload): Promise<CreateCodeFormState> {
	const { auctionUUID, formData } = payload

	const slotTitle = formData.get('title')

	if (!slotTitle || slotTitle.toString().length < 3)
		return { errorTitleLength: 'Слишком короткое название слота. Минимальный размер - 3 символа' }

	const rawFormData = {
		title: slotTitle.toString(),
	}

	try {
		const headers = new Headers()
		headers.set('Content-Type', 'application/json')

		const createCodeResponse = await fetch(
			`${process.env.SERVER_API_URL}/auctions/${auctionUUID}/donations/code`,
			{
				headers,
				method: 'POST',
				body: JSON.stringify({
					...rawFormData,
					secret: process.env.REVALIDATE_SECRET_KEY,
				}),
			},
		)

		if (!createCodeResponse.ok) {
			throw new Error(`HTTP error! status: ${createCodeResponse.status}`)
		}

		const donationCode = await createCodeResponse.json() as DonationCode

		return {
			errorTitleLength: '',
			code: donationCode.code,
		}
	}
	catch (error) {
		if (error instanceof Error) {
			return {
				errorTitleLength: `Произошла ошибка при создании кода: ${error.message}`,
			}
		}
		else {
			return {
				errorTitleLength: `Произошла неизвестная ошибка при создании кода`,
			}
		}
	}
}
