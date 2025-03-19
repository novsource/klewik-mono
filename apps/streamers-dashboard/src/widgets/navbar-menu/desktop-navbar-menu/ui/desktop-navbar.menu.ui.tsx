import { ReactNode, useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { useMediaQuery } from '~shared/hooks/use-media-query'

import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'

import { tailwindScreens } from '~shared/constants/tailwindcss'

import { cn } from '~shared/utils'

const NavbarMenu = () => {
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
        '/wheel': <Icons.Wheel size={isLargeThenTablet ? 'sm' : 'default'} />,
        '/donations': (
          <Icons.DonateMessage size={isLargeThenTablet ? 'sm' : 'default'} />
        ),
        '/settings': (
          <Icons.Settings size={isLargeThenTablet ? 'sm' : 'default'} />
        ),
        '/slots': <Icons.Slots size={isLargeThenTablet ? 'sm' : 'default'} />,
      }[curr.path]

      const routerLink = curr.path.replace('/', '')

      acc.push(
        <li key={curr.path} className="cursor-pointer">
          <NavLink
            to={routerLink}
            className={({ isActive }) =>
              cn(
                'transition-all hover:text-gray-accent text-gray/70',
                isActive && 'text-gray-accent'
              )
            }
          >
            {menuIcon}
          </NavLink>
        </li>
      )

      return acc
    }, [])
  }, [pathname])

  return (
    <nav data-slot="navbar" className="fixed left-3 top-1/2 -translate-y-1/2">
      <Flex
        className="w-full gap-y-5 py-4 bg-dark/60 px-4 rounded-lg"
        component="ul"
        direction="column"
        justify="between"
      >
        {menuItems}
      </Flex>
    </nav>
  )
}

const DesktopNavbarMenu = () => {
  return (
    <aside className="h-full w-13 flex-none">
      <NavbarMenu />
    </aside>
  )
}

export { DesktopNavbarMenu }
