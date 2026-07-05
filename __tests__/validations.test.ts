import { describe, it, expect } from 'vitest'
import {
  idSchema,
  createWaitlistSchema,
  updateWaitlistSchema,
  joinWaitlistSchema,
  createMilestoneSchema,
  paginationSchema,
} from '@/lib/validations'

// ---------------------------------------------------------------------------
// idSchema
// ---------------------------------------------------------------------------
describe('idSchema', () => {
  it('accepts a valid UUID v4', () => {
    const result = idSchema.safeParse('550e8400-e29b-41d4-a716-446655440000')
    expect(result.success).toBe(true)
  })

  it('accepts UUID v1', () => {
    const result = idSchema.safeParse('6ba7b810-9dad-11d1-80b4-00c04fd430c8')
    expect(result.success).toBe(true)
  })

  it('accepts the nil UUID', () => {
    const result = idSchema.safeParse('00000000-0000-0000-0000-000000000000')
    expect(result.success).toBe(true)
  })

  it('rejects a plain string', () => {
    const result = idSchema.safeParse('not-a-uuid')
    expect(result.success).toBe(false)
  })

  it('rejects an empty string', () => {
    const result = idSchema.safeParse('')
    expect(result.success).toBe(false)
  })

  it('rejects a number', () => {
    const result = idSchema.safeParse(123)
    expect(result.success).toBe(false)
  })

  it('rejects UUID without hyphens', () => {
    const result = idSchema.safeParse('550e8400e29b41d4a716446655440000')
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// createWaitlistSchema
// ---------------------------------------------------------------------------
describe('createWaitlistSchema', () => {
  it('accepts valid input with all fields', () => {
    const result = createWaitlistSchema.safeParse({
      name: 'My Waitlist',
      description: 'A cool product launch',
      template: 'gradient',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('My Waitlist')
      expect(result.data.template).toBe('gradient')
    }
  })

  it('defaults template to "minimal" when omitted', () => {
    const result = createWaitlistSchema.safeParse({ name: 'Test' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.template).toBe('minimal')
    }
  })

  it('accepts null description', () => {
    const result = createWaitlistSchema.safeParse({
      name: 'Test',
      description: null,
    })
    expect(result.success).toBe(true)
  })

  it('accepts omitted description', () => {
    const result = createWaitlistSchema.safeParse({ name: 'Test' })
    expect(result.success).toBe(true)
  })

  it('rejects missing name', () => {
    const result = createWaitlistSchema.safeParse({ template: 'dark' })
    expect(result.success).toBe(false)
  })

  it('rejects empty name', () => {
    const result = createWaitlistSchema.safeParse({ name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects name over 100 chars', () => {
    const result = createWaitlistSchema.safeParse({ name: 'x'.repeat(101) })
    expect(result.success).toBe(false)
  })

  it('accepts name at exactly 100 chars', () => {
    const result = createWaitlistSchema.safeParse({ name: 'x'.repeat(100) })
    expect(result.success).toBe(true)
  })

  it('rejects description over 500 chars', () => {
    const result = createWaitlistSchema.safeParse({
      name: 'Test',
      description: 'x'.repeat(501),
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid template value', () => {
    const result = createWaitlistSchema.safeParse({
      name: 'Test',
      template: 'neon',
    })
    expect(result.success).toBe(false)
  })

  it.each(['minimal', 'gradient', 'dark'] as const)(
    'accepts template "%s"',
    (template) => {
      const result = createWaitlistSchema.safeParse({ name: 'Test', template })
      expect(result.success).toBe(true)
    }
  )
})

// ---------------------------------------------------------------------------
// updateWaitlistSchema
// ---------------------------------------------------------------------------
describe('updateWaitlistSchema', () => {
  it('accepts an empty object (all fields optional)', () => {
    const result = updateWaitlistSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('accepts partial update with name only', () => {
    const result = updateWaitlistSchema.safeParse({ name: 'Updated' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Updated')
    }
  })

  it('accepts settings as a record of unknown values', () => {
    const result = updateWaitlistSchema.safeParse({
      settings: { brandColor: '#ff0000', showCount: true, limit: 500 },
    })
    expect(result.success).toBe(true)
  })

  it('rejects name over 100 chars', () => {
    const result = updateWaitlistSchema.safeParse({ name: 'x'.repeat(101) })
    expect(result.success).toBe(false)
  })

  it('rejects empty name (min 1)', () => {
    const result = updateWaitlistSchema.safeParse({ name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects description over 500 chars', () => {
    const result = updateWaitlistSchema.safeParse({
      description: 'x'.repeat(501),
    })
    expect(result.success).toBe(false)
  })

  it('accepts null description', () => {
    const result = updateWaitlistSchema.safeParse({ description: null })
    expect(result.success).toBe(true)
  })

  it('rejects invalid template', () => {
    const result = updateWaitlistSchema.safeParse({ template: 'invalid' })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// joinWaitlistSchema
// ---------------------------------------------------------------------------
describe('joinWaitlistSchema', () => {
  it('accepts valid input with all fields', () => {
    const result = joinWaitlistSchema.safeParse({
      slug: 'my-product',
      email: 'user@example.com',
      name: 'John Doe',
      ref: 'abc123',
    })
    expect(result.success).toBe(true)
  })

  it('accepts minimal required fields only', () => {
    const result = joinWaitlistSchema.safeParse({
      slug: 'my-product',
      email: 'user@example.com',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing slug', () => {
    const result = joinWaitlistSchema.safeParse({
      email: 'user@example.com',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty slug', () => {
    const result = joinWaitlistSchema.safeParse({
      slug: '',
      email: 'user@example.com',
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing email', () => {
    const result = joinWaitlistSchema.safeParse({ slug: 'test' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email format', () => {
    const result = joinWaitlistSchema.safeParse({
      slug: 'test',
      email: 'not-an-email',
    })
    expect(result.success).toBe(false)
  })

  it('rejects email without domain', () => {
    const result = joinWaitlistSchema.safeParse({
      slug: 'test',
      email: 'user@',
    })
    expect(result.success).toBe(false)
  })

  it('accepts null name and ref', () => {
    const result = joinWaitlistSchema.safeParse({
      slug: 'test',
      email: 'a@b.com',
      name: null,
      ref: null,
    })
    expect(result.success).toBe(true)
  })

  it('rejects name over 100 chars', () => {
    const result = joinWaitlistSchema.safeParse({
      slug: 'test',
      email: 'a@b.com',
      name: 'x'.repeat(101),
    })
    expect(result.success).toBe(false)
  })

  it('rejects ref over 50 chars', () => {
    const result = joinWaitlistSchema.safeParse({
      slug: 'test',
      email: 'a@b.com',
      ref: 'x'.repeat(51),
    })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// createMilestoneSchema
// ---------------------------------------------------------------------------
describe('createMilestoneSchema', () => {
  it('accepts valid input', () => {
    const result = createMilestoneSchema.safeParse({
      referral_count: 5,
      reward_title: 'Early Access',
      reward_description: 'Get early access to the product',
    })
    expect(result.success).toBe(true)
  })

  it('coerces string referral_count to number (FormData behavior)', () => {
    const result = createMilestoneSchema.safeParse({
      referral_count: '10',
      reward_title: 'VIP',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.referral_count).toBe(10)
      expect(typeof result.data.referral_count).toBe('number')
    }
  })

  it('rejects referral_count of 0', () => {
    const result = createMilestoneSchema.safeParse({
      referral_count: 0,
      reward_title: 'Nope',
    })
    expect(result.success).toBe(false)
  })

  it('rejects negative referral_count', () => {
    const result = createMilestoneSchema.safeParse({
      referral_count: -1,
      reward_title: 'Nope',
    })
    expect(result.success).toBe(false)
  })

  it('rejects non-integer referral_count', () => {
    const result = createMilestoneSchema.safeParse({
      referral_count: 2.5,
      reward_title: 'Half?',
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing reward_title', () => {
    const result = createMilestoneSchema.safeParse({
      referral_count: 3,
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty reward_title', () => {
    const result = createMilestoneSchema.safeParse({
      referral_count: 3,
      reward_title: '',
    })
    expect(result.success).toBe(false)
  })

  it('rejects reward_title over 200 chars', () => {
    const result = createMilestoneSchema.safeParse({
      referral_count: 1,
      reward_title: 'x'.repeat(201),
    })
    expect(result.success).toBe(false)
  })

  it('accepts reward_title at exactly 200 chars', () => {
    const result = createMilestoneSchema.safeParse({
      referral_count: 1,
      reward_title: 'x'.repeat(200),
    })
    expect(result.success).toBe(true)
  })

  it('accepts omitted reward_description', () => {
    const result = createMilestoneSchema.safeParse({
      referral_count: 5,
      reward_title: 'Badge',
    })
    expect(result.success).toBe(true)
  })

  it('accepts null reward_description', () => {
    const result = createMilestoneSchema.safeParse({
      referral_count: 5,
      reward_title: 'Badge',
      reward_description: null,
    })
    expect(result.success).toBe(true)
  })

  it('rejects reward_description over 1000 chars', () => {
    const result = createMilestoneSchema.safeParse({
      referral_count: 1,
      reward_title: 'Test',
      reward_description: 'x'.repeat(1001),
    })
    expect(result.success).toBe(false)
  })

  it('rejects non-numeric referral_count string', () => {
    const result = createMilestoneSchema.safeParse({
      referral_count: 'abc',
      reward_title: 'Test',
    })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// paginationSchema
// ---------------------------------------------------------------------------
describe('paginationSchema', () => {
  it('defaults page=1 and pageSize=50 when omitted', () => {
    const result = paginationSchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.page).toBe(1)
      expect(result.data.pageSize).toBe(50)
    }
  })

  it('coerces string values to numbers (query string behavior)', () => {
    const result = paginationSchema.safeParse({ page: '3', pageSize: '20' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.page).toBe(3)
      expect(result.data.pageSize).toBe(20)
    }
  })

  it('rejects page < 1', () => {
    const result = paginationSchema.safeParse({ page: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects negative page', () => {
    const result = paginationSchema.safeParse({ page: -1 })
    expect(result.success).toBe(false)
  })

  it('rejects pageSize > 100', () => {
    const result = paginationSchema.safeParse({ pageSize: 101 })
    expect(result.success).toBe(false)
  })

  it('rejects pageSize < 1', () => {
    const result = paginationSchema.safeParse({ pageSize: 0 })
    expect(result.success).toBe(false)
  })

  it('accepts pageSize at boundary values (1 and 100)', () => {
    const r1 = paginationSchema.safeParse({ pageSize: 1 })
    const r100 = paginationSchema.safeParse({ pageSize: 100 })
    expect(r1.success).toBe(true)
    expect(r100.success).toBe(true)
  })

  it('rejects non-integer page', () => {
    const result = paginationSchema.safeParse({ page: 1.5 })
    expect(result.success).toBe(false)
  })
})
