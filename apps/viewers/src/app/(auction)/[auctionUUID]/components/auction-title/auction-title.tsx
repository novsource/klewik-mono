'use client'

import { useEffect, useState, type HTMLAttributes } from 'react'
import { Title, Typography } from 'klewik-ui/typography'

import { Badge } from 'klewik-ui/badge'
import { Icons } from 'klewik-ui/icons'
import { REVALIDATE_TIME } from '~/constants'
import { useTimer } from '~hooks/index'

type AuctionTitleProps = {
  title: string
  date: number
}

export const AuctionTitle = (props: AuctionTitleProps) => {
  const { date, title } = props

  const [isDataExpires, setIsDataExpires] = useState(false)

  useTimer(REVALIDATE_TIME - Math.floor((Date.now() - date) / 1000), {
    immediately: true,
    onExpire: () => {
      setIsDataExpires(true)
    },
  })

  return (
    <div className="flex flex-col gap-y-3">
      <div className="w-fit flex gap-x-2 gap-y-1.5 max-mobile:flex-col">
        <Badge
          className='flex gap-x-1.25'
          variant={isDataExpires ? 'warning' : 'success'}>
          {isDataExpires ? <Icons.Warning className='animate-horizontal-shaking' width={12} height={12} /> : <Icons.Like width={12} height={12} />}
          {isDataExpires ? "Перезагрузите страницу" : "Данные актуальны"}
        </Badge>
      </div>
      <Title
        className="leading-6 tablet:leading-10 text-title-lg tablet:text-[27px]"
        order={1}
      >
        {title}
      </Title>
    </div>
  )
}
