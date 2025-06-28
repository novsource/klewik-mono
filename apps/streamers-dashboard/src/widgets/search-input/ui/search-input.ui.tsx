import type { ComponentProps } from 'react'
import { memo } from 'react'

import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import type { InputProps } from '~shared/ui/input/ui/input'

type SearchInputProps = Omit<ComponentProps<'input'>, 'size' | 'className'>
  & InputProps

const SearchInput = memo((props: SearchInputProps) => {
  return (
    <Input
      slotClassNames={{ base: 'w-full', wrapper: 'pr-0', input: 'px-1' }}
      startContent={<Icons.Magnifier className="text-gray" size="xs" />}
      endContent={(
        <Icons.Close
          className="cursor-pointer text-gray transition-colors hover:text-gray-accent"
          size="lg"
        />
      )}
      placeholder="Поиск по названию слота..."
      {...props}
    />
  )
})

export { SearchInput }
