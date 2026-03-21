import { Button } from 'klewik-ui/button'
import { Icons } from 'klewik-ui/icons'
import { toastPromiseNotification } from 'klewik-ui/toaster/lib'

import { auctionSelectors } from '~entities/auction/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { cn } from '~shared/utils'

import { useUpdateBetsStatusMutation } from '../api'

export const UpdateBetsStatusButton = () => {
  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)
  const isBetsClosed = useStoreSelector(auctionSelectors.getIsBetsClosed)

  const [betsStatusMutation, { isLoading }]
    = useUpdateBetsStatusMutation()

  const handleClick = async () => {
    if (isLoading)
      return

    const request = betsStatusMutation({ auctionUUID, status: !isBetsClosed })

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
      disabled={isLoading}
      onClick={handleClick}
    >
      {isBetsClosed ? 'Открыть ставки' : 'Закрыть ставки'}
    </Button>
  )
}
