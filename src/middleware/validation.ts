import { Request, Response, NextFunction } from 'express';

export const validationMiddleware = {
  validateCreateGame: (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body || {};
    if (name !== undefined && typeof name !== 'string') {
      return res.status(400).json({ error: 'Bad Request', message: 'Name must be a string' });
    }
    if (typeof name === 'string' && name.trim().length > 100) {
      return res.status(400).json({ error: 'Bad Request', message: 'Game name must be 100 characters or less' });
    }
    next();
  },

  validateJoinGame: (req: Request, res: Response, next: NextFunction) => {
    const { playerId } = req.body || {};
    if (!playerId || typeof playerId !== 'string') {
      return res.status(400).json({ error: 'Bad Request', message: 'playerId is required and must be a string' });
    }
    next();
  },

  validateMakeMove: (req: Request, res: Response, next: NextFunction) => {
    const { playerId, row, col } = req.body || {};
    if (!playerId || typeof playerId !== 'string') {
      return res.status(400).json({ error: 'Bad Request', message: 'playerId is required and must be a string' });
    }
    const isInt = (n: any) => Number.isInteger(n);
    if (!isInt(row) || !isInt(col)) {
      return res.status(400).json({ error: 'Bad Request', message: 'row and col must be integers' });
    }
    if (row < 0 || row > 2 || col < 0 || col > 2) {
      return res.status(400).json({ error: 'Bad Request', message: 'Move coordinates must be between 0 and 2' });
    }
    next();
  },

  validateCreatePlayer: (req: Request, res: Response, next: NextFunction) => {
    const { name, email } = req.body || {};
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Bad Request', message: 'Name is required and must be a string' });
    }
    if (name.trim().length === 0) {
      return res.status(400).json({ error: 'Bad Request', message: 'Name cannot be empty' });
    }
    if (name.trim().length > 100) {
      return res.status(400).json({ error: 'Bad Request', message: 'Name must be 100 characters or less' });
    }
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Bad Request', message: 'Email is required and must be a string' });
    }
    if (email.trim().length === 0) {
      return res.status(400).json({ error: 'Bad Request', message: 'Email cannot be empty' });
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Bad Request', message: 'Email must be a valid email address' });
    }
    next();
  },

  validateUpdatePlayer: (req: Request, res: Response, next: NextFunction) => {
    const { name, email } = req.body || {};
    
    // At least one field must be provided
    if (name === undefined && email === undefined) {
      return res.status(400).json({ error: 'Bad Request', message: 'At least one field (name or email) must be provided' });
    }
    
    if (name !== undefined) {
      if (typeof name !== 'string') {
        return res.status(400).json({ error: 'Bad Request', message: 'Name must be a string' });
      }
      if (name.trim().length === 0) {
        return res.status(400).json({ error: 'Bad Request', message: 'Name cannot be empty' });
      }
      if (name.trim().length > 100) {
        return res.status(400).json({ error: 'Bad Request', message: 'Name must be 100 characters or less' });
      }
    }
    
    if (email !== undefined) {
      if (typeof email !== 'string') {
        return res.status(400).json({ error: 'Bad Request', message: 'Email must be a string' });
      }
      if (email.trim().length === 0) {
        return res.status(400).json({ error: 'Bad Request', message: 'Email cannot be empty' });
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Bad Request', message: 'Email must be a valid email address' });
      }
    }
    
    next();
  },
};


// TODO: Harden route validation for IDs and payloads [ttt.todo.route.validation]