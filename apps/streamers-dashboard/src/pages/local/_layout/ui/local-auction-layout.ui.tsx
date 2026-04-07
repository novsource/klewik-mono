import { Outlet } from 'react-router-dom'

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
  useLocalDashboardStateRestore()
  useLocalStateAutosave()

  const { setDialogOpenStatus } = useActionCreators(globalDialogsActions)
  const { setAuctionType } = useActionCreators(auctionActions)

  useMount(() => {
    setAuctionType('local')
  })

  return (
    <MediaQueryViewToggler query={greaterThenDeviceWidthMediaQueries.tablet}>
      <div className="w-full h-full tablet:inline-flex tablet:h-auto">

        <MediaQueryViewToggler.MatchedItem>
          <aside className="sticky top-0 h-screen py-4 border-r-1 border-r-dark bg-dark-foreground-light">
            <div className="flex w-full h-full flex-col justify-between items-center">
              <Navbar links={LOCAL_NAVBAR_LINKS} />

              <Button
                className="text-gray-light hover:bg-dark hover:text-gray-accent"
                variant="ghost"
                isIconOnly
                icon={<Icons.Settings />}
                onClick={() => setDialogOpenStatus({ dialog: 'settings', status: true })}
              />
            </div>
          </aside>
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
