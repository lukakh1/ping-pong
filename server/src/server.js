"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const gameStateService_1 = require("./services/gameStateService");
const gameEngine_1 = require("./services/gameEngine");
const socketHandler_1 = require("./handlers/socketHandler");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const gameStateService = new gameStateService_1.GameStateService();
const gameEngine = new gameEngine_1.GameEngine(gameStateService, io);
const socketHandler = new socketHandler_1.SocketHandler(gameStateService, gameEngine, io);
gameEngine.start();
io.on('connection', (socket) => {
    socketHandler.handleConnection(socket);
});
const PORT = parseInt(process.env.PORT || '3001');
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
