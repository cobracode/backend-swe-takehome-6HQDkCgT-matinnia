import request from 'supertest';
import app from '../../../src/index';

describe('API Integration', () => {
  it('GET /health should return ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});


// TODO: Add API integration tests for core endpoints [ttt.todo.tests.api]