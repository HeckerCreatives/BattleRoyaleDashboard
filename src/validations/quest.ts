import { VALID_QUEST_TYPES, VALID_REWARD_TYPES } from '@/api/rewards/quest'
import { z } from 'zod'

export const VALID = ['Daily', 'Weekly', 'Monthly', 'Story', 'Side', 'Challenge'] as const

const rewardSchema = z.object({
  type: z.enum(VALID_REWARD_TYPES, {
    errorMap: () => ({ message: 'Please select a valid reward type' }),
  }),
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .int('Amount must be a whole number')
    .min(1, 'Amount must be at least 1'),
    itemid: z.string().optional()

})

export const questSchema = z.object({
  id: z.string().optional(),

  questid: z.string().min(1, 'Id is required'),

  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or fewer'),

  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be 500 characters or fewer'),

  type: z.enum(VALID_QUEST_TYPES, {
    errorMap: () => ({ message: 'Please select a valid quest type' }),
  }),

  target: z
    .number({ invalid_type_error: 'Target must be a number' })
    .int('Target must be a whole number')
    .min(0, 'Target must be at least 0'),

  rewards: z
    .array(rewardSchema)
    .min(1, 'Select at least one reward'),

  isSkippable: z.boolean(),
  isActive: z.boolean(),
})

export type QuestSchema = z.infer<typeof questSchema>
export type RewardSchema = z.infer<typeof rewardSchema>

