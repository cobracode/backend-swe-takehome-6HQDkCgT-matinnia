import { GameModel } from '../../../src/models/game';

describe('GameModel', () => {
  it('creates a game', async () => {
    const model = new GameModel();
    const game = await model.createGame('Test');
    expect(game.id).toBeDefined();
    expect(game.status).toBe('waiting');
  });
});