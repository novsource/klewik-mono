import { ComponentProps, memo } from 'react'

import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import { InputProps } from '~shared/ui/input/ui/input'

type SearchInputProps = Omit<ComponentProps<'input'>, 'size'> & InputProps

const SearchInput = memo((props: SearchInputProps) => {
  return (
    <Input
      slotClassNames={{ base: 'w-full', input: 'px-1' }}
      startContent={<Icons.Magnifier className="text-gray" size="xs" />}
      endContent={
        <Icons.Close
          className="cursor-pointer text-gray transition-colors hover:text-gray-accent"
          size="default"
        />
      }
      placeholder="Поиск по названию слота..."
      {...props}
    />
  )
})

export { SearchInput }
