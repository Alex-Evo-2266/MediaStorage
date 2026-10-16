import { afterEach, describe, expect, it, vi } from 'vitest'
import { logger } from './logger'

describe('logger', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('writes a structured info record with an ISO timestamp and context', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})

    logger.info('media.list.loaded', { operation: 'media.list', count: 3 })

    const entry = JSON.parse(info.mock.calls[0][0] as string) as {
      timestamp: string
      level: string
      message: string
      context: { operation: string; count: number }
    }

    expect(entry).toMatchObject({
      level: 'info',
      message: 'media.list.loaded',
      context: { operation: 'media.list', count: 3 },
    })
    expect(new Date(entry.timestamp).toISOString()).toBe(entry.timestamp)
  })

  it('writes warnings and errors at their matching console levels', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})

    logger.warn('media.upload.rejected')
    logger.error('media.upload.failed', { errorCode: 'storage_error' })

    expect(JSON.parse(warn.mock.calls[0][0] as string).level).toBe('warn')
    expect(JSON.parse(error.mock.calls[0][0] as string).level).toBe('error')
  })

  it('suppresses info in production and removes sensitive context fields', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.stubEnv('PROD', true)

    logger.info('should.not.log')
    logger.warn('auth.failed', {
      operation: 'auth.sign_in',
      email: 'user@example.com',
      accessToken: 'sensitive',
      details: 'Bearer secret-token',
    })

    expect(info).not.toHaveBeenCalled()
    const serialized = warn.mock.calls[0][0] as string
    expect(serialized).not.toContain('user@example.com')
    expect(serialized).not.toContain('sensitive')
    expect(serialized).not.toContain('secret-token')
    expect(JSON.parse(serialized).context).toEqual({
      operation: 'auth.sign_in',
      details: '[REDACTED]',
    })
  })
})
