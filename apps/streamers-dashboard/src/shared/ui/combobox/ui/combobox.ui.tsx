import type { ReactNode } from 'react'
import { useRef, useState } from 'react'

import { Check } from 'lucide-react'

import type { SlotsSortingOptions } from '~shared/store/model'

import { Button } from '~shared/ui/button'
import type { ButtonProps } from '~shared/ui/button/ui/Button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~shared/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '~shared/ui/popover'

import { chain, cn } from '~shared/utils'

export type ComboboxData = Array<
  {
    label: string
    value: string
    icon?: ReactNode
  } & Partial<{ [key: string]: any }>
>

type ComboboxProps<T extends ComboboxData = ComboboxData> = {
  data: T
  defaultValue?: SlotsSortingOptions
  emptyMessage?: string
  triggerProps?: ButtonProps
  slotClassnames?: {
    contentWrapper?: string
    contentItem?: string
  }
  placeholder?: string
  enableSearchField?: boolean
  open?: boolean
  onOpenChange?: (value: boolean) => void
  onValueChanged?: (label: T[number]['label']) => void
  size?: ButtonProps['size']
  icon?: ReactNode
}

export function Combobox(props: ComboboxProps) {
  const {
    enableSearchField = false,
    placeholder,
    data,
    size,
    icon,
    emptyMessage,
    slotClassnames,
    triggerProps,
    onOpenChange,
    open,
    defaultValue,
  } = props

  const [isOpen, setIsOpen] = useState(open ?? false)
  const [value, setValue] = useState(() => defaultValue ?? '')

  if (open !== undefined && isOpen !== open) {
    setIsOpen(open)
  }

  /*
    This flag required for checking opportunity for setting a new default value
    If flag true that's means a value was changed and new default value can't be setted;
  */
  const isValueChangeOnce = useRef(false)

  if (!isValueChangeOnce.current && defaultValue) {
    setValue(defaultValue)
    isValueChangeOnce.current = true
  }

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange ? chain(onOpenChange, setIsOpen) : setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-fit max-w-[400px] border-dark-accent/60 hover:border-dark-accent border-1 justify-start items-center gap-x-1.5 font-medium hover:text-white/80',
            triggerProps?.className,
          )}
          role="combobox"
          startContent={icon}
          size={size}
          aria-expanded={open}
          {...triggerProps}
        >
          {value
            ? data.find(item => item.value === value)?.label
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'w-fit max-w-[400px] p-0',
          slotClassnames?.contentWrapper,
        )}
        align="start"
      >
        <Command>
          {enableSearchField && <CommandInput placeholder={placeholder} />}
          <CommandList>
            <CommandEmpty>{emptyMessage ?? 'Ничего не найдено'}</CommandEmpty>
            <CommandGroup>
              {data.map(item => (
                <CommandItem
                  className={cn(
                    'font-medium cursor-pointer',
                    slotClassnames?.contentItem,
                  )}
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue: string) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setIsOpen(false)

                    props.onValueChanged && props.onValueChanged(currentValue)

                    isValueChangeOnce.current = true
                  }}
                >
                  {item.icon}
                  {item.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === item.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
