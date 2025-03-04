import { ComponentProps } from 'react'
import { NavLink } from 'react-router-dom'

import { Icons } from '~shared/ui/icons'

const Header = ({ children, ...otherProps }: ComponentProps<'header'>) => {
  return (
    <header className="h-16 w-full" {...otherProps}>
      <div className="flex h-full w-full items-center justify-between gap-x-4 px-4">
        <NavLink to={'/'}>
          <Icons.Logo className="text-green-accent" width={28} height={28} />
        </NavLink>
        {children}
      </div>
    </header>
  )
}

export default Header
