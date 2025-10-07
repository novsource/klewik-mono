'use client'

import type { ComponentProps } from 'react'
import type { AutocompleteTag } from '~ui/autocomplete'
import { useActionState, useMemo, useState } from 'react'
import { useDidUpdate, useMediaQuery } from '~hooks/index'
import {
	Autocomplete,
	AutocompleteContent,
	AutocompleteInput,
	AutocompleteItem,
} from '~ui/autocomplete'
import { Button } from '~ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '~ui/dialog'
import { Flex } from '~ui/flex'
import { Icons } from '~ui/icons'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '~ui/sheet'
import { Typography } from '~ui/typography'
import { greaterThenDeviceWidthMediaQueries } from '~/constants'
import { createCodeAction } from '../../actions'
import { useCreateCodeContext } from '../../context'

export type CreateCodeDialogProps = {
	auctionUUID: string
	slots: AuctionSlot[]
}

const convertSlotsToTags = (slots: AuctionSlot[]) => {
	return slots.map<AutocompleteTag>(slot => ({ id: slot.id.toString(), value: slot.title }))
}

export const CreateCodeDialog = (props: CreateCodeDialogProps) => {
	const { slots, auctionUUID } = props

	const { selectedSlot, setSelectedSlot } = useCreateCodeContext()

	const [isDialogOpen, setIsDialogOpen] = useState(!!selectedSlot)

	const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

	useDidUpdate(() => {
		const isShouldOpenDialog = !!selectedSlot

		if (isShouldOpenDialog && !isDialogOpen)
			setIsDialogOpen(true)

		if (!isShouldOpenDialog && !selectedSlot) {
			setIsDialogOpen(false)
		}
	}, [selectedSlot])

	const handleOnOpenChange = (open: boolean) => {
		const isClosedManually = !open
		const isOpenManually = !selectedSlot && open

		if (isClosedManually) {
			setIsDialogOpen(false)
			setSelectedSlot(null)
		}

		if (isOpenManually) {
			setIsDialogOpen(true)
		}
	}

	const closeDialog = () => setIsDialogOpen(false)

	if (isLargeThenTablet) {
		return (
			<Dialog open={isDialogOpen} onOpenChange={handleOnOpenChange}>
				<DialogTrigger
					render={(
						<Button
							variant="action"
							startContent={<Icons.Plus />}
						>
							Создать код
						</Button>
					)}
				/>
				<DialogContent className="w-2/5 desktop:max-w-[450px] h-fit border-dark-light rounded-[24px] bg-dark-foreground-light px-4 py-0 overflow-clip">
					<DialogHeader className="w-full h-fit flex flex-row justify-between shrink py-4 items-start">
						<Flex className="justify-start" direction="column">
							<DialogTitle className="text-title-lg font-semibold text-start">
								Создание донат-кода
							</DialogTitle>
							<DialogDescription className="text-md text-gray-light">
								Заполните поле снизу для создание донат-кода
							</DialogDescription>
						</Flex>
						<DialogClose className="text-gray-light hover:text-gray-accent cursor-pointer">
							<Icons.LargeCross size="lg" />
						</DialogClose>
					</DialogHeader>
					<Flex className="h-full grow">
						<CreateCodeForm
							className="w-full"
							auctionUUID={auctionUUID}
							slots={slots}
							selectedSlot={selectedSlot}
						/>
					</Flex>
					<DialogFooter className="flex-row h-fit py-4 gap-x-4 justify-end">
						<Button
							onClick={closeDialog}
						>
							Отмена
						</Button>
						<Button
							type="submit"
							form="createCodeForm"
							variant="action"
						>
							Создать донат-код
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Sheet open={isDialogOpen} onOpenChange={handleOnOpenChange}>
			<SheetTrigger
				render={(
					<Button
						variant="action"
						startContent={<Icons.Plus />}
						size="sm"
					>
						Создать код
					</Button>
				)}
			/>
			<SheetContent className="w-full h-fit top-auto rounded-t-large border-t-1 border-t-dark-light gap-y-1.5" side="bottom" isFullPageSize>
				<SheetHeader className="w-full h-fit flex flex-row justify-between shrink pt-2 items-start mb-2.5">
					<Flex className="justify-start" direction="column">
						<SheetTitle className="text-title font-semibold text-start">
							Создание донат-кода
						</SheetTitle>
						<SheetDescription className="text-sm text-gray-light">
							Заполните поле снизу для создание донат-кода
						</SheetDescription>
					</Flex>
					<SheetClose className="text-gray-light hover:text-gray-accent">
						<Icons.LargeCross />
					</SheetClose>
				</SheetHeader>
				<CreateCodeForm
					className="w-full mb-6"
					auctionUUID={auctionUUID}
					slots={slots}
					selectedSlot={selectedSlot}
				/>

				<Flex className="gap-y-2" direction="column">
					<Button
						type="submit"
						form="createCodeForm"
						className="w-full"
						variant="action"
						size="sm"
					>
						Создать донат-код
					</Button>
					<Button
						className="w-full"
						size="sm"
						onClick={closeDialog}
					>
						Отмена
					</Button>
				</Flex>
			</SheetContent>
		</Sheet>
	)
}

type CreateCodeFormProps = ComponentProps<'form'> & {
	auctionUUID: string
	slots: AuctionSlot[]
	selectedSlot?: AuctionSlot | null
}

type CreateCodeFormState = {
	errorTitleLength: string
}

function CreateCodeForm(props: CreateCodeFormProps) {
	const { auctionUUID, selectedSlot, slots, ...restProps } = props

	const [inputValue, setInputValue] = useState(selectedSlot?.title ?? '')
	const [titleLength, setTitleLength] = useState(selectedSlot?.title.length ?? 0)

	const [state, formAction, isPending] = useActionState<CreateCodeFormState, FormData>(
		(state, formData) => createCodeAction({ auctionUUID, formData, formState: state }),
		{
			errorTitleLength: '',
		},
	)

	const autocompleteTags = useMemo(() => convertSlotsToTags(slots), [slots])

	const handleAutocompleteValueChanges = (value: string) => {
		const isValueLargeThenLimit = value.length > 30

		if (isValueLargeThenLimit) {
			setInputValue(value.slice(0, 30))
			setTitleLength(30)
		}
		else {
			setInputValue(value)
			setTitleLength(value.length)
		}
	}

	return (
		<form id="createCodeForm" action={formAction} {...restProps}>
			<Autocomplete
				alwaysSubmitOnEnter
				autoHighlight
				defaultValue={inputValue}
				value={inputValue}
				items={autocompleteTags}
				onValueChange={handleAutocompleteValueChanges}
			>
				<AutocompleteInput
					name="title"
					slotClassNames={{ base: 'w-full' }}
					label={{
						id: 'slotTitle',
						value: 'Название слота',
					}}
					errorMessage={state.errorTitleLength}
					endContent={(
						<Typography className="text-gray-light text-sm tablet:text-md" tag="span">
							{`${titleLength}/30`}
						</Typography>
					)}
				/>
				<AutocompleteContent
					positionerProps={{ sideOffset: 12 }}
					showEmpty={false}
				>
					{tag => <AutocompleteItem key={tag.id} tag={tag} />}
				</AutocompleteContent>
			</Autocomplete>
		</form>
	)
}
