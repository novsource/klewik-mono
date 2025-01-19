import { ComponentProps } from 'react'

import { Icons } from '~shared/ui/icons'

const Header = ({ children, ...otherProps }: ComponentProps<'header'>) => {
  return (
    <header className="h-16 w-full" {...otherProps}>
      <div className="flex h-full w-full items-center justify-between gap-x-4 px-4">
        <Icons.Logo width={32} height={32} />
        {children}
      </div>
    </header>
  )
}

export default Header
