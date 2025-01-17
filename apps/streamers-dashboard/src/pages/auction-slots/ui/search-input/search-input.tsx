import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import { InputProps } from '~shared/ui/input/ui/input'

type SearchInputProps = {} & InputProps

const SearchInput = (props: SearchInputProps) => {
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
      {...props}
      placeholder="Поиск по названию слота..."
    />
  )
}

export default SearchInput
