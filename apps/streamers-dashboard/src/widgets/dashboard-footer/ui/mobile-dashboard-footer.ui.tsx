import { useMemo } from 'react'
import type { ComponentProps } from 'react'

import { useLocation } from 'react-router-dom'

import { CreateSlotsDialog } from '~features/auction-slot/create-slots/ui'

import { DASHBOARD_ROUTES } from '~shared/constants/router'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'

import { cn } from '~shared/utils'

export type MobileDashboardFooterProps = ComponentProps<'footer'>

export const MobileDashboardFooter = (props: MobileDashboardFooterProps) => {
  const { className, children, ...restProps } = props

  const { pathname } = useLocation()

  const style = useMemo(() =>
    cn(
      'fixed bottom-0 z-50 w-full bg-dark-foreground-light border-t-1 border-dark-accent/50 transition-all',
      className,
    ), [className])

  return (
    <footer className={style} {...restProps}>
      <ExtraRouteControls path={`/${pathname.split('/')[3]}` as DASHBOARD_ROUTES} />
      {children}
    </footer>
  )
}

type ExtraRouteControlsProps = {
  path: DASHBOARD_ROUTES
}

function ExtraRouteControls(props: ExtraRouteControlsProps) {
  const { path } = props

  if (path === DASHBOARD_ROUTES.SLOTS) {
    return <ExtraAuctionSlotsRouteControls />
  }
}

function ExtraAuctionSlotsRouteControls() {
  return (
    <div className="w-full px-4 pb-1 pt-2">
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
