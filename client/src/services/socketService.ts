import { io, Socket } from 'socket.io-client';
import type { GameState, PlayerAssignedData, PaddleMoveData } from '../types/game';

export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('https://ec2-13-53-35-146.eu-north-1.compute.amazonaws.com');
    console.log(this.socket, 'this.socket')
  }

  onConnect(callback: () => void): void {
    this.socket.on('connect', callback);
  }

  onPlayerAssigned(callback: (data: PlayerAssignedData) => void): void {
    this.socket.on('playerAssigned', callback);
    console.log(this.socket, 'player')
  }

  onGameFull(callback: () => void): void {
    this.socket.on('gameFull', callback);
  }

  onGameStarted(callback: () => void): void {
    this.socket.on('gameStarted', callback);
  }

  onGameEnded(callback: () => void): void {
    this.socket.on('gameEnded', callback);
  }

  onGameState(callback: (state: GameState) => void): void {
    this.socket.on('gameState', callback);
  }

  onPlayerScored(callback: (data: { scorer: string, score: any }) => void): void {
    this.socket.on('playerScored', callback);
  }

  onGameOver(callback: (data: { winner: string }) => void): void {
    this.socket.on('gameOver', callback);
  }

  onDisconnect(callback: () => void): void {
    this.socket.on('disconnect', callback);
  }

  emitPaddleMove(data: PaddleMoveData): void {
    this.socket.emit('paddleMove', data);
  }

  emitPaddleStop(): void {
    this.socket.emit('paddleStop');
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}