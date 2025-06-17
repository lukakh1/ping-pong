"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameEngine = void 0;
const collisionService_1 = require("./collisionService");
const constants_1 = require("../config/constants");
class GameEngine {
    constructor(gameStateService, io) {
        this.gameInterval = null;
        this.gameStateService = gameStateService;
        this.collisionService = new collisionService_1.CollisionService();
        this.io = io;
        this.gameStateService.on('gameOver', (data) => {
            this.io.emit('gameOver', data);
        });
    }
    start() {
        if (this.gameInterval)
            return;
        this.gameInterval = setInterval(() => {
            this.gameLoop();
        }, 1000 / constants_1.GAME_FPS);
    }
    stop() {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
    }
    gameLoop() {
        const gameState = this.gameStateService.getGameState();
        if (!gameState.gameRunning || Object.keys(gameState.players).length < 2) {
            return;
        }
        gameState.ball.x += gameState.ball.dx;
        gameState.ball.y += gameState.ball.dy;
        const wallCollision = this.collisionService.checkWallCollision(gameState.ball);
        if (wallCollision === 'left' || wallCollision === 'right') {
            this.collisionService.handleWallCollision(gameState.ball, wallCollision);
        }
        else if (wallCollision === 'top') {
            this.gameStateService.incrementScore('player1');
            this.gameStateService.resetBall();
            this.io.emit('playerScored', { scorer: 'player1', score: gameState.score });
        }
        else if (wallCollision === 'bottom') {
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
    updatePaddles(gameState) {
        gameState.paddles.player1.x += gameState.paddles.player1.speed;
        gameState.paddles.player2.x += gameState.paddles.player2.speed;
        gameState.paddles.player1.x = Math.max(0, Math.min(constants_1.CANVAS_WIDTH - gameState.paddles.player1.width, gameState.paddles.player1.x));
        gameState.paddles.player2.x = Math.max(0, Math.min(constants_1.CANVAS_WIDTH - gameState.paddles.player2.width, gameState.paddles.player2.x));
    }
}
exports.GameEngine = GameEngine;
