import { AuctionSlot } from '~entities/auction-slot/model'

import { AnimatedTruncText } from '~shared/ui/animated-trunc-text'
import { Card, CardContent, CardFooter } from '~shared/ui/card'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

type TableItemCardProps<T> = {
  data: T
}

const TableItemCard = <T extends AuctionSlot>({
  data,
}: TableItemCardProps<T>) => {
  return (
    <Card className="rounded-large">
      <CardContent>
        <div className="flex items-center gap-x-1">
          <Typography
            tag="span"
            className="font-golosF text-nowrap text-gray-light"
          >
            Наименование слота:{' '}
          </Typography>
          <AnimatedTruncText>{data.name}</AnimatedTruncText>
        </div>
        <div className="flex items-center gap-x-1">
          <Typography tag="span" className="font-golosF text-gray-light">
            Количество очков:{' '}
          </Typography>
          <Typography tag="span" className="font-golosF">
            {new Intl.NumberFormat('ru-ru').format(data.points)}
          </Typography>
        </div>
        <div className="flex items-center gap-x-1">
          <Typography tag="span" className="font-golosF text-gray-light">
            Шанс:{' '}
          </Typography>
          <Typography tag="span" className="font-golosF">
            {new Intl.NumberFormat('ru-ru').format(data.chance ?? 0)}%
          </Typography>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-x-2">
          <Icons.Id className="text-gray-accent" size="sm" />
          <Typography tag="span" className="font-golosF">
            #{data.id}
          </Typography>
        </div>
      </CardFooter>
    </Card>
  )
}

export { TableItemCard }
