export type LogLevel = 'info' | 'warn' | 'error'
export type LogContextValue = string | number | boolean | null
export type LogContext = Record<string, LogContextValue>

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: LogContext
}

const sensitiveContextKey =
  /password|token|secret|key|email|auth|authorization|header|file|path|content|url/i

const sensitiveValuePatterns = [
  /\bBearer\s+\S+/gi,
  /\bsb_(?:publishable|secret)_[A-Za-z0-9_-]+\b/gi,
  /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  /\bhttps?:\/\/\S+/gi,
  /(?:^|\s)(?:[A-Za-z0-9._-]+\/)+[A-Za-z0-9._-]+/g,
  /\b(?:password|access[_-]?token|refresh[_-]?token|api[_-]?key|secret)\s*[:=]\s*\S+/gi,
]

const sanitizeString = (value: string): string =>
  sensitiveValuePatterns.reduce(
    (sanitized, pattern) => sanitized.replace(pattern, '[REDACTED]'),
    value,
  ).slice(0, 500)

const sanitizeContext = (context: LogContext): LogContext =>
  Object.fromEntries(
    Object.entries(context)
      .filter(([key]) => !sensitiveContextKey.test(key))
      .map(([key, value]) => [
        key,
        typeof value === 'string' ? sanitizeString(value) : value,
      ]),
  )

const writeLog = (
  level: LogLevel,
  message: string,
  context?: LogContext,
): void => {
  if (level === 'info' && import.meta.env.PROD) return

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message: sanitizeString(message),
    ...(context ? { context: sanitizeContext(context) } : {}),
  }
  const serialized = JSON.stringify(entry)

  if (level === 'error') {
    console.error(serialized)
  } else if (level === 'warn') {
    console.warn(serialized)
  } else {
    console.info(serialized)
  }
}

export const logger = {
  info: (message: string, context?: LogContext): void =>
    writeLog('info', message, context),
  warn: (message: string, context?: LogContext): void =>
    writeLog('warn', message, context),
  error: (message: string, context?: LogContext): void =>
    writeLog('error', message, context),
}

export const getSafeErrorContext = (error: unknown): LogContext => {
  if (error && typeof error === 'object') {
    const context: LogContext = {}

    if ('message' in error && typeof error.message === 'string') {
      context.errorMessage = error.message
    }
    if ('code' in error && typeof error.code === 'string') {
      context.errorCode = error.code
    }

    return context
  }

  return typeof error === 'string' ? { errorMessage: error } : {}
}
