import type { ReactNode } from 'react'
import { useMemo } from 'react'

import { NavLink, useLocation } from 'react-router-dom'

import { CreateSlotsDialog } from '~widgets/create-slots-dialog/ui'

import { DASHBOARD_ROUTES } from '~shared/constants/router'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { Sheet, SheetContent, SheetTrigger } from '~shared/ui/sheet'

import { cn } from '~shared/utils'

const paths = [
  { path: DASHBOARD_ROUTES.WHEEL },
  { path: DASHBOARD_ROUTES.SLOTS },
  { path: DASHBOARD_ROUTES.DONATIONS },
]

export const MobileNavbarMenu = () => {
  const { pathname } = useLocation()

  const menuLinks = useMemo(() => {
    return paths.reduce<ReactNode[]>((acc, curr: (typeof paths)[number]) => {
      const menuIcon = {
        '/wheel': <Icons.Wheel size="sm" />,
        '/donations': <Icons.MoneyHand size="default" />,
        '/slots': <Icons.Slots size="sm" />,
      }[curr.path]

      const routerLink = curr.path.replace('/', '')

      const menuTitle = {
        wheel: 'Колесо',
        donations: 'Донаты',
        slots: 'Слоты',
      }[routerLink]

      acc.push(
        <li key={routerLink} className="cursor-pointer">
          <NavLink
            to={routerLink}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-start gap-y-0.25 w-full text-[11px] font-regular h-full px-4',
                isActive && 'text-gray-accent',
                !isActive && 'hover:text-gray-light text-gray/50',
              )}
          >
            <div className="flex size-5 justify-center">
              {menuIcon}
            </div>
            {menuTitle}
          </NavLink>
        </li>,
      )

      return acc
    }, [])
  }, [])

  return (
    <footer className="z-50 w-full bottom-0 bg-dark-foreground-light border-t-1 border-dark-accent/50 rounded-t-large transition-all">
      <ExtraRouteControls path={`/${pathname.split('/')[3]}` as DASHBOARD_ROUTES} />
      <nav className={cn('w-full h-fit py-1.5')}>
        <ul className="px-2 grid grid-cols-4 h-full items-center justify-center">
          <>
            {menuLinks}
            <Sheet>
              <SheetTrigger nativeButton={false}>
                <Button
                  variant="ghost"
                  className={cn(
                    'flex flex-col items-center justify-start gap-y-0.25 w-full text-[11px] font-regular h-full px-4 text-gray/50',
                  )}
                >
                  <div className="flex size-5 justify-center">
                    <Icons.Hamburger />
                  </div>
                  Меню
                </Button>
              </SheetTrigger>
              <SheetContent className="w-2/3 left-auto" isFullPageSize>
                test
              </SheetContent>
            </Sheet>
          </>
        </ul>
      </nav>
    </footer>
  )
}

type ExtraRouteControlsProps = {
  path: DASHBOARD_ROUTES
}

function ExtraRouteControls(props: ExtraRouteControlsProps) {
  const { path } = props

  if (path === DASHBOARD_ROUTES.SLOTS) {
    return <ExtraWheelRouteControls />
  }
}

function ExtraWheelRouteControls() {
  return (
    <div className="w-full px-4 py-2 pb-3">
      <CreateSlotsDialog
        trigger={(
          <Button
            className="w-full"
            variant="action"
            size="sm"
            startContent={<Icons.Plus />}
          >
            Добавить слоты
          </Button>
        )}
      />
    </div>
  )
}
