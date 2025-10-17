import { Router, Request, Response } from 'express';
import { playerService } from '../services';
import { validationMiddleware } from '../middleware/validation';

const router = Router();

// Create Player
router.post('/', 
  validationMiddleware.validateCreatePlayer,
  async (req: Request<{}, {}, { name: string; email: string }>, res: Response) => {
    try {
      const { name, email } = req.body;
      const player = await playerService.createPlayer(name, email);
      res.status(201).json({ player, message: 'Player created successfully' });
    } catch (error) {
      console.error('Error creating player:', error);
      if (error instanceof Error && error.message.includes('Player name must be')) {
        return res.status(400).json({ error: 'Bad Request', message: error.message });
      }
      res.status(500).json({ error: 'Internal server error', message: 'Failed to create player' });
    }
  }
);

// Get Player
router.get('/:id', validationMiddleware.validateIdParam, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const player = await playerService.getPlayerById(id);
    if (!player) {
      return res.status(404).json({ error: 'Not found', message: 'Player not found' });
    }
    res.status(200).json({ player });
  } catch (error) {
    console.error('Error getting player:', error);
    res.status(500).json({ error: 'Internal server error', message: 'Failed to get player' });
  }
});

// Update Player
router.put('/:id',
  validationMiddleware.validateIdParam,
  validationMiddleware.validateUpdatePlayer,
  async (req: Request<{ id: string }, {}, { name?: string; email?: string }>, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const player = await playerService.updatePlayer(id, updates);
      res.status(200).json({ player, message: 'Player updated successfully' });
    } catch (error) {
      console.error('Error updating player:', error);
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          return res.status(404).json({ error: 'Not found', message: 'Player not found' });
        }
        if (error.message.includes('Player name must be') || error.message.includes('Email must be')) {
          return res.status(400).json({ error: 'Bad Request', message: error.message });
        }
      }
      res.status(500).json({ error: 'Internal server error', message: 'Failed to update player' });
    }
  }
);

// Delete Player
router.delete('/:id', validationMiddleware.validateIdParam, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await playerService.deletePlayer(id);
    res.status(200).json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: 'Not found', message: 'Player not found' });
      }
    }
    res.status(500).json({ error: 'Internal server error', message: 'Failed to delete player' });
  }
});

// Search for a Player
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { name, limit } = req.query;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Bad Request', message: 'Name query parameter is required' });
    }
    const limitNum = limit ? parseInt(limit as string, 10) : 10;
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ error: 'Bad Request', message: 'Limit must be a number between 1 and 100' });
    }
    const players = await playerService.searchPlayersByName(name, limitNum);
    res.status(200).json({ players, count: players.length });
  } catch (error) {
    console.error('Error searching players:', error);
    res.status(500).json({ error: 'Internal server error', message: 'Failed to search players' });
  }
});

// Get Player Stats
router.get('/:id/stats', validationMiddleware.validateIdParam, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stats = await playerService.getPlayerStats(id);
    res.status(200).json({ stats });
  } catch (error) {
    console.error('Error getting player stats:', error);
    if (error instanceof Error && error.message.includes('Player not found')) {
      return res.status(404).json({ error: 'Not found', message: 'Player not found' });
    }
    res.status(500).json({ error: 'Internal server error', message: 'Failed to get player statistics' });
  }
});

// List all players
router.get('/', async (req: Request, res: Response) => {
  try {
    const players = await playerService.getAllPlayers();
    res.status(200).json({ players, count: players.length });
  } catch (error) {
    console.error('Error getting players:', error);
    res.status(500).json({ error: 'Internal server error', message: 'Failed to get players' });
  }
});

export { router as playerRoutes };