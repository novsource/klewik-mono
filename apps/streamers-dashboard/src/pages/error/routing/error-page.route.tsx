import type { NonIndexRouteObject } from 'react-router-dom'

type RouteProps = Partial<NonIndexRouteObject>

const ERROR_PAGE_ROUTE_PATH = 'error'

export const errorPageRoute = (options?: RouteProps): NonIndexRouteObject => {
  return {
    path: ERROR_PAGE_ROUTE_PATH,
    lazy: () => import('../ui/error-page.ui').then(module => ({ Component: module.ErrorPage })),
    ...options,
  }
}
