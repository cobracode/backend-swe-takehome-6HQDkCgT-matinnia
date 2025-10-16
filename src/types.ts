export interface CreateGameRequest {
    name: string;
    playerName: string;
  }
  
  export interface JoinGameRequest {
    gameId: string;
    playerId: string;
    playerName: string;
  }
  
  export interface MakeMoveRequest {
    gameId: string;
    playerId: string;
    row: number;
    col: number;
    move: string;
  }

  export interface Game {
    id: string;
    name: string;
    status: GameStatus;
    board: GameBoard;
    players: Player[];
    currentPlayerId: string | null;
    winnerId: string | null;
    createdAt: Date;
    updatedAt: Date;
    moves: Move[];
  }

  export type GameStatus = string | null;

  export type GameBoard = (string | null)[][];


  export interface Move {
    id: string;
    gameId: string;
    playerId: string;
    row: number;
    col: number;
    timestamp: Date;
  }

  export interface Player {
    id: string;
    name: string;
    email: string;
    stats: PlayerStats;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface PlayerStats {
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;
    gamesDrawn: number;
    totalMoves: number;
    averageMovesPerWin: number;
    winRate: number;
    efficiency: number;
  }

  export interface WinResult {
    won: boolean;
    condition?: WinCondition;
    position?: number;
  }

  type WinCondition = string;