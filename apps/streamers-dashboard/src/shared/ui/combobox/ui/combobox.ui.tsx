import { useState } from 'react'

import { Check } from 'lucide-react'

import { Button } from '~shared/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~shared/ui/command'
import { Icons } from '~shared/ui/icons'
import { Popover, PopoverContent, PopoverTrigger } from '~shared/ui/popover'

import { cn } from '~shared/utils'

type ComboboxData = Array<
  {
    label: string
    value: string
  } & Partial<{ [key: string]: any }>
>

type ComboboxProps<T extends ComboboxData = ComboboxData> = {
  data: T
  defaultValue?: Pick<T[number], 'value'>
  placeholder?: string
  enableSearchField?: boolean
  onValueChanged?: (label: T[number]['label']) => void
}

export function Combobox(props: ComboboxProps) {
  const { enableSearchField = false, placeholder, data } = props

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(() => props.defaultValue ?? '')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="w-fit max-w-[400px] justify-start items-center gap-x-1.5 font-medium hover:text-white/80"
          startContent={<Icons.Sort />}
          variant="outline"
          role="combobox"
          aria-expanded={open}
        >
          {value
            ? data.find((item) => item.value === value)?.label
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit max-w-[400px] p-0" align="start">
        <Command>
          {enableSearchField && <CommandInput placeholder={placeholder} />}
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  className="font-medium cursor-pointer"
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue: string) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)

                    props.onValueChanged && props.onValueChanged(currentValue)
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === item.value ? 'opacity-100' : 'opacity-0'
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
