import { Router, Request, Response } from 'express'
import { playerService } from '../services'
import { validationMiddleware } from '../middleware/validation'

const router = Router()

// Leaderboard by wins (with pagination and filters)
router.get(
  '/',
  validationMiddleware.validateLeaderboardQuery,
  async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10

      const filters: {
        minGames?: number
        playerName?: string
        dateFrom?: Date
        dateTo?: Date
      } = {}

      if (req.query.minGames) {
        filters.minGames = parseInt(req.query.minGames as string)
      }
      if (req.query.playerName) {
        filters.playerName = req.query.playerName as string
      }
      if (req.query.dateFrom) {
        filters.dateFrom = new Date(req.query.dateFrom as string)
      }
      if (req.query.dateTo) {
        filters.dateTo = new Date(req.query.dateTo as string)
      }

      const result = await playerService.getPlayersByWinCountPaginated(
        page,
        limit,
        filters
      )

      res.status(200).json({
        leaderboard: result.players,
        type: 'wins',
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
          hasNext: result.page < result.totalPages,
          hasPrev: result.page > 1
        },
        filters: Object.keys(filters).length > 0 ? filters : undefined
      })
    } catch (error) {
      console.error('Error getting leaderboard:', error)
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to get leaderboard'
      })
    }
  }
)

// Leaderboard by efficiency (with pagination and filters)
router.get(
  '/efficiency',
  validationMiddleware.validateLeaderboardQuery,
  async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10

      const filters: {
        minGames?: number
        playerName?: string
        dateFrom?: Date
        dateTo?: Date
      } = {}

      if (req.query.minGames) {
        filters.minGames = parseInt(req.query.minGames as string)
      }
      if (req.query.playerName) {
        filters.playerName = req.query.playerName as string
      }
      if (req.query.dateFrom) {
        filters.dateFrom = new Date(req.query.dateFrom as string)
      }
      if (req.query.dateTo) {
        filters.dateTo = new Date(req.query.dateTo as string)
      }

      const result = await playerService.getPlayersByEfficiencyPaginated(
        page,
        limit,
        filters
      )

      res.status(200).json({
        leaderboard: result.players,
        type: 'efficiency',
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
          hasNext: result.page < result.totalPages,
          hasPrev: result.page > 1
        },
        filters: Object.keys(filters).length > 0 ? filters : undefined
      })
    } catch (error) {
      console.error('Error getting efficiency leaderboard:', error)
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to get efficiency leaderboard'
      })
    }
  }
)

export { router as leaderboardRoutes }
