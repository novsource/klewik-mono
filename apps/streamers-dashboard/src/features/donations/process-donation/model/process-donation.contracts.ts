import { ProcessedDonationSchema } from '~entities/donation/model'

export const processDonationSchema = ProcessedDonationSchema.shape.processData.partial()
