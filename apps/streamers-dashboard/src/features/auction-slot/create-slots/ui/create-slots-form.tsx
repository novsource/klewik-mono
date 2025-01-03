import { HTMLAttributes, useCallback, useMemo } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'

import { AuctionSlotService } from '~entities/auction-slot/api'

import { appSelectors } from '~shared/store/slices'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import { NumberInput } from '~shared/ui/number-input'

import { deleteAllSpacesFromString } from '~shared/utils/string-format'

import { CreateSlotForm, FormArrayData, createSlotSchema } from '../model'

appSelectors

type CreateSlotsFormProps = HTMLAttributes<HTMLFormElement> & {
  multiplySlots?: boolean
}

export const CreateSlotsForm = ({
  multiplySlots,
  ...formProps
}: CreateSlotsFormProps) => {
  const auctionId = useStoreSelector((state) =>
    appSelectors.getAuctionId(state)
  ) as string

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<CreateSlotForm>({
    resolver: zodResolver(
      createSlotSchema.transform((val) => {
        return val['slots'].map((item) => ({
          ...item,
          points: Number(deleteAllSpacesFromString(item.points)),
        }))
      })
    ),
    mode: 'all',
    reValidateMode: 'onChange',
  })

  const { fields, append, remove } = useFieldArray<CreateSlotForm>({
    control,
    name: 'slots',
  })

  const onSubmit = async (formData: FormArrayData) => {
    const response = await AuctionSlotService.getInstance().createSlot(
      auctionId,
      formData
    )
  }

  const getErrorMessageForField = useCallback(
    (
      fieldName: keyof CreateSlotForm['slots'][number],
      fieldIndex: number
    ): string | undefined => {
      if (!('slots' in errors)) return undefined

      if (errors.slots === undefined) return undefined

      if (Array.isArray(errors['slots'])) {
        if (
          errors['slots'][fieldIndex] &&
          errors['slots'][fieldIndex][fieldName]
        ) {
          return errors['slots'][fieldIndex][fieldName].message
        }
      }
    },
    [errors]
  )

  const formFields = useMemo(() => {
    if (fields.length === 0) {
      append({ name: '', points: '10' })
      return
    }

    return (multiplySlots ? fields : fields.slice(0, 1)).map((field, index) => (
      <motion.li
        key={field.id}
        className="flex w-full gap-x-2 relative"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <Controller
          render={({ field }) => (
            <Input
              slotClassNames={{
                base: 'font-golosF w-full basis-1/2 flex-grow',
                description: 'text-wrap',
              }}
              placeholder="Название слота"
              errorMessage={getErrorMessageForField('name', index)}
              {...field}
            />
          )}
          control={control}
          name={`slots.${index}.name` as const}
        />
        <Controller
          render={({ field }) => (
            <NumberInput
              slotClassNames={{
                base: 'font-golosF w-full basis-1/3 desktopLg:basis-1/4',
                description: 'text-wrap',
              }}
              placeholder="Очки"
              maxValue={1000000}
              errorMessage={getErrorMessageForField('points', index)}
              {...field}
            />
          )}
          control={control}
          name={`slots.${index}.points` as const}
        />
        {multiplySlots && fields.length > 1 && (
          <Button
            className="transition-colors bg-red/10 text-red/60 hover:text-red hover:bg-red/20"
            isIconOnly
            startContent={<Icons.Bin size="default" />}
            onClick={() => remove(index)}
          />
        )}
      </motion.li>
    ))
  }, [fields, getErrorMessageForField, multiplySlots])

  return (
    <form
      className="flex flex-col w-full h-full justify-between"
      onSubmit={handleSubmit(onSubmit)}
      {...formProps}
    >
      <div className="flex w-full flex-col gap-y-6 items-stretch">
        <ul className="flex flex-col w-full">
          <div className="flex w-full flex-col gap-y-3 h-full overflow-y-scroll p-1">
            {formFields}
            {multiplySlots && (
              <Button
                className="w-fit"
                type="button"
                startContent={<Icons.Plus size="sm" />}
                size={'sm'}
                onClick={() => {
                  append({ name: '', points: '10' })
                  trigger('slots')
                }}
              >
                Создать слот
              </Button>
            )}
          </div>
        </ul>
      </div>

      <Button type="submit" variant={'action'} className="w-full">
        Добавить в аукцион
      </Button>
    </form>
  )
}
