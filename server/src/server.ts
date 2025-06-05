import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { GameStateService } from './services/gameStateService';
import { GameEngine } from './services/gameEngine';
import { SocketHandler } from './handlers/socketHandler';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const gameStateService = new GameStateService();
const gameEngine = new GameEngine(gameStateService, io);
const socketHandler = new SocketHandler(gameStateService, gameEngine, io);

gameEngine.start();

io.on('connection', (socket) => {
  socketHandler.handleConnection(socket);
});

const PORT = parseInt(process.env.PORT || '3001');
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});