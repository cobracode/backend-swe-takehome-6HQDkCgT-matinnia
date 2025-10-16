import request from 'supertest';
import app from '../../src/index';

describe('API Integration', () => {
  describe('Health Check', () => {
    it('GET /health should return ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.timestamp).toBeDefined();
      expect(res.body.uptime).toBeDefined();
      expect(res.body.memory).toBeDefined();
      expect(res.body.version).toBeDefined();
    });
  });

  describe('Games API', () => {
    let gameId: string;
    let playerId: string;

    describe('POST /games', () => {
      it('should create a new game with valid name', async () => {
        const gameData = { name: 'Test Game' };
        const res = await request(app)
          .post('/games')
          .send(gameData);
        
        expect(res.status).toBe(201);
        expect(res.body.game).toBeDefined();
        expect(res.body.game.name).toBe('Test Game');
        expect(res.body.game.id).toBeDefined();
        expect(res.body.message).toBe('Game created successfully');
        
        gameId = res.body.game.id;
      });

      it('should return 400 for invalid game name', async () => {
        const gameData = { name: '' };
        const res = await request(app)
          .post('/games')
          .send(gameData);
        
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Bad Request');
      });

      it('should return 400 for missing game name', async () => {
        const res = await request(app)
          .post('/games')
          .send({});
        
        expect(res.status).toBe(400);
      });
    });

    describe('GET /games', () => {
      it('should return list of games', async () => {
        const res = await request(app).get('/games');
        
        expect(res.status).toBe(200);
        expect(res.body.games).toBeDefined();
        expect(Array.isArray(res.body.games)).toBe(true);
        expect(res.body.count).toBeDefined();
      });

      it('should filter games by status', async () => {
        const res = await request(app)
          .get('/games')
          .query({ status: 'waiting' });
        
        expect(res.status).toBe(200);
        expect(res.body.games).toBeDefined();
        expect(Array.isArray(res.body.games)).toBe(true);
      });
    });

    describe('GET /games/:id', () => {
      it('should return game by ID', async () => {
        const res = await request(app).get(`/games/${gameId}`);
        
        expect(res.status).toBe(200);
        expect(res.body.game).toBeDefined();
        expect(res.body.game.id).toBe(gameId);
      });

      it('should return 404 for non-existent game', async () => {
        const res = await request(app).get('/games/non-existent-id');
        
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Not found');
      });
    });

    describe('GET /games/:id/status', () => {
      it('should return game status', async () => {
        const res = await request(app).get(`/games/${gameId}/status`);
        
        expect(res.status).toBe(200);
        expect(res.body.status).toBeDefined();
      });

      it('should return 404 for non-existent game status', async () => {
        const res = await request(app).get('/games/non-existent-id/status');
        
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Not found');
      });
    });

    describe('POST /games/:id/join', () => {
      it('should return 404 for non-existent player', async () => {
        const joinData = { playerId: 'non-existent-player' };
        const res = await request(app)
          .post(`/games/${gameId}/join`)
          .send(joinData);
        
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Not found');
      });

      it('should return 400 for missing playerId', async () => {
        const res = await request(app)
          .post(`/games/${gameId}/join`)
          .send({});
        
        expect(res.status).toBe(400);
      });
    });

    describe('POST /games/:id/moves', () => {
      it('should return 400 for invalid move data', async () => {
        const moveData = { playerId: 'test', row: 0, col: 0 };
        const res = await request(app)
          .post(`/games/${gameId}/moves`)
          .send(moveData);
        
        expect(res.status).toBe(400);
      });

      it('should return 400 for missing move data', async () => {
        const res = await request(app)
          .post(`/games/${gameId}/moves`)
          .send({});
        
        expect(res.status).toBe(400);
      });
    });

    describe('GET /games/:id/moves', () => {
      it('should return valid moves for game', async () => {
        const res = await request(app).get(`/games/${gameId}/moves`);
        
        expect(res.status).toBe(200);
        expect(res.body.validMoves).toBeDefined();
        expect(Array.isArray(res.body.validMoves)).toBe(true);
        expect(res.body.count).toBeDefined();
      });

      it('should return 404 for non-existent game moves', async () => {
        const res = await request(app).get('/games/non-existent-id/moves');
        
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Not found');
      });
    });

    describe('GET /games/:id/stats', () => {
      it('should return game statistics', async () => {
        const res = await request(app).get(`/games/${gameId}/stats`);
        
        expect(res.status).toBe(200);
        expect(res.body.stats).toBeDefined();
      });

      it('should return 404 for non-existent game stats', async () => {
        const res = await request(app).get('/games/non-existent-id/stats');
        
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Not found');
      });
    });

    describe('DELETE /games/:id', () => {
      it('should delete game successfully', async () => {
        const res = await request(app).delete(`/games/${gameId}`);
        
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Game deleted successfully');
      });

      it('should return 404 for non-existent game deletion', async () => {
        const res = await request(app).delete('/games/non-existent-id');
        
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Not found');
      });
    });
  });

  describe('Leaderboard API', () => {
    describe('GET /leaderboard', () => {
      it('should return leaderboard by wins', async () => {
        const res = await request(app).get('/leaderboard');
        
        expect(res.status).toBe(200);
        expect(res.body.leaderboard).toBeDefined();
        expect(Array.isArray(res.body.leaderboard)).toBe(true);
        expect(res.body.type).toBe('wins');
      });
    });

    describe('GET /leaderboard/efficiency', () => {
      it('should return leaderboard by efficiency', async () => {
        const res = await request(app).get('/leaderboard/efficiency');
        
        expect(res.status).toBe(200);
        expect(res.body.leaderboard).toBeDefined();
        expect(Array.isArray(res.body.leaderboard)).toBe(true);
        expect(res.body.type).toBe('efficiency');
      });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent endpoints', async () => {
      const res = await request(app).get('/non-existent-endpoint');
      
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Endpoint not found');
    });

    it('should handle malformed JSON', async () => {
      const res = await request(app)
        .post('/games')
        .set('Content-Type', 'application/json')
        .send('invalid json');
      
      expect(res.status).toBe(400);
    });
  });

  describe('CORS and Security Headers', () => {
    it('should include CORS headers', async () => {
      const res = await request(app).get('/health');
      
      expect(res.headers['access-control-allow-origin']).toBeDefined();
    });

    it('should include security headers from helmet', async () => {
      const res = await request(app).get('/health');
      
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBeDefined();
    });
  });
});