import { Request, Response, NextFunction } from 'express'

const isValidUuid = (value: unknown): boolean => {
  if (typeof value !== 'string') return false
  // Generic UUID v1-v5 pattern (lower/upper allowed)
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
  return uuidRegex.test(value)
}

export const validationMiddleware = {
  validateCreateGame: (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body || {}
    if (name !== undefined && typeof name !== 'string') {
      return res
        .status(400)
        .json({ error: 'Bad Request', message: 'Name must be a string' })
    }
    if (typeof name === 'string' && name.trim().length > 100) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Game name must be 100 characters or less'
      })
    }
    next()
  },

  validateJoinGame: (req: Request, res: Response, next: NextFunction) => {
    const { playerId } = req.body || {}
    if (!playerId || typeof playerId !== 'string') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'playerId is required and must be a string'
      })
    }
    if (!isValidUuid(playerId)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'playerId must be a valid UUID'
      })
    }
    next()
  },

  validateMakeMove: (req: Request, res: Response, next: NextFunction) => {
    const { playerId, row, col } = req.body || {}
    if (!playerId || typeof playerId !== 'string') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'playerId is required and must be a string'
      })
    }
    if (!isValidUuid(playerId)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'playerId must be a valid UUID'
      })
    }
    const isInt = (n: any) => Number.isInteger(n)
    if (!isInt(row) || !isInt(col)) {
      return res
        .status(400)
        .json({ error: 'Bad Request', message: 'row and col must be integers' })
    }
    if (row < 0 || row > 2 || col < 0 || col > 2) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Move coordinates must be between 0 and 2'
      })
    }
    next()
  },

  validateCreatePlayer: (req: Request, res: Response, next: NextFunction) => {
    const { name, email } = req.body || {}
    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Name is required and must be a string'
      })
    }
    if (name.trim().length === 0) {
      return res
        .status(400)
        .json({ error: 'Bad Request', message: 'Name cannot be empty' })
    }
    if (name.trim().length > 100) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Name must be 100 characters or less'
      })
    }
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email is required and must be a string'
      })
    }
    if (email.trim().length === 0) {
      return res
        .status(400)
        .json({ error: 'Bad Request', message: 'Email cannot be empty' })
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email must be a valid email address'
      })
    }
    next()
  },

  validateUpdatePlayer: (req: Request, res: Response, next: NextFunction) => {
    const { name, email } = req.body || {}

    // At least one field must be provided
    if (name === undefined && email === undefined) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'At least one field (name or email) must be provided'
      })
    }

    if (name !== undefined) {
      if (typeof name !== 'string') {
        return res
          .status(400)
          .json({ error: 'Bad Request', message: 'Name must be a string' })
      }
      if (name.trim().length === 0) {
        return res
          .status(400)
          .json({ error: 'Bad Request', message: 'Name cannot be empty' })
      }
      if (name.trim().length > 100) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Name must be 100 characters or less'
        })
      }
    }

    if (email !== undefined) {
      if (typeof email !== 'string') {
        return res
          .status(400)
          .json({ error: 'Bad Request', message: 'Email must be a string' })
      }
      if (email.trim().length === 0) {
        return res
          .status(400)
          .json({ error: 'Bad Request', message: 'Email cannot be empty' })
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Email must be a valid email address'
        })
      }
    }

    next()
  },

  validateIdParam: (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params || ({} as { id?: string })
    if (!id || typeof id !== 'string') {
      return res
        .status(400)
        .json({ error: 'Bad Request', message: 'Invalid ID parameter' })
    }
    if (!isValidUuid(id)) {
      return res
        .status(400)
        .json({ error: 'Bad Request', message: 'ID must be a valid UUID' })
    }
    next()
  },

  validateLeaderboardQuery: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { page, limit, minGames, playerName, dateFrom, dateTo } = req.query

    // Validate page parameter
    if (page !== undefined) {
      const pageNum = parseInt(page as string, 10)
      if (isNaN(pageNum) || pageNum < 1) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Page must be a positive integer'
        })
      }
    }

    // Validate limit parameter
    if (limit !== undefined) {
      const limitNum = parseInt(limit as string, 10)
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Limit must be a positive integer between 1 and 100'
        })
      }
    }

    // Validate minGames parameter
    if (minGames !== undefined) {
      const minGamesNum = parseInt(minGames as string, 10)
      if (isNaN(minGamesNum) || minGamesNum < 0) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'minGames must be a non-negative integer'
        })
      }
    }

    // Validate playerName parameter
    if (playerName !== undefined) {
      if (typeof playerName !== 'string' || playerName.trim().length === 0) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'playerName must be a non-empty string'
        })
      }
      if (playerName.length > 100) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'playerName must be 100 characters or less'
        })
      }
    }

    // Validate dateFrom parameter
    if (dateFrom !== undefined) {
      const dateFromParsed = new Date(dateFrom as string)
      if (isNaN(dateFromParsed.getTime())) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'dateFrom must be a valid ISO date string'
        })
      }
    }

    // Validate dateTo parameter
    if (dateTo !== undefined) {
      const dateToParsed = new Date(dateTo as string)
      if (isNaN(dateToParsed.getTime())) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'dateTo must be a valid ISO date string'
        })
      }
    }

    // Validate date range
    if (dateFrom !== undefined && dateTo !== undefined) {
      const dateFromParsed = new Date(dateFrom as string)
      const dateToParsed = new Date(dateTo as string)
      if (dateFromParsed > dateToParsed) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'dateFrom must be before or equal to dateTo'
        })
      }
    }

    next()
  }
}
