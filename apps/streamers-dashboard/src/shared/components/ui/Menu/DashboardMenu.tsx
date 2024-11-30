import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../../../lib/utils/cn'
import { Icons } from '../icons'
import { ReactNode, useMemo } from 'react'
import { paths } from '../../../router/paths'
import { useMediaQuery } from '@hooks/useMediaQuery'
import { tailwindScreens } from '@/lib/constants/twScreens'

type DashboardMenuProps = {
  className: string
}

const DashboardMenu = ({ className }: DashboardMenuProps) => {
  const { pathname } = useLocation()
  const isLargeThenTablet = useMediaQuery(
    `(min-width: ${tailwindScreens.tablet})`
  )

  const menuItems = useMemo(() => {
    return paths.reduce<ReactNode[]>((acc, curr) => {
      const menuIcon = {
        '/wheel': <Icons.Home size={isLargeThenTablet ? 'sm' : 'default'} />,
        '/donations': (
          <Icons.DonateMessage size={isLargeThenTablet ? 'sm' : 'default'} />
        ),
        '/settings': (
          <Icons.Settings size={isLargeThenTablet ? 'sm' : 'default'} />
        ),
        '/slots': <Icons.List size={isLargeThenTablet ? 'sm' : 'default'} />,
      }[curr.path]

      const isCurrentItemInPathname = pathname.includes(curr.path)
      const routerLink = curr.path.replace('/', '')

      const menuItem = (
        <li
          key={curr.path}
          className={cn(
            'cursor-pointer text-gray transition-all hover:text-gray-accent',
            isCurrentItemInPathname && 'text-gray-accent'
          )}
        >
          <Link to={routerLink} relative="path">
            {menuIcon}
          </Link>
        </li>
      )

      acc.push(menuItem)

      return acc
    }, [])
  }, [pathname])

  return (
    <nav className={cn(className)}>
      <div className="tablet:rounded-medium tablet:h-fit rounded-b-none tablet:backdrop-filter-none h-full rounded-t-medium bg-dark/60 px-4 py-4 backdrop-blur-md">
        <ul className="tablet:flex-col tablet:w-full tablet:px-0 flex h-full flex-row items-center justify-between gap-y-5 px-4">
          {menuItems}
        </ul>
      </div>
    </nav>
  )
}

export default DashboardMenu
