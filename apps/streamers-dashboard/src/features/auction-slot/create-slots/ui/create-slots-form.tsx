import { HTMLAttributes, useCallback, useMemo } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import { NumberInput } from '~shared/ui/number-input'
import { deleteAllSpacesFromString } from '~shared/utils/string-format'

import { CreateSlotForm, FormArrayData, createSlotSchema } from '../model'

type CreateSlotsFormProps = HTMLAttributes<HTMLFormElement> & {
  multiplySlots?: boolean
}

export const CreateSlotsForm = ({
  multiplySlots,
  ...formProps
}: CreateSlotsFormProps) => {
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
    mode: 'onChange',
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
      append({ name: '', points: '' })
      return
    }

    return (multiplySlots ? fields : fields.slice(0, 1)).map((field, index) => (
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
                base: 'font-golosF w-full',
                description: 'text-wrap',
              }}
              placeholder="Название слота"
              onAnimationStart={() => {
                console.log('animation')
              }}
              onAnimationEnd={() => console.log(this)}
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
                base: 'font-golosF w-full',
                description: 'text-wrap',
              }}
              placeholder="Очки"
              onAnimationStart={() => {
                console.log('animation')
              }}
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
      onSubmit={handleSubmit((data) => console.log(data))}
      {...formProps}
    >
      <div className="flex w-full flex-col gap-y-6 items-stretch">
        <ul className="flex flex-col w-full gap-y-3">
          <div className="flex w-full flex-col gap-y-3 h-full overflow-y-scroll p-1">
            {formFields}
            {multiplySlots && (
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
