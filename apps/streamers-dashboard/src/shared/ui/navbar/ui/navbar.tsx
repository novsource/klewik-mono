import { ComponentProps, HTMLAttributes, ReactNode } from 'react'
import { Link, LinkProps } from 'react-router-dom'

import { cn } from '~shared/utils'

export type NavbarProps = ComponentProps<'nav'>
type NavbarItemProps = {
  htmlProps: ComponentProps<'li'>
  linkProps: LinkProps
  children: ReactNode
}

export const NavbarItem = ({
  htmlProps,
  linkProps,
  children,
}: NavbarItemProps) => {
  return (
    <li
      className="cursor-pointer text-gray transition-all hover:text-gray-accent"
      {...htmlProps}
    >
      <Link {...linkProps}> {children}</Link>
    </li>
  )
}

export const Navbar = ({ className, children, ...otherProps }: NavbarProps) => {
  return (
    <nav className={cn(className)} {...otherProps}>
      <div className="tablet:rounded-medium tablet:h-fit rounded-b-none tablet:backdrop-filter-none h-full rounded-t-medium bg-dark/60 px-4 py-4 backdrop-blur-md">
        <ul className="tablet:flex-col tablet:w-full tablet:px-0 flex h-full flex-row items-center justify-between gap-y-5 px-4">
          {children}
        </ul>
      </div>
    </nav>
  )
}
