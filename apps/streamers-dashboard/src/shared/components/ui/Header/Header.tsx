import { Icons } from '@ui/icons'
import { PropsWithChildren } from 'react'

const Header = ({ children }: PropsWithChildren) => {
  return (
    <header className="h-16 w-full">
      <div className="flex h-full w-full items-center justify-between gap-x-4 px-4">
        <Icons.Logo width={32} height={32} />
        {children}
      </div>
    </header>
  )
}

export default Header
