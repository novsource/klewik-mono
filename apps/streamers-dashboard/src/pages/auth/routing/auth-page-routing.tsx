import { RouteObject } from 'react-router-dom'

import { AuthPage } from '../ui'

const authPageRoute = (childrens: RouteObject[]): RouteObject => {
  return {
    element: <AuthPage />,
    children: childrens,
  }
}

export { authPageRoute }
