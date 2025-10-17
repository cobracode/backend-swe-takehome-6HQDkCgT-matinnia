import { Player, PlayerStats } from '../types';
import { PlayerModel } from '../models/player';

export class PlayerService {
  private playerModel: PlayerModel;

  constructor() {
    this.playerModel = new PlayerModel();
  }

  async createPlayer(name: string, email: string): Promise<Player> {
    console.log(`👤 Creating player: ${name}`);
    const player = await this.playerModel.createPlayer(name, email);
    console.log(`✅ Player created: ${player.id}`);
    return player;
  }

  async getPlayerById(playerId: string): Promise<Player | null> {
    if (!playerId || typeof playerId !== 'string') {
      throw new Error('Player ID must be a valid string');
    }
    console.log(`🔍 Fetching player: ${playerId}`);
    return this.playerModel.getPlayerById(playerId);
  }

  async updatePlayer(
    playerId: string,
    updates: Partial<Pick<Player, 'name' | 'email'>>
  ): Promise<Player> {
    console.log(`✏️  Updating player: ${playerId}`);
    const player = await this.playerModel.updatePlayer(playerId, updates);
    console.log(`✅ Player updated: ${player.id}`);
    return player;
  }

  async deletePlayer(playerId: string): Promise<void> {
    console.log(`🗑️  Deleting player: ${playerId}`);
    await this.playerModel.deletePlayer(playerId);
    console.log(`✅ Player deleted: ${playerId}`);
  }

  async getAllPlayers(): Promise<Player[]> {
    const players = await this.playerModel.getAllPlayers();
    console.log(`📋 Found ${players.length} players`);
    return players;
  }

  async getPlayerStats(playerId: string): Promise<PlayerStats> {
    console.log(`📊 Fetching stats for player: ${playerId}`);
    const stats = await this.playerModel.getPlayerStats(playerId);
    console.log(`✅ Stats fetched for player: ${playerId}`);
    return stats;
  }

  async searchPlayersByName(query: string, limit: number = 10): Promise<Player[]> {
    console.log(`🔎 Searching players by name: '${query}' (limit ${limit})`);
    return this.playerModel.searchPlayersByName(query, limit);
  }

  async getPlayersByWinCount(numPlayers: number): Promise<Player[]> {
    console.log(`🏆 Getting top ${numPlayers} players by win count`);
    const players = await this.playerModel.getAllPlayers();
    return players
      .sort((a, b) => b.stats.gamesWon - a.stats.gamesWon)
      .slice(0, numPlayers);
  }

  async getPlayersByEfficiency(numPlayers: number): Promise<Player[]> {
    console.log(`⚡ Getting top ${numPlayers} players by efficiency`);
    const players = await this.playerModel.getAllPlayers();
    return players
      .sort((a, b) => b.stats.efficiency - a.stats.efficiency)
      .slice(0, numPlayers);
  }

  async getPlayersByWinCountPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: {
      minGames?: number;
      playerName?: string;
      dateFrom?: Date;
      dateTo?: Date;
    }
  ): Promise<{ players: Player[]; total: number; page: number; limit: number; totalPages: number }> {
    console.log(`🏆 Getting paginated players by win count - page: ${page}, limit: ${limit}`);
    
    let players = await this.playerModel.getAllPlayers();
    
    // Apply filters
    if (filters) {
      if (filters.minGames !== undefined) {
        players = players.filter(p => p.stats.gamesPlayed >= filters.minGames!);
      }
      if (filters.playerName) {
        const nameFilter = filters.playerName.toLowerCase();
        players = players.filter(p => p.name.toLowerCase().includes(nameFilter));
      }
      if (filters.dateFrom) {
        players = players.filter(p => p.createdAt >= filters.dateFrom!);
      }
      if (filters.dateTo) {
        players = players.filter(p => p.createdAt <= filters.dateTo!);
      }
    }
    
    // Sort by win count
    players = players.sort((a, b) => b.stats.gamesWon - a.stats.gamesWon);
    
    const total = players.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPlayers = players.slice(startIndex, endIndex);
    
    return {
      players: paginatedPlayers,
      total,
      page,
      limit,
      totalPages
    };
  }

  async getPlayersByEfficiencyPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: {
      minGames?: number;
      playerName?: string;
      dateFrom?: Date;
      dateTo?: Date;
    }
  ): Promise<{ players: Player[]; total: number; page: number; limit: number; totalPages: number }> {
    console.log(`⚡ Getting paginated players by efficiency - page: ${page}, limit: ${limit}`);
    
    let players = await this.playerModel.getAllPlayers();
    
    // Apply filters
    if (filters) {
      if (filters.minGames !== undefined) {
        players = players.filter(p => p.stats.gamesPlayed >= filters.minGames!);
      }
      if (filters.playerName) {
        const nameFilter = filters.playerName.toLowerCase();
        players = players.filter(p => p.name.toLowerCase().includes(nameFilter));
      }
      if (filters.dateFrom) {
        players = players.filter(p => p.createdAt >= filters.dateFrom!);
      }
      if (filters.dateTo) {
        players = players.filter(p => p.createdAt <= filters.dateTo!);
      }
    }
    
    // Sort by efficiency
    players = players.sort((a, b) => b.stats.efficiency - a.stats.efficiency);
    
    const total = players.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPlayers = players.slice(startIndex, endIndex);
    
    return {
      players: paginatedPlayers,
      total,
      page,
      limit,
      totalPages
    };
  }

  async updatePlayerStatsAfterGame(
    playerId: string, 
    gameResult: 'won' | 'lost' | 'drawn', 
    movesCount: number
  ): Promise<Player> {
    return this.playerModel.updatePlayerStatsAfterGame(playerId, gameResult, movesCount);
  }
}



// TODO: Implement PlayerService (create/get/update/delete/search/stats) [ttt.todo.service.player.complete]