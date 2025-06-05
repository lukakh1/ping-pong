import { Server, Socket } from 'socket.io';
import { GameStateService } from '../services/gameStateService';
import { GameEngine } from '../services/gameEngine';
import { PaddleMoveData, PlayerAssignedData } from '../types/game';
import { PADDLE_SPEED } from '../config/constants';

export class SocketHandler {
  private gameStateService: GameStateService;
  private gameEngine: GameEngine;
  private io: Server;

  constructor(gameStateService: GameStateService, gameEngine: GameEngine, io: Server) {
    this.gameStateService = gameStateService;
    this.gameEngine = gameEngine;
    this.io = io;
  }

  handleConnection(socket: Socket): void {
    console.log('User connected:', socket.id);

    const playerId = this.gameStateService.addPlayer(socket.id);

    if (playerId) {
      const assignedData: PlayerAssignedData = { playerId };
      console.log(assignedData, 'assignedData')
      socket.emit('playerAssigned', assignedData);
      
      if (this.gameStateService.getPlayerCount() === 2) {
        this.gameStateService.startGame();
        this.io.emit('gameStarted');
      }
    } else {
      socket.emit('gameFull');
    }

    this.setupSocketEvents(socket);

    socket.emit('gameState', this.gameStateService.getGameState());
  }

  private setupSocketEvents(socket: Socket): void {
    socket.on('paddleMove', (data: PaddleMoveData) => {
      this.handlePaddleMove(socket.id, data);
    });

    socket.on('paddleStop', () => {
      this.handlePaddleStop(socket.id);
    });

    socket.on('disconnect', () => {
      this.handleDisconnect(socket.id);
    });
  }

  private handlePaddleMove(socketId: string, data: PaddleMoveData): void {
    const gameState = this.gameStateService.getGameState();
    const player = gameState.players[socketId];
    
    if (player) {
      if (player.id === 'player1') {
        gameState.paddles.player1.speed = data.direction * PADDLE_SPEED;
      } else if (player.id === 'player2') {
        gameState.paddles.player2.speed = data.direction * PADDLE_SPEED;
      }
    }
  }

  private handlePaddleStop(socketId: string): void {
    const gameState = this.gameStateService.getGameState();
    const player = gameState.players[socketId];
    
    if (player) {
      if (player.id === 'player1') {
        gameState.paddles.player1.speed = 0;
      } else if (player.id === 'player2') {
        gameState.paddles.player2.speed = 0;
      }
    }
  }

  private handleDisconnect(socketId: string): void {
    console.log('User disconnected:', socketId);
    this.gameStateService.removePlayer(socketId);
    
    if (this.gameStateService.getPlayerCount() < 2) {
      this.gameStateService.stopGame();
      this.io.emit('gameEnded');
    }
  }
}