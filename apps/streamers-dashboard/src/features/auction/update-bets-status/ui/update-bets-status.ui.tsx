import { memo } from 'react'

import { auctionSelectors } from '~entities/auction/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { toastPromiseNotification } from '~shared/ui/toaster/lib'

import { cn } from '~shared/utils'

import { useLazyCloseBetsQuery, useLazyOpenBetsQuery } from '../api'

const UpdateBetsStatusButton = memo(() => {
  const auctionId = useStoreSelector(auctionSelectors.getAuctionId)
  const isBetsClosed = useStoreSelector(auctionSelectors.getBetsStatus)

  const [openBetsQuery, { isLoading: openBetsQueryLoading }] =
    useLazyOpenBetsQuery()
  const [closeBetsQuery, { isLoading: closeBetsQueryLoading }] =
    useLazyCloseBetsQuery()

  const handleClick = async () => {
    if (openBetsQueryLoading || closeBetsQueryLoading) return

    const request = isBetsClosed
      ? openBetsQuery({ auctionId })
      : closeBetsQuery({ auctionId })

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
      }
    )
  }

  return (
    <Button
      variant={!isBetsClosed ? 'error' : 'default'}
      size="sm"
      className={cn('text-md leading-5 px-3')}
      startContent={
        !isBetsClosed ? <Icons.Close size="lg" /> : <Icons.OpenBets size="sm" />
      }
      disabled={openBetsQueryLoading || closeBetsQueryLoading}
      onClick={handleClick}
    >
      {isBetsClosed ? 'Открыть ставки' : 'Закрыть ставки'}
    </Button>
  )
})

export { UpdateBetsStatusButton }
