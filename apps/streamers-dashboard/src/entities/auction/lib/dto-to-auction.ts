import type { Auction } from '../model'

import type { AuctionDTO } from '~shared/api/http/auction'
import { AuctionDTOSchema } from '~shared/api/http/auction'

import { splitObject } from '~shared/utils/common'

const TransformAuctionDTOSchema = AuctionDTOSchema.transform<Auction>((dto) => {
  const [_, auction] = splitObject(dto, ['dropoutSlotsIds', 'processedDonationsIds', 'auctionUUID', 'slotsIds', 'wheelMode'])

  return { ...auction, uuid: dto.auctionUUID }
})

export const transformAuctionDTO = (auctionDTO: AuctionDTO): Auction => {
  return TransformAuctionDTOSchema.parse(auctionDTO, {
    error: () => {
      return { message: `Invalid attempt transform auction dto` }
    },
  })
}
