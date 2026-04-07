import { NavLink, Outlet } from 'react-router-dom'

import { DividedLayout } from '~shared/layouts/divided-layout'
import { PageSidebarLayout } from '~shared/layouts/page-sidebar-layout'

import { globalDialogsActions } from '~app/components/global-dialogs/store/global-dialogs.slice'

import { LocalDashboardHeader } from '~widgets/dashboard-header/ui'
import { MobileNavbar, Navbar } from '~widgets/dashboard-navbar/ui'

import { auctionActions } from '~entities/auction/store'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { MediaQueryViewToggler } from '~shared/components/media-query-view-toggler'

import { useMount } from '~shared/hooks'

import { useActionCreators } from '~shared/lib/redux-toolkit'

import { Button } from 'klewik-ui/button'
import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'

import { LOCAL_NAVBAR_LINKS } from '../constants/local-navbar-links'
import { useLocalDashboardStateRestore } from '../hooks/use-local-dashboard-state-restore'
import { useLocalStateAutosave } from '../hooks/use-local-state-autosave'

export const LocalAuctionLayout = () => {
  const { setDialogOpenStatus } = useActionCreators(globalDialogsActions)

  useLocalAuctionDashboard()

  return (
    <MediaQueryViewToggler query={greaterThenDeviceWidthMediaQueries.tablet}>
      <div className="w-full h-full tablet:inline-flex tablet:h-auto">

        <MediaQueryViewToggler.MatchedItem>
          <PageSidebarLayout>
            <div className="flex w-full h-full flex-col justify-between items-center">
              <Navbar links={LOCAL_NAVBAR_LINKS} />

              <DividedLayout slotClassnames={{ container: 'flex flex-col items-center' }} orientation="horizontal" gap={12}>
                <Button
                  className="text-gray-light hover:bg-dark hover:text-gray-accent"
                  variant="ghost"
                  isIconOnly
                  icon={<Icons.Settings />}
                  onClick={() => setDialogOpenStatus({ dialog: 'settings', status: true })}
                />

                <NavLink className="text-gray-light hover:text-gray-accent" to="https://github.com/notifications" target="_blank">
                  <Icons.Github />
                </NavLink>
              </DividedLayout>
            </div>
          </PageSidebarLayout>
        </MediaQueryViewToggler.MatchedItem>

        <Flex className="w-full h-full flex flex-col">
          <LocalDashboardHeader />

          <main className="relative w-full overflow-y-scroll tablet:h-full tablet:overflow-x-hidden tablet:overflow-y-scroll">
            <Flex className="h-full w-full px-4">
              <Outlet />
            </Flex>
          </main>

          <MediaQueryViewToggler.NotMatchedItem>
            <MobileNavbar />
          </MediaQueryViewToggler.NotMatchedItem>

        </Flex>
      </div>
    </MediaQueryViewToggler>
  )
}

function useLocalAuctionDashboard() {
  const { setAuctionType } = useActionCreators(auctionActions)

  useLocalDashboardStateRestore()
  useLocalStateAutosave()

  useMount(() => {
    setAuctionType('local')
  })
}
