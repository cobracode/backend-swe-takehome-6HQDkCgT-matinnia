import { PlayerModel } from '../../../src/models/player';
import { Player, PlayerStats } from '../../../src/types';

describe('PlayerModel', () => {
  let model: PlayerModel;

  beforeEach(() => {
    model = new PlayerModel();
  });

  describe('createPlayer', () => {
    it('creates a player with valid data', async () => {
      const player = await model.createPlayer('Alice', 'alice@example.com');
      
      expect(player.id).toBeDefined();
      expect(player.name).toBe('Alice');
      expect(player.email).toBe('alice@example.com');
      expect(player.stats).toEqual({
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        gamesDrawn: 0,
        totalMoves: 0,
        averageMovesPerWin: 0,
        winRate: 0,
        efficiency: 0,
      });
      expect(player.createdAt).toBeInstanceOf(Date);
      expect(player.updatedAt).toBeInstanceOf(Date);
    });

    it('trims whitespace from name and email', async () => {
      const player = await model.createPlayer('  Bob  ', 'bob@example.com');
      
      expect(player.name).toBe('Bob');
      expect(player.email).toBe('bob@example.com');
    });

    it('normalizes email to lowercase', async () => {
      const player = await model.createPlayer('Charlie', 'CHARLIE@EXAMPLE.COM');
      
      expect(player.email).toBe('charlie@example.com');
    });

    it('throws error for empty name', async () => {
      await expect(model.createPlayer('', 'test@example.com'))
        .rejects.toThrow('Player name must be a non-empty string');
    });

    it('throws error for whitespace-only name', async () => {
      await expect(model.createPlayer('   ', 'test@example.com'))
        .rejects.toThrow('Player name must be a non-empty string');
    });

    it('throws error for non-string name', async () => {
      await expect(model.createPlayer(null as any, 'test@example.com'))
        .rejects.toThrow('Player name must be a non-empty string');
    });

    it('throws error for invalid email', async () => {
      await expect(model.createPlayer('Test', 'invalid-email'))
        .rejects.toThrow('Valid email address is required');
    });

    it('throws error for empty email', async () => {
      await expect(model.createPlayer('Test', ''))
        .rejects.toThrow('Valid email address is required');
    });

    it('throws error for duplicate email', async () => {
      await model.createPlayer('Alice', 'alice@example.com');
      
      await expect(model.createPlayer('Bob', 'alice@example.com'))
        .rejects.toThrow('Email is already in use by another player');
    });

    it('throws error for duplicate email with different case', async () => {
      await model.createPlayer('Alice', 'alice@example.com');
      
      await expect(model.createPlayer('Bob', 'ALICE@EXAMPLE.COM'))
        .rejects.toThrow('Email is already in use by another player');
    });
  });

  describe('getPlayerById', () => {
    it('returns player when found', async () => {
      const createdPlayer = await model.createPlayer('Alice', 'alice@example.com');
      const player = await model.getPlayerById(createdPlayer.id);
      
      expect(player).toEqual(createdPlayer);
    });

    it('returns null when player not found', async () => {
      const player = await model.getPlayerById('non-existent-id');
      
      expect(player).toBeNull();
    });
  });

  describe('getPlayerByEmail', () => {
    it('returns player when found', async () => {
      const createdPlayer = await model.createPlayer('Alice', 'alice@example.com');
      const player = await model.getPlayerByEmail('alice@example.com');
      
      expect(player).toEqual(createdPlayer);
    });

    it('returns player with case insensitive email search', async () => {
      const createdPlayer = await model.createPlayer('Alice', 'alice@example.com');
      const player = await model.getPlayerByEmail('ALICE@EXAMPLE.COM');
      
      expect(player).toEqual(createdPlayer);
    });

    it('returns player with trimmed email search', async () => {
      const createdPlayer = await model.createPlayer('Alice', 'alice@example.com');
      const player = await model.getPlayerByEmail('  alice@example.com  ');
      
      expect(player).toEqual(createdPlayer);
    });

    it('returns null when player not found', async () => {
      const player = await model.getPlayerByEmail('nonexistent@example.com');
      
      expect(player).toBeNull();
    });
  });

  describe('updatePlayer', () => {
    let player: Player;

    beforeEach(async () => {
      player = await model.createPlayer('Alice', 'alice@example.com');
    });

    it('updates player name', async () => {
      const originalTime = player.updatedAt.getTime();
      // Add a small delay to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 1));
      
      const updatedPlayer = await model.updatePlayer(player.id, { name: 'Alice Updated' });
      
      expect(updatedPlayer.name).toBe('Alice Updated');
      expect(updatedPlayer.email).toBe('alice@example.com');
      expect(updatedPlayer.updatedAt.getTime()).toBeGreaterThanOrEqual(originalTime);
    });

    it('updates player email', async () => {
      const originalTime = player.updatedAt.getTime();
      // Add a small delay to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 1));
      
      const updatedPlayer = await model.updatePlayer(player.id, { email: 'alice.new@example.com' });
      
      expect(updatedPlayer.name).toBe('Alice');
      expect(updatedPlayer.email).toBe('alice.new@example.com');
      expect(updatedPlayer.updatedAt.getTime()).toBeGreaterThanOrEqual(originalTime);
    });

    it('updates both name and email', async () => {
      const updatedPlayer = await model.updatePlayer(player.id, { 
        name: 'Alice Updated', 
        email: 'alice.new@example.com' 
      });
      
      expect(updatedPlayer.name).toBe('Alice Updated');
      expect(updatedPlayer.email).toBe('alice.new@example.com');
    });

    it('trims whitespace from updated name', async () => {
      const updatedPlayer = await model.updatePlayer(player.id, { name: '  Alice Updated  ' });
      
      expect(updatedPlayer.name).toBe('Alice Updated');
    });

    it('normalizes updated email to lowercase', async () => {
      const updatedPlayer = await model.updatePlayer(player.id, { email: 'ALICE.NEW@EXAMPLE.COM' });
      
      expect(updatedPlayer.email).toBe('alice.new@example.com');
    });

    it('throws error when player not found', async () => {
      await expect(model.updatePlayer('non-existent-id', { name: 'New Name' }))
        .rejects.toThrow('Player not found');
    });

    it('throws error for empty name update', async () => {
      await expect(model.updatePlayer(player.id, { name: '' }))
        .rejects.toThrow('Player name must be a non-empty string');
    });

    it('throws error for invalid email update', async () => {
      await expect(model.updatePlayer(player.id, { email: 'invalid-email' }))
        .rejects.toThrow('Valid email address is required');
    });

    it('throws error for duplicate email update', async () => {
      await model.createPlayer('Bob', 'bob@example.com');
      
      await expect(model.updatePlayer(player.id, { email: 'bob@example.com' }))
        .rejects.toThrow('Email is already in use by another player');
    });

    it('allows updating to same email', async () => {
      const updatedPlayer = await model.updatePlayer(player.id, { email: 'alice@example.com' });
      
      expect(updatedPlayer.email).toBe('alice@example.com');
    });

    it('allows empty updates object and returns unchanged player', async () => {
      const updatedPlayer = await model.updatePlayer(player.id, {});
      
      expect(updatedPlayer).toEqual(player);
    });
  });

  describe('deletePlayer', () => {
    it('deletes existing player', async () => {
      const player = await model.createPlayer('Alice', 'alice@example.com');
      
      await model.deletePlayer(player.id);
      
      const deletedPlayer = await model.getPlayerById(player.id);
      expect(deletedPlayer).toBeNull();
    });

    it('throws error when player not found', async () => {
      await expect(model.deletePlayer('non-existent-id'))
        .rejects.toThrow('Player not found');
    });
  });

  describe('getAllPlayers', () => {
    it('returns empty array when no players exist', async () => {
      const players = await model.getAllPlayers();
      
      expect(players).toEqual([]);
    });

    it('returns all players sorted by games won and efficiency', async () => {
      const player1 = await model.createPlayer('Alice', 'alice@example.com');
      const player2 = await model.createPlayer('Bob', 'bob@example.com');
      const player3 = await model.createPlayer('Charlie', 'charlie@example.com');
      
      // Update stats to test sorting
      await model.updatePlayerStatsAfterGame(player1.id, 'won', 5);
      await model.updatePlayerStatsAfterGame(player1.id, 'won', 3);
      
      await model.updatePlayerStatsAfterGame(player2.id, 'won', 2);
      await model.updatePlayerStatsAfterGame(player2.id, 'lost', 4);
      
      await model.updatePlayerStatsAfterGame(player3.id, 'won', 1);
      
      const players = await model.getAllPlayers();
      
      expect(players).toHaveLength(3);
      expect(players[0].name).toBe('Alice'); // 2 wins, highest efficiency
      expect(players[1].name).toBe('Charlie'); // 1 win
      expect(players[2].name).toBe('Bob'); // 1 win, lower efficiency
    });
  });

  describe('getPlayerStats', () => {
    it('returns player stats when player exists', async () => {
      const player = await model.createPlayer('Alice', 'alice@example.com');
      const stats = await model.getPlayerStats(player.id);
      
      expect(stats).toEqual(player.stats);
    });

    it('throws error when player not found', async () => {
      await expect(model.getPlayerStats('non-existent-id'))
        .rejects.toThrow('Player not found');
    });
  });

  describe('searchPlayersByName', () => {
    beforeEach(async () => {
      await model.createPlayer('Alice Johnson', 'alice@example.com');
      await model.createPlayer('Bob Smith', 'bob@example.com');
      await model.createPlayer('Charlie Brown', 'charlie@example.com');
      await model.createPlayer('Alice Williams', 'alice.w@example.com');
    });

    it('returns players matching name query', async () => {
      const players = await model.searchPlayersByName('Alice');
      
      expect(players).toHaveLength(2);
      expect(players[0].name).toBe('Alice Johnson');
      expect(players[1].name).toBe('Alice Williams');
    });

    it('performs case insensitive search', async () => {
      const players = await model.searchPlayersByName('ALICE');
      
      expect(players).toHaveLength(2);
    });

    it('trims whitespace from query', async () => {
      const players = await model.searchPlayersByName('  Alice  ');
      
      expect(players).toHaveLength(2);
    });

    it('returns empty array when no matches found', async () => {
      const players = await model.searchPlayersByName('NonExistent');
      
      expect(players).toEqual([]);
    });

    it('respects limit parameter', async () => {
      const players = await model.searchPlayersByName('a', 2);
      
      expect(players).toHaveLength(2);
    });

    it('throws error for invalid query', async () => {
      await expect(model.searchPlayersByName(''))
        .rejects.toThrow('Search query must be a valid string');
    });

    it('throws error for non-string query', async () => {
      await expect(model.searchPlayersByName(null as any))
        .rejects.toThrow('Search query must be a valid string');
    });

    it('throws error for limit less than 1', async () => {
      await expect(model.searchPlayersByName('Alice', 0))
        .rejects.toThrow('Limit must be between 1 and 100');
    });

    it('throws error for limit greater than 100', async () => {
      await expect(model.searchPlayersByName('Alice', 101))
        .rejects.toThrow('Limit must be between 1 and 100');
    });
  });

  describe('updatePlayerStatsAfterGame', () => {
    let player: Player;

    beforeEach(async () => {
      player = await model.createPlayer('Alice', 'alice@example.com');
    });

    it('updates stats for won game', async () => {
      const updatedPlayer = await model.updatePlayerStatsAfterGame(player.id, 'won', 5);
      
      expect(updatedPlayer.stats.gamesPlayed).toBe(1);
      expect(updatedPlayer.stats.gamesWon).toBe(1);
      expect(updatedPlayer.stats.gamesLost).toBe(0);
      expect(updatedPlayer.stats.gamesDrawn).toBe(0);
      expect(updatedPlayer.stats.totalMoves).toBe(5);
      expect(updatedPlayer.stats.winRate).toBe(100);
      expect(updatedPlayer.stats.efficiency).toBe(0.2); // 1 win / 5 moves
      expect(updatedPlayer.stats.averageMovesPerWin).toBe(5); // 5 moves / 1 win
    });

    it('updates stats for lost game', async () => {
      const updatedPlayer = await model.updatePlayerStatsAfterGame(player.id, 'lost', 3);
      
      expect(updatedPlayer.stats.gamesPlayed).toBe(1);
      expect(updatedPlayer.stats.gamesWon).toBe(0);
      expect(updatedPlayer.stats.gamesLost).toBe(1);
      expect(updatedPlayer.stats.gamesDrawn).toBe(0);
      expect(updatedPlayer.stats.totalMoves).toBe(3);
      expect(updatedPlayer.stats.winRate).toBe(0);
      expect(updatedPlayer.stats.efficiency).toBe(0); // 0 wins / 3 moves
      expect(updatedPlayer.stats.averageMovesPerWin).toBe(0); // 0 wins
    });

    it('updates stats for drawn game', async () => {
      const updatedPlayer = await model.updatePlayerStatsAfterGame(player.id, 'drawn', 4);
      
      expect(updatedPlayer.stats.gamesPlayed).toBe(1);
      expect(updatedPlayer.stats.gamesWon).toBe(0);
      expect(updatedPlayer.stats.gamesLost).toBe(0);
      expect(updatedPlayer.stats.gamesDrawn).toBe(1);
      expect(updatedPlayer.stats.totalMoves).toBe(4);
      expect(updatedPlayer.stats.winRate).toBe(0);
      expect(updatedPlayer.stats.efficiency).toBe(0); // 0 wins / 4 moves
      expect(updatedPlayer.stats.averageMovesPerWin).toBe(0); // 0 wins
    });

    it('accumulates stats across multiple games', async () => {
      await model.updatePlayerStatsAfterGame(player.id, 'won', 3);
      await model.updatePlayerStatsAfterGame(player.id, 'lost', 4);
      await model.updatePlayerStatsAfterGame(player.id, 'won', 2);
      
      const finalPlayer = await model.getPlayerById(player.id);
      
      expect(finalPlayer!.stats.gamesPlayed).toBe(3);
      expect(finalPlayer!.stats.gamesWon).toBe(2);
      expect(finalPlayer!.stats.gamesLost).toBe(1);
      expect(finalPlayer!.stats.gamesDrawn).toBe(0);
      expect(finalPlayer!.stats.totalMoves).toBe(9);
      expect(finalPlayer!.stats.winRate).toBeCloseTo(66.67, 1); // 2/3 * 100
      expect(finalPlayer!.stats.efficiency).toBeCloseTo(0.222, 2); // 2/9
      expect(finalPlayer!.stats.averageMovesPerWin).toBe(4.5); // 9/2
    });

    it('throws error when player not found', async () => {
      await expect(model.updatePlayerStatsAfterGame('non-existent-id', 'won', 5))
        .rejects.toThrow('Player not found');
    });
  });

  describe('private methods (tested indirectly)', () => {
    it('validates email format correctly', async () => {
      // Test various email formats through createPlayer
      await expect(model.createPlayer('Test', 'valid@example.com')).resolves.toBeDefined();
      await expect(model.createPlayer('Test', 'user.name@domain.co.uk')).resolves.toBeDefined();
      await expect(model.createPlayer('Test', 'test+tag@example.org')).resolves.toBeDefined();
      
      await expect(model.createPlayer('Test', 'invalid')).rejects.toThrow();
      await expect(model.createPlayer('Test', '@example.com')).rejects.toThrow();
      await expect(model.createPlayer('Test', 'test@')).rejects.toThrow();
      await expect(model.createPlayer('Test', 'test.example.com')).rejects.toThrow();
    });

    it('calculates win rate correctly', async () => {
      const player = await model.createPlayer('Test', 'test@example.com');
      
      // 2 wins out of 3 games = 66.67%
      await model.updatePlayerStatsAfterGame(player.id, 'won', 3);
      await model.updatePlayerStatsAfterGame(player.id, 'won', 2);
      await model.updatePlayerStatsAfterGame(player.id, 'lost', 4);
      
      const finalPlayer = await model.getPlayerById(player.id);
      expect(finalPlayer!.stats.winRate).toBeCloseTo(66.67, 1);
    });

    it('calculates efficiency correctly', async () => {
      const player = await model.createPlayer('Test', 'test@example.com');
      
      // 1 win with 5 total moves = 0.2 efficiency
      await model.updatePlayerStatsAfterGame(player.id, 'won', 5);
      
      const finalPlayer = await model.getPlayerById(player.id);
      expect(finalPlayer!.stats.efficiency).toBe(0.2);
    });

    it('calculates average moves per win correctly', async () => {
      const player = await model.createPlayer('Test', 'test@example.com');
      
      // 2 wins with 8 total moves = 4 average moves per win
      await model.updatePlayerStatsAfterGame(player.id, 'won', 3);
      await model.updatePlayerStatsAfterGame(player.id, 'won', 5);
      
      const finalPlayer = await model.getPlayerById(player.id);
      expect(finalPlayer!.stats.averageMovesPerWin).toBe(4);
    });
  });
});