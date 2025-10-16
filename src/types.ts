export interface CreateGameRequest {
    name: string;
    playerName: string;
    // ... other fields
  }
  
  export interface JoinGameRequest {
    gameId: string;
    playerId: string;
    playerName: string;
    // ... other fields
  }
  
  export interface MakeMoveRequest {
    gameId: string;
    playerId: string;
    row: number;
    col: number;
    move: string;
    // ... other fields
  }