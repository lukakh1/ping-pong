import { Server } from 'socket.io';
import { GameStateService } from './gameStateService';
import { CollisionService } from './collisionService';
import { CANVAS_WIDTH, GAME_FPS } from '../config/constants';

export class GameEngine {
  private gameStateService: GameStateService;
  private collisionService: CollisionService;
  private io: Server;
  private gameInterval: NodeJS.Timeout | null = null;

  constructor(gameStateService: GameStateService, io: Server) {
    this.gameStateService = gameStateService;
    this.collisionService = new CollisionService();
    this.io = io;

    this.gameStateService.on('gameOver', (data: { winner: string }) => {
      this.io.emit('gameOver', data);
    });
  }

  start(): void {
    if (this.gameInterval) return;

    this.gameInterval = setInterval(() => {
      this.gameLoop();
    }, 1000 / GAME_FPS);
  }

  stop(): void {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }
  }

  private gameLoop(): void {
    const gameState = this.gameStateService.getGameState();

    if (!gameState.gameRunning || Object.keys(gameState.players).length < 2) {
      return;
    }

    gameState.ball.x += gameState.ball.dx;
    gameState.ball.y += gameState.ball.dy;

    const wallCollision = this.collisionService.checkWallCollision(gameState.ball);

    if (wallCollision === 'left' || wallCollision === 'right') {
      this.collisionService.handleWallCollision(gameState.ball, wallCollision);
    } else if (wallCollision === 'top') {
      this.gameStateService.incrementScore('player1');
      this.gameStateService.resetBall();
      this.io.emit('playerScored', { scorer: 'player1', score: gameState.score });
    } else if (wallCollision === 'bottom') {
      this.gameStateService.incrementScore('player2');
      this.gameStateService.resetBall();
      this.io.emit('playerScored', { scorer: 'player2', score: gameState.score });
    }

    if (this.collisionService.checkPaddleCollision(gameState.ball, gameState.paddles.player1, 'bottom')) {
      this.collisionService.handlePaddleCollision(gameState.ball, gameState.paddles.player1, 'bottom');
    }

    if (this.collisionService.checkPaddleCollision(gameState.ball, gameState.paddles.player2, 'top')) {
      this.collisionService.handlePaddleCollision(gameState.ball, gameState.paddles.player2, 'top');
    }

    this.updatePaddles(gameState);

    this.io.emit('gameState', gameState);
  }

  private updatePaddles(gameState: any): void {
    gameState.paddles.player1.x += gameState.paddles.player1.speed;
    gameState.paddles.player2.x += gameState.paddles.player2.speed;

    gameState.paddles.player1.x = Math.max(0, Math.min(CANVAS_WIDTH - gameState.paddles.player1.width, gameState.paddles.player1.x));
    gameState.paddles.player2.x = Math.max(0, Math.min(CANVAS_WIDTH - gameState.paddles.player2.width, gameState.paddles.player2.x));
  }
}