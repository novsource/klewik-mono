import { ReactNode, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { useMediaQuery } from '~shared/hooks/use-media-query'

import { Icons } from '~shared/ui/icons'
import { Navbar, NavbarItem, NavbarProps } from '~shared/ui/navbar'

import { tailwindScreens } from '~shared/constants/tailwindcss'

import { cn } from '~shared/utils'

type NavbarMenuProps = NavbarProps

export const NavbarMenu = (props: NavbarMenuProps) => {
  const { pathname } = useLocation()
  const isLargeThenTablet = useMediaQuery(
    `(min-width:${tailwindScreens.tablet})`
  )

  const menuItems = useMemo(() => {
    const paths = [
      { path: '/wheel' },
      { path: '/slots' },
      { path: '/donations' },
      { path: '/settings' },
    ]
    return paths.reduce<ReactNode[]>((acc, curr: (typeof paths)[number]) => {
      const menuIcon = {
        '/wheel': <Icons.Home size={isLargeThenTablet ? 'sm' : 'default'} />,
        '/donations': (
          <Icons.DonateMessage size={isLargeThenTablet ? 'sm' : 'default'} />
        ),
        '/settings': (
          <Icons.Settings size={isLargeThenTablet ? 'sm' : 'default'} />
        ),
        '/slots': <Icons.Slots size={isLargeThenTablet ? 'sm' : 'default'} />,
      }[curr.path]

      const isCurrentItemInPathname = pathname.includes(curr.path)
      const routerLink = curr.path.replace('/', '')

      acc.push(
        <NavbarItem
          htmlProps={{
            className: cn(
              'cursor-pointer text-gray transition-all hover:text-gray-accent',
              isCurrentItemInPathname && 'text-gray-accent'
            ),
          }}
          linkProps={{ to: routerLink, relative: 'path' }}
        >
          {menuIcon}
        </NavbarItem>
      )

      return acc
    }, [])
  }, [pathname])

  return <Navbar {...props}>{menuItems}</Navbar>
}
