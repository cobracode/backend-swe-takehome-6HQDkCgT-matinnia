import { PlayerService } from './playerService';
import { GameService } from './gameService';

// Shared service instances to ensure all routes use the same data stores
export const playerService = new PlayerService();
export const gameService = new GameService(playerService);
