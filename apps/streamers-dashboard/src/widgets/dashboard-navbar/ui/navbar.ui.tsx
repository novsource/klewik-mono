import { useCallback } from 'react'
import type { ReactNode } from 'react'

import { NavLink } from 'react-router-dom'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { MediaQueryViewToggler } from '~shared/components/media-query-view-toggler'

import { Icons } from 'klewik-ui/icons'
import { MotionBox } from 'klewik-ui/motion-box'

import { cn } from '~shared/utils/react'

export type NavbarLinkItem = {
  path: string
  icon?: ReactNode
  relative?: boolean
}

export type NavbarProps = {
  links: NavbarLinkItem[]
} & SlotClassname<'base'> & SlotClassname<'list'>

export const Navbar = (props: NavbarProps) => {
  const { links, slotClassnames } = props

  const renderNavbarItems = useCallback((linkItem: NavbarLinkItem) => {
    const routerLink = linkItem.path.replace('/', '')

    return (
      <li className="cursor-pointer">
        <NavLink
          to={routerLink}
          className={({ isActive }) =>
            cn(
              'flex items-center justify-center transition-all hover:text-gray-accent text-gray/70 p-2 bg-inherit hover:scale-110',
              isActive && 'text-green-accent bg-green-dark rounded-md hover:text-green-accent hover:scale-100',
            )}
        >
          {linkItem.icon}
        </NavLink>
      </li>
    )
  }, [])

  return (
    <nav data-slot="navbar" className={cn('flex flex-col w-full h-full z-50 gap-y-4 items-center', slotClassnames?.base)}>
      <MediaQueryViewToggler query={greaterThenDeviceWidthMediaQueries.tablet}>

        <MediaQueryViewToggler.MatchedItem>
          <MotionBox
            whileHover={{ rotate: '180deg' }}
            transition={{ duration: 0.65 }}
          >
            <NavLink to="/">
              <Icons.Logo className="text-green-accent" width={28} height={28} />
            </NavLink>
          </MotionBox>
        </MediaQueryViewToggler.MatchedItem>

      </MediaQueryViewToggler>

      <ul className={cn('flex flex-col justify-between w-full gap-y-3.5 py-4 px-3.5', slotClassnames?.list)}>
        {links.map(link => renderNavbarItems(link))}
      </ul>
    </nav>
  )
}
