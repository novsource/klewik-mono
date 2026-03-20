import type {
  RouteObject,
} from 'react-router-dom'

import { GlobalDialogs } from '~app/components/global-dialogs/ui/global-dialogs.ui'

import { DashboardLayout } from '~pages/dashboard/_layout'
import { ErrorPage } from '~pages/error/ui'

import { prepareDashboardRouteLoader } from './prepare-dashboard.loader'

export const prepareDashboardRoute = (childrens: RouteObject[]): RouteObject => {
  return {
    element: (
      <>
        <DashboardLayout />
        <GlobalDialogs />
      </>
    ),
    loader: prepareDashboardRouteLoader,
    errorElement: <ErrorPage />,
    children: childrens,
  }
}
