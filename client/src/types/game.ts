export interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

export interface Score {
  player1: number;
  player2: number;
}

export interface Player {
  id: string;
  ready: boolean;
}

export interface GameState {
  ball: Ball;
  paddles: {
    player1: Paddle;
    player2: Paddle;
  };
  score: Score;
  players: Record<string, Player>;
  gameRunning: boolean;
}

export interface PlayerAssignedData {
  playerId: 'player1' | 'player2';
}

export interface PaddleMoveData {
  direction: number;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'Game is full';
export type GameStatus = 'waiting' | 'waiting for opponent' | 'playing' | 'opponent disconnected';