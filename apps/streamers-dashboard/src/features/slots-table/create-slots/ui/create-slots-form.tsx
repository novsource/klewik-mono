import { useCallback, useMemo } from 'react'
import {
  Controller,
  FieldErrors,
  useFieldArray,
  useForm,
} from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { z } from 'zod'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import { NumberInput } from '~shared/ui/number-input'
import { deleteAllSpacesFromString } from '~shared/utils/string-format'

const createSlotSchema = z.object({
  slots: z
    .object({
      name: z.string().min(3),
      points: z.string().min(3),
    })
    .array()
    .min(1),
})

type CreateSlotForm = z.infer<typeof createSlotSchema>

type FormArrayData = Record<'slots', CreateSlotForm[]>

export const CreateSlotsForm = () => {
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
          points: deleteAllSpacesFromString(item.points),
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

  const onSubmit = async (formData: FormArrayData) => {}

  const getErrorMessageForField = useCallback(
    (
      fieldName: keyof CreateSlotForm['slots'][number],
      fieldIndex: number
    ): string | undefined => {
      if (!('slots' in errors)) return undefined

      if (errors.slots === undefined) return undefined

      if (Array.isArray(errors['slots'])) {
        if (errors['slots'][fieldIndex][fieldName]) {
          return errors['slots'][fieldIndex][fieldName].message
        }
      }
    },
    [errors]
  )

  const formFields = useMemo(() => {
    return fields.map((field, index) => (
      <motion.li
        key={field.id}
        className="flex w-full gap-x-2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <Controller
          render={({ field }) => (
            <Input
              classNames={{
                base: 'font-golosF',
                input: 'px-1',
                description: 'text-nowrap',
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
              classNames={{
                base: 'font-golosF',
                input: 'px-1',
                description: 'text-wrap',
              }}
              placeholder="Очки"
              // errorMessage={getErrorMessageForField('points', index)}
              {...field}
            />
          )}
          control={control}
          name={`slots.${index}.points` as const}
        />
        <Button
          className="transition-colors bg-red/10 text-red/60 hover:text-red hover:bg-red/20"
          isIconOnly
          startContent={<Icons.Bin size="default" />}
          onClick={() => remove(index)}
        />
      </motion.li>
    ))
  }, [fields, getErrorMessageForField])

  return (
    <form
      className="flex flex-col w-full h-full justify-between"
      onSubmit={handleSubmit((data) => console.log(data))}
    >
      <div className="flex w-full flex-col gap-y-6 items-stretch">
        <ul className="flex flex-col w-full gap-y-3">
          <div className="flex w-full flex-col gap-y-3 h-full overflow-y-scroll p-1">
            {formFields}
            <Button
              className="w-fit"
              type="button"
              startContent={<Icons.Plus size="sm" />}
              size={'sm'}
              onClick={() => {
                append({ name: '', points: '' })
                trigger('slots')
              }}
            >
              Создать слот
            </Button>
          </div>
        </ul>
      </div>

      <Button type="submit" variant={'action'} className="w-full">
        Добавить в аукцион
      </Button>
    </form>
  )
}
