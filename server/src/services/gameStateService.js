"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameStateService = void 0;
const constants_1 = require("../config/constants");
const events_1 = require("events");
class GameStateService extends events_1.EventEmitter {
    constructor() {
        super();
        this.gameState = this.initializeGameState();
    }
    initializeGameState() {
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
    getGameState() {
        return this.gameState;
    }
    resetBall() {
        this.gameState.ball.x = constants_1.CANVAS_WIDTH / 2;
        this.gameState.ball.y = constants_1.CANVAS_HEIGHT / 2;
        this.gameState.ball.dx = Math.random() > 0.5 ? 5 : -5;
        this.gameState.ball.dy = Math.random() > 0.5 ? 3 : -3;
    }
    addPlayer(socketId) {
        const playerCount = Object.keys(this.gameState.players).length;
        let playerId = null;
        if (playerCount === 0) {
            playerId = 'player1';
        }
        else if (playerCount === 1) {
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
    removePlayer(socketId) {
        delete this.gameState.players[socketId];
    }
    getPlayerCount() {
        return Object.keys(this.gameState.players).length;
    }
    startGame() {
        this.gameState.gameRunning = true;
        this.resetBall();
    }
    stopGame() {
        this.gameState.gameRunning = false;
    }
    incrementScore(player) {
        this.gameState.score[player]++;
        if (this.gameState.score[player] >= 10) {
            this.gameState.gameRunning = false;
            this.emit('gameOver', { winner: player });
            this.gameState.score.player1 = 0;
            this.gameState.score.player2 = 0;
        }
    }
}
exports.GameStateService = GameStateService;
