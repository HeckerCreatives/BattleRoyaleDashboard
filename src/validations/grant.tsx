import { VALID_QUEST_TYPES, VALID_REWARD_TYPES } from '@/api/rewards/quest'
import { z } from 'zod'

export const VALID = ['Daily', 'Weekly', 'Monthly', 'Story', 'Side', 'Challenge'] as const

export const grantSchema = z.object({
  type: z.string().nonempty('Select a type'),
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .int('Amount must be a whole number')
    .min(1, 'Amount must be at least 1'),
    userid: z.string().nonempty('Select a user'),
    itemid: z.string().optional()

})

export type GrantSchema = z.infer<typeof grantSchema>

