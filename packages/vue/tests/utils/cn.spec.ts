import { describe, expect, it } from 'vitest'

import { cn } from '../../src/utils/cn.js'

describe('cn', () => {
  it('merges conflicting ModeKit utilities', () => {
    expect(cn('mk:bg-blue-500 mk:bg-red-500', 'mk:p-4 mk:p-8')).toBe('mk:bg-red-500 mk:p-8')
  })

  it('merges conflicting application utilities', () => {
    expect(cn('bg-emerald-600 p-10', 'bg-fuchsia-600 p-12')).toBe('bg-fuchsia-600 p-12')
  })

  it('keeps ModeKit and application namespaces separate', () => {
    expect(cn('mk:bg-primary mk:p-4', 'bg-fuchsia-600 p-12')).toBe(
      'mk:bg-primary mk:p-4 bg-fuchsia-600 p-12',
    )
  })
})
