import type { ReactNode } from 'react'
import { useMemo } from 'react'

import { NavLink } from 'react-router-dom'

import { DASHBOARD_ROUTES } from '~shared/constants/router'
import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks'

import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '~shared/ui/tooltip'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

const paths = [
  { path: DASHBOARD_ROUTES.WHEEL },
  { path: DASHBOARD_ROUTES.SLOTS },
  { path: DASHBOARD_ROUTES.DONATIONS },
]

export const DesktopNavbar = () => {
  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  const menuItems = useMemo(() => {
    return paths.reduce<ReactNode[]>((acc, curr: (typeof paths)[number]) => {
      const menuIcon = {
        '/wheel': <Icons.Wheel size={isLargeThenTablet ? 'sm' : 'default'} />,
        '/donations': (
          <Icons.MoneyHand size={isLargeThenTablet ? 'default' : 'default'} />
        ),
        '/settings': (
          <Icons.Settings size={isLargeThenTablet ? 'sm' : 'default'} />
        ),
        '/slots': <Icons.Slots size={isLargeThenTablet ? 'sm' : 'default'} />,
      }[curr.path]

      const routerLink = curr.path.replace('/', '')

      const link = (
        <li className="cursor-pointer">
          <NavLink
            to={routerLink}
            className={({ isActive }) =>
              cn(
                'flex items-center justify-center transition-all hover:text-gray-accent text-gray/70',
                isActive && 'text-gray-accent',
              )}
          >
            {menuIcon}
          </NavLink>
        </li>
      )

      const tooltipContent = {
        wheel: 'Событие аукциона',
        donations: 'Донаты',
        settings: 'Настройки',
        slots: 'Слоты аукциона',
      }[routerLink]

      acc.push(
        <Tooltip key={curr.path} delayDuration={500}>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right">
            <Typography className="text-sm" tag="span">
              {tooltipContent}
            </Typography>
          </TooltipContent>
        </Tooltip>,
      )

      return acc
    }, [])
  }, [isLargeThenTablet])

  return (
    <nav data-slot="navbar" className="fixed left-3 top-1/2 -translate-y-1/2 z-50">
      <Flex
        as="ul"
        className="w-full gap-y-5 py-4 bg-dark/60 px-3.5 rounded-lg"
        direction="column"
        justify="between"
      >
        {menuItems}
      </Flex>
    </nav>
  )
}
