import { HTMLAttributes } from 'react'
import {
  Control,
  DefaultValues,
  UseFormReturn,
  useController,
  useFormState,
} from 'react-hook-form'

import { SlotPointsFormInput } from '~features/auction-slot/create-slots/ui/form-fields.ui'

import { auctionSelectors } from '~entities/auction/store'

import {
  AxiosBaseQueryError,
  useStoreSelector,
} from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Input } from '~shared/ui/input'
import {
  toastErrorNotification,
  toastSuccessNotification,
} from '~shared/ui/toaster/lib'

import { useEditSlotMutation } from '../api'
import { TransformedEditSlotFormData } from '../lib'
import type { EditSlotFormData } from '../model'

type EditSlotsFormStateProps = {
  defaultValues?: DefaultValues<EditSlotFormData>
}

type EditSlotsFormProps = Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
  slotId: number
  formMethods: UseFormReturn<
    EditSlotFormData,
    unknown,
    TransformedEditSlotFormData
  >
  onSuccess?: (formData: TransformedEditSlotFormData) => void
  onError?: () => void
} & EditSlotsFormStateProps

export const EditSlotForm = ({
  slotId,
  formMethods,
  onError,
  onSuccess,
  defaultValues,
  ...props
}: EditSlotsFormProps) => {
  const formState = useFormState({ control: formMethods.control })

  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)

  const [editSlotMutation, { isLoading }] = useEditSlotMutation()

  const submitForm = async (formData: TransformedEditSlotFormData) => {
    const response = await editSlotMutation({
      auctionUUID,
      slot: { id: slotId, ...formData },
    })

    if (response.error) {
      const error = response.error as AxiosBaseQueryError

      toastErrorNotification(
        'Не удалось изменить слот',
        error.reason || error.message,
        { position: 'bottom-left' }
      )

      return onError && onError()
    }

    toastSuccessNotification('Слот успешно изменен!')
    onSuccess && onSuccess(formData)
  }

  const isFieldsChanges = formState.isDirty

  return (
    <form
      className="flex h-full w-full flex-col justify-between"
      onSubmit={formMethods.handleSubmit(submitForm)}
      {...props}
    >
      <Flex className="w-full gap-y-6" direction="column" align="stretch">
        <Flex className="w-full" component={'ul'} direction={'column'}>
          <Flex
            className="h-full w-full gap-y-3 overflow-y-scroll p-1"
            direction="column"
          >
            <EditSlotFormFields control={formMethods.control} />
          </Flex>
        </Flex>
      </Flex>
      <Button
        type="submit"
        variant={'action'}
        className="w-full"
        disabled={isLoading || !isFieldsChanges}
      >
        Изменить слот
      </Button>
    </form>
  )
}

type EditSlotFormFieldsProps = {
  control: Control<EditSlotFormData, unknown, TransformedEditSlotFormData>
}

const EditSlotFormFields = ({ control }: EditSlotFormFieldsProps) => {
  const formState = useFormState({ control })

  const { field: slotNameField } = useController({ control, name: 'name' })

  const getErrorMessageForField = (
    fieldName: keyof EditSlotFormData
  ): string | undefined => {
    if (formState.errors[fieldName]) {
      return formState.errors[fieldName].message
    }
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Input
        slotClassNames={{
          base: 'font-golos-f w-full basis-1/2 grow',
          description: 'text-wrap',
        }}
        label={{ id: 'slotTitle', value: 'Новое название' }}
        placeholder="Название слота"
        errorMessage={getErrorMessageForField('name')}
        {...slotNameField}
      />
      {/* <Controller
        render={({ field }) => (
          <NumberInput
            slotClassNames={{
              base: 'font-golos-f basis-1/3 desktop-lg:basis-1/4',
              description: 'text-wrap',
            }}
            label={{
              id: 'slotPoints',
              value: 'Новое количество очков',
            }}
            placeholder="Очки"
            errorMessage={getErrorMessageForField('points')}
            {...field}
          />
        )}
        control={control}
        name={'points'}
      /> */}
      <SlotPointsFormInput control={control} name={'points'} />
    </div>
  )
}
