"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketHandler = void 0;
const constants_1 = require("../config/constants");
class SocketHandler {
    constructor(gameStateService, gameEngine, io) {
        this.gameStateService = gameStateService;
        this.gameEngine = gameEngine;
        this.io = io;
    }
    handleConnection(socket) {
        console.log('User connected:', socket.id);
        const playerId = this.gameStateService.addPlayer(socket.id);
        if (playerId) {
            const assignedData = { playerId };
            console.log(assignedData, 'assignedData');
            socket.emit('playerAssigned', assignedData);
            if (this.gameStateService.getPlayerCount() === 2) {
                this.gameStateService.startGame();
                this.io.emit('gameStarted');
            }
        }
        else {
            socket.emit('gameFull');
        }
        this.setupSocketEvents(socket);
        socket.emit('gameState', this.gameStateService.getGameState());
    }
    setupSocketEvents(socket) {
        socket.on('paddleMove', (data) => {
            this.handlePaddleMove(socket.id, data);
        });
        socket.on('paddleStop', () => {
            this.handlePaddleStop(socket.id);
        });
        socket.on('disconnect', () => {
            this.handleDisconnect(socket.id);
        });
    }
    handlePaddleMove(socketId, data) {
        const gameState = this.gameStateService.getGameState();
        const player = gameState.players[socketId];
        if (player) {
            if (player.id === 'player1') {
                gameState.paddles.player1.speed = data.direction * constants_1.PADDLE_SPEED;
            }
            else if (player.id === 'player2') {
                gameState.paddles.player2.speed = data.direction * constants_1.PADDLE_SPEED;
            }
        }
    }
    handlePaddleStop(socketId) {
        const gameState = this.gameStateService.getGameState();
        const player = gameState.players[socketId];
        if (player) {
            if (player.id === 'player1') {
                gameState.paddles.player1.speed = 0;
            }
            else if (player.id === 'player2') {
                gameState.paddles.player2.speed = 0;
            }
        }
    }
    handleDisconnect(socketId) {
        console.log('User disconnected:', socketId);
        this.gameStateService.removePlayer(socketId);
        if (this.gameStateService.getPlayerCount() < 2) {
            this.gameStateService.stopGame();
            this.io.emit('gameEnded');
        }
    }
}
exports.SocketHandler = SocketHandler;
