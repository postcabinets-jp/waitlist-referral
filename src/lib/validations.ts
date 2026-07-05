import { z } from 'zod'

export const idSchema = z.string().uuid('無効なIDです')

export const createWaitlistSchema = z.object({
  name: z.string().min(1, 'ウェイトリスト名は必須です').max(100, '100文字以内'),
  description: z.string().max(500, '500文字以内').optional().nullable(),
  template: z.enum(['minimal', 'gradient', 'dark']).default('minimal'),
})

export const updateWaitlistSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  template: z.enum(['minimal', 'gradient', 'dark']).optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
})

export const joinWaitlistSchema = z.object({
  slug: z.string().min(1, 'スラッグは必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  name: z.string().max(100).optional().nullable(),
  ref: z.string().max(50).optional().nullable(),
})

export const createMilestoneSchema = z.object({
  referral_count: z.coerce.number().int().min(1, '紹介数は1以上'),
  reward_title: z.string().min(1, '報酬タイトルは必須です').max(200, '200文字以内'),
  reward_description: z.string().max(1000, '1000文字以内').optional().nullable(),
})

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
})
