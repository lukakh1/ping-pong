import { GameState } from "../types/game";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../config/constants';
import { EventEmitter } from 'events';

export class GameStateService extends EventEmitter {
  private gameState: GameState;

  constructor() {
    super();
    this.gameState = this.initializeGameState();
  }

  private initializeGameState(): GameState {
    return {
      ball: {
        x: 400,
        y: 300,
        dx: 5,
        dy: 3,
        radius: 10
      },
      paddles: {
        player1: {
          x: 350,
          y: 550,
          width: 100,
          height: 15,
          speed: 0
        },
        player2: {
          x: 350,
          y: 35,
          width: 100,
          height: 15,
          speed: 0
        }
      },
      score: {
        player1: 0,
        player2: 0
      },
      players: {},
      gameRunning: false
    };
  }

  getGameState(): GameState {
    return this.gameState;
  }

  resetBall(): void {
    this.gameState.ball.x = CANVAS_WIDTH / 2;
    this.gameState.ball.y = CANVAS_HEIGHT / 2;
    this.gameState.ball.dx = Math.random() > 0.5 ? 5 : -5;
    this.gameState.ball.dy = Math.random() > 0.5 ? 3 : -3;
  }

  addPlayer(socketId: string): 'player1' | 'player2' | null {
    const playerCount = Object.keys(this.gameState.players).length;
    let playerId: 'player1' | 'player2' | null = null;

    if (playerCount === 0) {
      playerId = 'player1';
    } else if (playerCount === 1) {
      playerId = 'player2';
    }

    if (playerId) {
      this.gameState.players[socketId] = {
        id: playerId,
        ready: false
      };
    }

    return playerId;
  }

  removePlayer(socketId: string): void {
    delete this.gameState.players[socketId];
  }

  getPlayerCount(): number {
    return Object.keys(this.gameState.players).length;
  }

  startGame(): void {
    this.gameState.gameRunning = true;
    this.resetBall();
  }

  stopGame(): void {
    this.gameState.gameRunning = false;
  }

  incrementScore(player: 'player1' | 'player2'): void {
    this.gameState.score[player]++;
    if (this.gameState.score[player] >= 10) {
      this.gameState.gameRunning = false;
      this.emit('gameOver', { winner: player });
      this.gameState.score.player1 = 0;
      this.gameState.score.player2 = 0;
    }

  }

}