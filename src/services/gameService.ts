import { GameStatus, Player } from '../types';
import { GameModel } from '../models/game';
import { PlayerService } from './playerService';

export class GameService {
  private gameModel: GameModel;
  private playerService: PlayerService;

  constructor(playerService?: PlayerService) {
    this.gameModel = new GameModel();
    this.playerService = playerService || new PlayerService();
  }

  async createGame(name?: string) {
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      throw new Error('Game name must be at least 3 characters if provided');
    }
    return this.gameModel.createGame(name);
  }

  async getGameById(gameId: string) {
    return this.gameModel.getGameById(gameId);
  }

  async getGameStatus(gameId: string) {
    return this.gameModel.getGameStatus(gameId);
  }

  async joinGame(gameId: string, player: Player) {
    return this.gameModel.joinGame(gameId, player);
  }

  async makeMove(gameId: string, playerId: string, row: number, col: number) {
    const result = await this.gameModel.makeMove(gameId, playerId, row, col);

    // Update player stats if game ended
    if (result.game.status === 'completed' || result.game.status === 'draw') {
      const game = result.game;
      
      if (game.status === 'completed' && game.winnerId) {
        console.log(' **** Game WON!\n');
        // Update winner stats
        await this.playerService.updatePlayerStatsAfterGame(game.winnerId, 'won', game.moves.length);
        // Update loser stats
        const loserId = game.players.find(p => p.id !== game.winnerId)?.id;
        if (loserId) {
          await this.playerService.updatePlayerStatsAfterGame(loserId, 'lost', game.moves.length);
        }
      } else if (game.status === 'draw') {
        console.log(' **** Game in a DRAW!\n');
        // Update both players for draw
        for (const player of game.players) {
          await this.playerService.updatePlayerStatsAfterGame(player.id, 'drawn', game.moves.length);
        }
      }
    }
    return result;
  }

  async getValidMoves(gameId: string) {
    const game = await this.getGameById(gameId);
    if (!game) throw new Error('Game not found');
    return this.gameModel.getValidMoves(game.board);
  }

  async getGameStats(gameId: string) {
    return this.gameModel.getGameStats(gameId);
  }

  async getAllGames() {
    return this.gameModel.listGames();
  }

  async getGamesByStatus(status: GameStatus) {
    const all = await this.gameModel.listGames();
    return all.filter((g) => g.status === status);
  }

  async deleteGame(gameId: string) {
    const game = await this.getGameById(gameId);
    if (!game) throw new Error('Game not found');
    if (game.status === 'active') {
      throw new Error('Cannot delete an active game');
    }
    return this.gameModel.deleteGame(gameId);
  }
}