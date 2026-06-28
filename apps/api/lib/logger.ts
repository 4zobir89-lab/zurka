import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } }
      : undefined,
  base: { service: 'zurka-api', env: process.env.NODE_ENV ?? 'production' },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths:['*.password', '*.cardNumber', '*.cvv', 'req.headers.authorization'],
    censor: '[REDACTED]',
  },
});