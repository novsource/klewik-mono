import type { NonIndexRouteObject } from 'react-router-dom'

import { lazyLoadModule } from '~shared/lib/react-router-dom'

import { AnimatedRoute } from '~shared/router'

import { ErrorPage } from '../ui'

type RouteProps = Partial<
  NonIndexRouteObject & {
    disableTransition: boolean
    enableLazyLoading: boolean
  }
>

const ERROR_PAGE_ROUTE_PATH = 'error'

export const errorPageRoute = (
  options?: RouteProps,
): NonIndexRouteObject => {
  if (options?.enableLazyLoading) {
    return {
      path: ERROR_PAGE_ROUTE_PATH,
      lazy: () => lazyLoadModule('../ui/error-page.ui'),
      ...options,
    }
  }

  return {
    path: ERROR_PAGE_ROUTE_PATH,
    element: options?.disableTransition
      ? (
          <ErrorPage />
        )
      : (
          <AnimatedRoute>
            <ErrorPage />
          </AnimatedRoute>
        ),
    ...options,
  }
}
