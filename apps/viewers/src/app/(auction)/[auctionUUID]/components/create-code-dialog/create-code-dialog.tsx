'use client'

import type { ComponentProps } from 'react'
import type { AutocompleteTag } from 'klewik-ui/autocomplete'
import type { ButtonProps } from 'klewik-ui/button'
import { Autocomplete, AutocompleteContent, AutocompleteInput, AutocompleteItem } from 'klewik-ui/autocomplete'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'klewik-ui/dialog'

import { useActionState, useMemo, useState } from 'react'

import { useCopy, useDidUpdate, useMediaQuery } from '~hooks/index'
import { Button } from 'klewik-ui/button'
import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from 'klewik-ui/sheet'
import { Text, Title, Typography } from 'klewik-ui/typography'
import { cn } from '~utils/cn'
import { greaterThenDeviceWidthMediaQueries } from '~/constants'
import { createDonationCodeAction } from '../../actions'
import { useCreateCodeContext } from '../../context'
import { AuctionSlot } from '~/models/auction-slot'

import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from 'klewik-ui/drawer'

export type CreateCodeDialogProps = {
  auctionUUID: string
  slots: AuctionSlot[]
  disabled?: boolean
}

const convertSlotsToTags = (slots: AuctionSlot[]) => {
  return slots.map<AutocompleteTag>(slot => ({ id: slot.id.toString(), value: slot.title }))
}

export const CreateCodeDialog = (props: CreateCodeDialogProps) => {
  const { slots, disabled, auctionUUID } = props

  const {
    state: { isDialogOpen, isPending, code, selectedSlot },
    dispatch: { setSelectedSlot, setIsDialogOpen, setCode },
  } = useCreateCodeContext()

  const { copied, copy } = useCopy()

  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  const dialogContent = useMemo(() => {
    return (
      <CreateCodeForm
        className="w-full"
        auctionUUID={auctionUUID}
        slots={slots}
        selectedSlot={selectedSlot}
      />
    )
  }, [auctionUUID, selectedSlot, slots])

  const isCodeCreated = code.length !== 0

  const dialogFooter = useMemo(() => {
    return (
      <Flex
        className={cn('pt-5 pb-2 gap-x-2.5 max-tablet:flex-col-reverse max-tablet:gap-y-2.5')}
        direction={isLargeThenTablet ? 'row' : 'column'}
      >
        {isCodeCreated
          ? (
            <Button
              startContent={<Icons.Copy />}
              variant="action"
              onClick={() => copy(`[#${code}]`)}
            >
              {copied ? 'Код успешно скопирован!' : 'Скопировать код для вставки'}
            </Button>
          )
          : (
            <Button
              type="submit"
              form="createCodeForm"
              variant="action"
            >
              Создать
            </Button>
          )}

      </Flex>
    )
  }, [isLargeThenTablet, code, isCodeCreated, copied])

  const handleOnOpenChange = (open: boolean) => {
    const isClosedManually = !open
    const isOpenManually = !selectedSlot && open

    if (isClosedManually) {
      setIsDialogOpen(false)
      setSelectedSlot(null)
      setCode('')
    }

    if (isOpenManually) {
      setIsDialogOpen(true)
    }
  }

  const isDialogDismissible = !isPending || isCodeCreated

  if (isLargeThenTablet) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleOnOpenChange} disablePointerDismissal={!isDialogDismissible}>
        <DialogTrigger disabled={disabled} render={(<CreateCodeDialogTrigger disabled={disabled} onClick={() => setIsDialogOpen(true)} />)} />
        <DialogContent className="w-2/5 desktop:max-w-[450px] h-fit min-h-60 border-dark-light rounded-[24px] bg-dark-foreground-light px-4 py-0 overflow-clip transition-[height]">
          {isPending && (
            <Flex className="absolute w-full h-full text-dark z-10 bg-inherit" align="center" justify="center">
              <Icons.Loading width={34} height={34} />
            </Flex>
          )}

          <DialogHeader className="w-full h-fit flex flex-row justify-between shrink py-4 items-start">
            <Flex className="justify-start" direction="column">
              <DialogTitle className="text-title-lg font-semibold text-start">
                {isCodeCreated ? 'Донат-код успешно создан!' : 'Создание донат-кода'}
              </DialogTitle>
              <DialogDescription className="text-md text-gray-light">
                {isCodeCreated ? 'Не забудьте скопировать код для вставки в сообщение' : 'Заполните поле снизу для создание донат-кода'}
              </DialogDescription>
            </Flex>

            <DialogClose
              className="text-gray-light hover:text-gray-accent cursor-pointer"
              onClick={() => {
                setCode('')
              }}
            >
              <Icons.LargeCross size="lg" />
            </DialogClose>
          </DialogHeader>

          <Flex className="h-full grow">
            {dialogContent}
          </Flex>

          <DialogFooter className="flex-row h-fit py-4 gap-x-4 justify-end">
            {dialogFooter}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={handleOnOpenChange} disablePointerDismissal={!isDialogDismissible} side='bottom'>
      <DrawerTrigger
        disabled={disabled}
        render={(
          <CreateCodeDialogTrigger
            disabled={disabled}
            onClick={() => setIsDialogOpen(true)}
          />
        )}
      />
      <DrawerContent className={'relative pt-2'}>
        {isPending && (
          <Flex className="absolute w-full h-full text-dark  z-10 bg-dark-foreground" align="center" justify="center">
            <Icons.Loading width={28} height={28} />
          </Flex>
        )}

        <div className="w-full h-fit flex flex-row justify-between shrink items-start mb-2.5">
          <Flex className="justify-start gap-y-1.5" direction="column">
            <Text className="text-title font-semibold text-start" asSpan>
              {isCodeCreated ? 'Донат-код успешно создан!' : 'Создание донат-кода'}
            </Text>
            <Text className="text-sm text-gray-light" asSpan>
              {isCodeCreated ? 'Не забудьте скопировать код для вставки в сообщение' : 'Заполните поле снизу для создание донат-кода'}
            </Text>
          </Flex>

          <DrawerClose
            className="text-gray-light hover:text-gray-accent relative h-fit right-0 top-0"
            onClick={() => {
              setCode('')
            }}
          >
            <Icons.LargeCross />
          </DrawerClose>
        </div>


        <div className="mt-4">
          {dialogContent}
        </div>

        <Flex className="gap-y-2" direction="column">
          {dialogFooter}
        </Flex>
      </DrawerContent>
    </Drawer>
  )
}

type CreateCodeFormProps = ComponentProps<'form'> & {
  auctionUUID: string
  slots: AuctionSlot[]
  selectedSlot?: AuctionSlot | null
  onSuccess?: (code: string) => void
  onError?: () => void
}

export type CreateCodeFormState = {
  errorTitleLength: string
  code?: string
}

function CreateCodeForm(props: CreateCodeFormProps) {
  const { auctionUUID, selectedSlot, slots, onSuccess, onError, ...restProps } = props

  const [inputValue, setInputValue] = useState(selectedSlot?.title ?? '')
  const [titleLength, setTitleLength] = useState(selectedSlot?.title.length ?? 0)

  const [state, formAction, isPending] = useActionState<CreateCodeFormState, FormData>(
    (state, formData) => {
      const slotTitle = formData.get('title')

      const isSameSlot = slotTitle === selectedSlot?.title
      const slotId = isSameSlot ? selectedSlot.id : null

      formData.set('slotId', String(slotId))

      return createDonationCodeAction({ auctionUUID, formData, formState: state })
    },
    {
      errorTitleLength: '',
    },
  )

  const {
    state: { isPending: contextIsPending },
    dispatch: { setCode, setIsPending },
  } = useCreateCodeContext()

  useDidUpdate(() => {
    if (contextIsPending !== isPending) {
      setIsPending(isPending)
    }
  }, [isPending])

  useDidUpdate(() => {
    if (state.code) {
      setCode(state.code)
    }
  }, [state.code])

  const autocompleteTags = useMemo(() => convertSlotsToTags(slots), [slots])

  const handleAutocompleteValueChanges = (value: string) => {
    const isValueLargeThenLimit = value.length > 35

    if (isValueLargeThenLimit) {
      setInputValue(value.slice(0, 35))
      setTitleLength(30)
    }
    else {
      setInputValue(value)
      setTitleLength(value.length)
    }
  }

  const isCodeCreated = !!state.code

  return (
    <form id="createCodeForm" action={formAction} {...restProps}>
      {!isCodeCreated && (
        <Autocomplete
          autoHighlight
          defaultValue={inputValue}
          value={inputValue}
          items={autocompleteTags}
          onValueChange={handleAutocompleteValueChanges}
        >
          <AutocompleteInput
            name="title"
            slotClassNames={{ base: 'w-full' }}
            disabled={isPending}
            label={{
              id: 'slotTitle',
              value: 'Название слота',
            }}
            placeholder="Введите название слота"
            errorMessage={state.errorTitleLength}
            endContent={(
              <Typography className="text-gray-light text-sm tablet:text-md" tag="span">
                {`${titleLength}/35`}
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
      )}
      {isCodeCreated
        && (
          <Flex className="h-full w-full" justify="center">
            <Typography className="text-white/80 text-title-xl" tag="span">
              {`#${state.code}`}
            </Typography>
          </Flex>
        )}
    </form>
  )
}

type CreateCodeDialogTriggerProps = ButtonProps

function CreateCodeDialogTrigger(props: CreateCodeDialogTriggerProps) {
  return (
    <Button
      variant="action"
      startContent={<Icons.Plus />}
      {...props}
    >
      Создать код
    </Button>
  )
}
