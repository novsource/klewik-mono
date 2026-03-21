import type { HTMLAttributes } from 'react'
import { Typography } from 'klewik-ui/typography'

type AuctionTitleProps = {
  title: string
  styles?: HTMLAttributes<HTMLDivElement>['style']
  date: string
}

export const AuctionTitle = ({ title }: AuctionTitleProps) => {
  return (
    <div className="flex flex-col gap-y-0.5">
      <Typography
        tag="h1"
        className="leading-6 tablet:leading-10 text-title-lg tablet:text-[27px]"
      >
        {title}
      </Typography>
    </div>
  )
}
