import { auctionSelectors } from '~entities/auction/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { toastPromiseNotification } from '~shared/ui/toaster/lib'

import { cn } from '~shared/utils'

import { useLazyCloseBetsQuery, useLazyOpenBetsQuery } from '../api'

export const UpdateBetsStatusButton = () => {
  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)
  const isBetsClosed = useStoreSelector(auctionSelectors.getIsBetsClosed)

  const [openBetsQuery, { isLoading: openBetsQueryLoading }]
    = useLazyOpenBetsQuery()
  const [closeBetsQuery, { isLoading: closeBetsQueryLoading }]
    = useLazyCloseBetsQuery()

  const handleClick = async () => {
    if (openBetsQueryLoading || closeBetsQueryLoading)
      return

    const request = isBetsClosed
      ? openBetsQuery({ auctionUUID, status: isBetsClosed })
      : closeBetsQuery({ auctionUUID, status: isBetsClosed })

    toastPromiseNotification(
      request,
      isBetsClosed ? 'Открываем прием ставок...' : 'Закрываем прием ставок...',
      {
        successText: isBetsClosed
          ? 'Прием ставок успешно открыт!'
          : 'Прием ставок закрыт!',
        errorText: isBetsClosed
          ? 'Не удалось открыть ставки'
          : 'Не удалось закрыть ставки',
      },
    )
  }

  return (
    <Button
      variant={!isBetsClosed ? 'error' : 'default'}
      size="sm"
      className={cn('leading-5 px-2')}
      startContent={
        !isBetsClosed ? <Icons.Close size="lg" /> : <Icons.OpenBets size="sm" />
      }
      disabled={openBetsQueryLoading || closeBetsQueryLoading}
      onClick={handleClick}
    >
      {isBetsClosed ? 'Открыть ставки' : 'Закрыть ставки'}
    </Button>
  )
}
