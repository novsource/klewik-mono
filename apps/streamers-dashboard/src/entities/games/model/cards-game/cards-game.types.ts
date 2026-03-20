import type z from 'zod'

import type { CardsGameUnitSchema } from './cards-game.contracts'

export type CardsGameUnit = z.infer<typeof CardsGameUnitSchema>
