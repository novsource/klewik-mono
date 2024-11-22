import { Input, InputProps } from '@ui/Input/input'
import { Icons } from '@ui/icons'

type SearchInputProps = {} & InputProps

const SearchInput = (props: SearchInputProps) => {
  return (
    <Input
      startContent={
        <Icons.Magnifier className="text-gray" width={16} height={16} />
      }
      {...props}
      placeholder="Поиск по названию слота..."
    />
  )
}

export default SearchInput
