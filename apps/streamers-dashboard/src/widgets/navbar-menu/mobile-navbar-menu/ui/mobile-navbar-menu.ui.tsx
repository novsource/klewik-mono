import { ReactNode, useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { Button } from '~shared/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '~shared/ui/drawer'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'

import { cn } from '~shared/utils'

const NavbarMenu = (props: { onClick: () => void }) => {
  const { pathname } = useLocation()

  const menuItems = useMemo(() => {
    const paths = [
      { path: '/wheel' },
      { path: '/slots' },
      { path: '/donations' },
      { path: '/settings' },
    ]
    return paths.reduce<ReactNode[]>((acc, curr: (typeof paths)[number]) => {
      const menuIcon = {
        '/wheel': <Icons.Wheel size="sm" />,
        '/donations': <Icons.DonateMessage size="sm" />,
        '/settings': <Icons.Settings size="sm" />,
        '/slots': <Icons.Slots size="sm" />,
      }[curr.path]

      const routerLink = curr.path.replace('/', '')

      const menuTitle = {
        wheel: 'Событие аукциона',
        donations: 'Донаты',
        settings: 'Настройки',
        slots: 'Слоты аукциона',
      }[routerLink]

      acc.push(
        <li key={routerLink} className="inline-block cursor-pointer">
          <NavLink
            to={routerLink}
            onClick={props.onClick}
            className={({ isActive }) =>
              cn(
                'flex items-center justify-start gap-x-2 w-full text-md font-medium py-4 px-4 rounded-lg',
                isActive && 'text-white bg-dark',
                !isActive && 'hover:text-gray-accent text-gray-light'
              )
            }
          >
            {menuIcon}
            {menuTitle}
          </NavLink>
        </li>
      )

      return acc
    }, [])
  }, [pathname])

  return (
    <nav data-slot="mobile-navbar">
      <Flex className="w-full gap-y-4 py-4" component="ul" justify="between">
        {menuItems}
      </Flex>
    </nav>
  )
}

const MobileNavbarMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <Drawer noBodyStyles open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DrawerTrigger asChild>
        <Button
          className="px-2 py-2 -my-2 -mx-2"
          variant={'ghost'}
          isIconOnly
          icon={
            <Icons.Hamburger
              className="text-gray-accent"
              width={28}
              height={28}
            />
          }
        />
      </DrawerTrigger>
      <DrawerContent className="px-4">
        <DrawerTitle className="text-white">Перейти в</DrawerTitle>
        <NavbarMenu onClick={() => setIsMenuOpen(false)} />
      </DrawerContent>
    </Drawer>
  )
}

export { MobileNavbarMenu }
