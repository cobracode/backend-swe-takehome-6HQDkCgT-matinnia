import rateLimit from 'express-rate-limit'

// Basic rate limiting
const rateLimitWindowMs = parseInt(
  process.env.RATE_LIMIT_WINDOW_MS || '60000',
  10
) // 1 minute
const rateLimitMax = parseInt(process.env.RATE_LIMIT_MAX || '100', 10) // 100 reqs/min by default

export const rateLimiter = rateLimit({
  windowMs: rateLimitWindowMs,
  max: rateLimitMax,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: 'draft-7',
  legacyHeaders: false
})
