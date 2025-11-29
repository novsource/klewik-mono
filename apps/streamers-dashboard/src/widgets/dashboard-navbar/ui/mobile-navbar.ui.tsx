import type { ReactNode } from 'react'
import { useMemo } from 'react'

import { NavLink } from 'react-router-dom'

import { DASHBOARD_ROUTES } from '~shared/constants/router'

import { Icons } from '~shared/ui/icons'

import { cn } from '~shared/utils'

import { MobileMenu } from './mobile-menu.ui'

const paths = [
  { path: DASHBOARD_ROUTES.WHEEL },
  { path: DASHBOARD_ROUTES.SLOTS },
  { path: DASHBOARD_ROUTES.DONATIONS },
]

export const MobileNavbar = () => {
  const navLinks = useMemo(() => {
    return paths.reduce<ReactNode[]>((acc, curr: (typeof paths)[number]) => {
      const navIcon = {
        '/wheel': <Icons.Wheel size="sm" />,
        '/donations': <Icons.MoneyHand size="default" />,
        '/slots': <Icons.Slots size="sm" />,
      }[curr.path]

      const routerLink = curr.path.replace('/', '')

      const navTitle = {
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
