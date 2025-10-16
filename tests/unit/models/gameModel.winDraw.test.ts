import { GameModel } from '../../../src/models/game';
import { Player } from '../../../src/types';

describe('GameModel win/draw logic', () => {
  let model: GameModel;
  let game: any;
  let p1: Player;
  let p2: Player;

  beforeEach(async () => {
    model = new GameModel();
    game = await model.createGame('TestGame');
    p1 = { id: 'p1', name: 'P1', email: 'p1@test.com', stats: {} as any, createdAt: new Date(), updatedAt: new Date() };
    p2 = { id: 'p2', name: 'P2', email: 'p2@test.com', stats: {} as any, createdAt: new Date(), updatedAt: new Date() };
    await model.joinGame(game.id, p1);
    await model.joinGame(game.id, p2);
  });

  describe('Win Conditions', () => {
    it('detects horizontal win on row 0', async () => {
      await model.makeMove(game.id, 'p1', 0, 0);
      await model.makeMove(game.id, 'p2', 1, 0);
      await model.makeMove(game.id, 'p1', 0, 1);
      await model.makeMove(game.id, 'p2', 1, 1);
      const result = await model.makeMove(game.id, 'p1', 0, 2);
      
      expect(result.game.status).toBe('completed');
      expect(result.game.winnerId).toBe('p1');
    });

    it('detects horizontal win on row 1', async () => {
      await model.makeMove(game.id, 'p1', 1, 0);
      await model.makeMove(game.id, 'p2', 0, 0);
      await model.makeMove(game.id, 'p1', 1, 1);
      await model.makeMove(game.id, 'p2', 0, 1);
      const result = await model.makeMove(game.id, 'p1', 1, 2);
      
      expect(result.game.status).toBe('completed');
      expect(result.game.winnerId).toBe('p1');
    });

    it('detects horizontal win on row 2', async () => {
      await model.makeMove(game.id, 'p1', 2, 0);
      await model.makeMove(game.id, 'p2', 0, 0);
      await model.makeMove(game.id, 'p1', 2, 1);
      await model.makeMove(game.id, 'p2', 0, 1);
      const result = await model.makeMove(game.id, 'p1', 2, 2);
      
      expect(result.game.status).toBe('completed');
      expect(result.game.winnerId).toBe('p1');
    });

    it('detects vertical win on column 0', async () => {
      await model.makeMove(game.id, 'p1', 0, 0);
      await model.makeMove(game.id, 'p2', 0, 1);
      await model.makeMove(game.id, 'p1', 1, 0);
      await model.makeMove(game.id, 'p2', 1, 1);
      const result = await model.makeMove(game.id, 'p1', 2, 0);
      
      expect(result.game.status).toBe('completed');
      expect(result.game.winnerId).toBe('p1');
    });

    it('detects vertical win on column 1', async () => {
      await model.makeMove(game.id, 'p1', 0, 1);
      await model.makeMove(game.id, 'p2', 0, 0);
      await model.makeMove(game.id, 'p1', 1, 1);
      await model.makeMove(game.id, 'p2', 1, 0);
      const result = await model.makeMove(game.id, 'p1', 2, 1);
      
      expect(result.game.status).toBe('completed');
      expect(result.game.winnerId).toBe('p1');
    });

    it('detects vertical win on column 2', async () => {
      await model.makeMove(game.id, 'p1', 0, 2);
      await model.makeMove(game.id, 'p2', 0, 0);
      await model.makeMove(game.id, 'p1', 1, 2);
      await model.makeMove(game.id, 'p2', 1, 0);
      const result = await model.makeMove(game.id, 'p1', 2, 2);
      
      expect(result.game.status).toBe('completed');
      expect(result.game.winnerId).toBe('p1');
    });

    it('detects diagonal win (top-left to bottom-right)', async () => {
      await model.makeMove(game.id, 'p1', 0, 0);
      await model.makeMove(game.id, 'p2', 0, 1);
      await model.makeMove(game.id, 'p1', 1, 1);
      await model.makeMove(game.id, 'p2', 0, 2);
      const result = await model.makeMove(game.id, 'p1', 2, 2);
      
      expect(result.game.status).toBe('completed');
      expect(result.game.winnerId).toBe('p1');
    });

    it('detects diagonal win (top-right to bottom-left)', async () => {
      await model.makeMove(game.id, 'p1', 0, 2);
      await model.makeMove(game.id, 'p2', 0, 0);
      await model.makeMove(game.id, 'p1', 1, 1);
      await model.makeMove(game.id, 'p2', 1, 0);
      const result = await model.makeMove(game.id, 'p1', 2, 0);
      
      expect(result.game.status).toBe('completed');
      expect(result.game.winnerId).toBe('p1');
    });

    it('allows player 2 to win', async () => {
      await model.makeMove(game.id, 'p1', 0, 0);
      await model.makeMove(game.id, 'p2', 1, 0);
      await model.makeMove(game.id, 'p1', 0, 1);
      await model.makeMove(game.id, 'p2', 1, 1);
      await model.makeMove(game.id, 'p1', 2, 2);
      const result = await model.makeMove(game.id, 'p2', 1, 2);
      
      expect(result.game.status).toBe('completed');
      expect(result.game.winnerId).toBe('p2');
    });
  });

  describe('Draw Conditions', () => {
    it('detects a draw when board is full with no winner', async () => {
      // Create a specific draw scenario
      await model.makeMove(game.id, 'p1', 0, 0); // p1
      await model.makeMove(game.id, 'p2', 0, 1); // p2
      await model.makeMove(game.id, 'p1', 0, 2); // p1
      await model.makeMove(game.id, 'p2', 1, 0); // p2
      await model.makeMove(game.id, 'p1', 1, 2); // p1
      await model.makeMove(game.id, 'p2', 1, 1); // p2
      await model.makeMove(game.id, 'p1', 2, 0); // p1
      await model.makeMove(game.id, 'p2', 2, 2); // p2
      const result = await model.makeMove(game.id, 'p1', 2, 1); // p1 - final move
      
      expect(result.game.status).toBe('draw');
      expect(result.game.winnerId).toBeNull();
    });

    it('detects a draw with different board pattern', async () => {
      // Another draw scenario
      await model.makeMove(game.id, 'p1', 0, 0); // p1
      await model.makeMove(game.id, 'p2', 0, 2); // p2
      await model.makeMove(game.id, 'p1', 0, 1); // p1
      await model.makeMove(game.id, 'p2', 1, 0); // p2
      await model.makeMove(game.id, 'p1', 1, 2); // p1
      await model.makeMove(game.id, 'p2', 1, 1); // p2
      await model.makeMove(game.id, 'p1', 2, 0); // p1
      await model.makeMove(game.id, 'p2', 2, 1); // p2
      const result = await model.makeMove(game.id, 'p1', 2, 2); // p1 - final move
      
      expect(result.game.status).toBe('draw');
      expect(result.game.winnerId).toBeNull();
    });
  });

  describe('Game Continues', () => {
    it('continues game and switches players when no win or draw', async () => {
      await model.makeMove(game.id, 'p1', 0, 0);
      const result = await model.makeMove(game.id, 'p2', 0, 1);
      
      expect(result.game.status).toBe('active');
      expect(result.game.currentPlayerId).toBe('p1');
      expect(result.game.winnerId).toBeNull();
    });

    it('maintains correct turn order throughout game', async () => {
      // Make several moves and verify turn switching
      let result = await model.makeMove(game.id, 'p1', 0, 0);
      expect(result.game.currentPlayerId).toBe('p2');
      
      result = await model.makeMove(game.id, 'p2', 0, 1);
      expect(result.game.currentPlayerId).toBe('p1');
      
      result = await model.makeMove(game.id, 'p1', 0, 2);
      expect(result.game.currentPlayerId).toBe('p2');
      
      result = await model.makeMove(game.id, 'p2', 1, 0);
      expect(result.game.currentPlayerId).toBe('p1');
    });
  });

  describe('Error Conditions', () => {
    it('throws error for invalid row coordinates', async () => {
      await expect(model.makeMove(game.id, 'p1', -1, 0))
        .rejects.toThrow('Move coordinates must be between 0 and 2');
      
      await expect(model.makeMove(game.id, 'p1', 3, 0))
        .rejects.toThrow('Move coordinates must be between 0 and 2');
    });

    it('throws error for invalid column coordinates', async () => {
      await expect(model.makeMove(game.id, 'p1', 0, -1))
        .rejects.toThrow('Move coordinates must be between 0 and 2');
      
      await expect(model.makeMove(game.id, 'p1', 0, 3))
        .rejects.toThrow('Move coordinates must be between 0 and 2');
    });

    it('throws error when cell is already occupied', async () => {
      await model.makeMove(game.id, 'p1', 0, 0);
      await expect(model.makeMove(game.id, 'p2', 0, 0))
        .rejects.toThrow('Cell is already occupied');
    });

    it('throws error when not player\'s turn', async () => {
      await expect(model.makeMove(game.id, 'p2', 0, 0))
        .rejects.toThrow('Not your turn');
    });

    it('throws error when game is not active', async () => {
      const waitingGame = await model.createGame('WaitingGame');
      await model.joinGame(waitingGame.id, p1);
      
      await expect(model.makeMove(waitingGame.id, 'p1', 0, 0))
        .rejects.toThrow('Game is not active');
    });

    it('throws error when player is not in game', async () => {
      const p3: Player = { id: 'p3', name: 'P3', email: 'p3@test.com', stats: {} as any, createdAt: new Date(), updatedAt: new Date() };
      
      await expect(model.makeMove(game.id, 'p3', 0, 0))
        .rejects.toThrow('Player not found in game');
    });

    it('throws error when game is not found', async () => {
      await expect(model.makeMove('nonexistent-game-id', 'p1', 0, 0))
        .rejects.toThrow('Game not found');
    });
  });

  describe('Move Tracking', () => {
    it('correctly tracks moves in game history', async () => {
      const result1 = await model.makeMove(game.id, 'p1', 0, 0);
      
      expect(result1.game.moves).toHaveLength(1);
      expect(result1.move.playerId).toBe('p1');
      expect(result1.move.row).toBe(0);
      expect(result1.move.col).toBe(0);

      const result2 = await model.makeMove(game.id, 'p2', 0, 1);
      
      expect(result2.game.moves).toHaveLength(2);
      expect(result2.move.playerId).toBe('p2');
      expect(result2.move.row).toBe(0);
      expect(result2.move.col).toBe(1);
    });

    it('updates game timestamp on each move', async () => {
      const initialTime = game.updatedAt.getTime();
      
      await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
      await model.makeMove(game.id, 'p1', 0, 0);
      
      const updatedGame = await model.getGameById(game.id);
      expect(updatedGame!.updatedAt.getTime()).toBeGreaterThan(initialTime);
    });
  });
});