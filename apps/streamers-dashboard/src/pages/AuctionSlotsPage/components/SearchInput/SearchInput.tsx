import { Input, InputProps } from '@ui/Input/input'
import { Icons } from '@ui/icons'

type SearchInputProps = {} & InputProps

const SearchInput = (props: SearchInputProps) => {
  return (
    <Input
      startContent={
        <Icons.Magnifier className="text-gray" width={16} height={16} />
      }
      endContent={
        <Icons.Close
          className="cursor-pointer text-gray transition-colors hover:text-gray-accent"
          width={24}
          height={24}
        />
      }
      {...props}
      placeholder="Поиск по названию слота..."
    />
  )
}

export default SearchInput
