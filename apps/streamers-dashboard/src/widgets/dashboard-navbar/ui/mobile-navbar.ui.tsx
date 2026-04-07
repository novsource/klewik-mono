import type { ReactNode } from 'react'
import { useMemo } from 'react'

import { NavLink } from 'react-router-dom'

import { DASHBOARD_ROUTES, ROUTES_TITLES } from '~shared/constants/router'

import { Drawer, DrawerContent, DrawerTrigger } from 'klewik-ui/drawer'
import { Icons } from 'klewik-ui/icons'
import { Text } from 'klewik-ui/typography'

import { cn } from '~shared/utils'

import { MobileMenu } from './mobile-menu.ui'

const paths = [
  { path: DASHBOARD_ROUTES.GAMES },
  { path: DASHBOARD_ROUTES.SLOTS },
  { path: DASHBOARD_ROUTES.DONATIONS },
]

export const MobileNavbar = () => {
  const navLinks = useMemo(() => {
    return paths.reduce<ReactNode[]>((acc, curr: (typeof paths)[number]) => {
      const navIcon = {
        '/games': <Icons.Gamepad size="sm" />,
        '/donations': <Icons.MoneyHand size="default" />,
        '/slots': <Icons.Slots size="sm" />,
      }[curr.path]

      const routerLink = curr.path.replace('/', '')

      // @ts-expect-error Waiting router link from routes titles
      const navTitle = Reflect.has(ROUTES_TITLES, routerLink) ? ROUTES_TITLES[routerLink] : ''

      // On mobile devices wheel is disabled
      if (routerLink === 'wheel') {
        acc.push(
          <li key={routerLink} className="flex justify-center">
            <DisabledWheelRouteSheet>
              <div className="flex size-5 justify-center">
                {navIcon}
              </div>
              {navTitle}

              {/* <Button
                variant="ghost"
                className={cn('flex flex-col items-center justify-start gap-y-0.25 w-full text-[11px] font-regular h-full px-4 text-dark-accent')}
              >
                <>
                  <div className="flex size-5 justify-center">
                    {navIcon}
                  </div>
                  {navTitle}
                </>
              </Button> */}
            </DisabledWheelRouteSheet>
          </li>,
        )

        return acc
      }

      acc.push(
        <li className="flex justify-center" key={routerLink}>
          <NavLink
            to={routerLink}
            className={({ isActive }) =>
              cn(
                'w-fit flex flex-col items-center justify-start gap-y-0.25 text-[11px] font-regular h-full px-4 cursor-pointer',
                isActive && 'text-gray-accent',
                !isActive && 'hover:text-gray-light text-gray/50',
              )}
          >
            <div className="flex size-5 justify-center">
              {navIcon}
            </div>
            {navTitle}
          </NavLink>
        </li>,
      )

      return acc
    }, [])
  }, [])

  return (
    <nav className={cn('w-full h-fit py-1.5')}>
      <ul className="px-2 grid grid-cols-4 h-full items-center justify-center">
        <>
          {navLinks}
          <MobileMenu />
        </>
      </ul>
    </nav>
  )
}

type DisabledWheelRouteSheetProps = {
  children: ReactNode
}

function DisabledWheelRouteSheet(props: DisabledWheelRouteSheetProps) {
  const { children } = props

  return (
    <Drawer side="bottom">
      <DrawerTrigger className="flex flex-col items-center justify-start gap-y-0.25 w-full text-[11px] font-regular h-full px-4 text-dark-accent">{children}</DrawerTrigger>
      <DrawerContent>
        <Text asSpan>
          Колесо все еще дорабатывается на мобильных устройствах (будет добавлено в будущем).
        </Text>
      </DrawerContent>
    </Drawer>
  )
}
