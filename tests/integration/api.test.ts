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