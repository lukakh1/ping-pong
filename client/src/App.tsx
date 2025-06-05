// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { io, Socket } from 'socket.io-client';

// // Type definitions
// interface Ball {
//   x: number;
//   y: number;
//   dx: number;
//   dy: number;
//   radius: number;
// }

// interface Paddle {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   speed: number;
// }

// interface Score {
//   player1: number;
//   player2: number;
// }

// interface Player {
//   id: string;
//   ready: boolean;
// }

// interface GameState {
//   ball: Ball;
//   paddles: {
//     player1: Paddle;
//     player2: Paddle;
//   };
//   score: Score;
//   players: Record<string, Player>;
//   gameRunning: boolean;
// }

// interface PlayerAssignedData {
//   playerId: 'player1' | 'player2';
// }

// interface PaddleMoveData {
//   direction: number;
// }

// type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'Game is full';
// type GameStatus = 'waiting' | 'waiting for opponent' | 'playing' | 'opponent disconnected';

// const App: React.FC = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const socketRef = useRef<Socket | null>(null);
//   const keysRef = useRef<Record<string, boolean>>({});

//   const [gameState, setGameState] = useState<GameState | null>(null);
//   const [playerId, setPlayerId] = useState<'player1' | 'player2' | null>(null);
//   const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
//   const [gameStatus, setGameStatus] = useState<GameStatus>('waiting');

//   // Initialize socket connection
//   useEffect(() => {
//     socketRef.current = io('http://localhost:3001');

//     socketRef.current.on('connect', () => {
//       setConnectionStatus('connected');
//     });

//     socketRef.current.on('playerAssigned', (data: PlayerAssignedData) => {
//       console.log(data.playerId, 'data.playerId')
//       setPlayerId(data.playerId);
//       setGameStatus('waiting for opponent');
//     });

//     socketRef.current.on('gameFull', () => {
//       setConnectionStatus('Game is full');
//     });

//     socketRef.current.on('gameStarted', () => {
//       setGameStatus('playing');
//     });

//     socketRef.current.on('gameEnded', () => {
//       setGameStatus('opponent disconnected');
//     });

//     socketRef.current.on('gameState', (state: GameState) => {
//       setGameState(state);
//     });

//     socketRef.current.on('playerScored', (data: { scorer: string, score: any }) => {
//       console.log(`${data.scorer} scored!`, data.score);
//     });

//     socketRef.current.on('gameOver', (data: { winner: string }) => {
//       if (data.winner === playerId) {
//         alert('You won!');
//       } else {
//         alert('You lost!');
//       }
//       setGameStatus('waiting');
//     });

//     socketRef.current.on('disconnect', () => {
//       setConnectionStatus('disconnected');
//     });

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//       }
//     };
//   }, [playerId]);

//   // Handle keyboard input
//   const handleKeyDown = useCallback((e: KeyboardEvent) => {
//     if (!keysRef.current[e.key]) {
//       keysRef.current[e.key] = true;

//       console.log(playerId, 'playerIdplayerId')

//       if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
//         const moveData1: PaddleMoveData = { direction: -1 };
//         const moveData2: PaddleMoveData = { direction: 1 };
//         socketRef.current?.emit('paddleMove', playerId === 'player1' ? moveData1 : moveData2);
//       } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
//         const moveData1: PaddleMoveData = { direction: 1 };
//         const moveData2: PaddleMoveData = { direction: -1 };
//         socketRef.current?.emit('paddleMove', playerId === 'player1' ? moveData1 : moveData2);
//       }
//     }
//   }, [playerId, socketRef]);

//   const handleKeyUp = useCallback((e: KeyboardEvent) => {
//     keysRef.current[e.key] = false;

//     if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' ||
//       e.key === 'a' || e.key === 'A' || e.key === 'd' || e.key === 'D') {
//       socketRef.current?.emit('paddleStop');
//     }
//   }, [socketRef]);

//   // Set up keyboard event listeners
//   useEffect(() => {
//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);

//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//     };
//   }, [handleKeyDown, handleKeyUp, playerId, socketRef]);

//   // Transform coordinates for each player's perspective
//   const transformGameState = (state: GameState, width: number, height: number): GameState => {
//     if (!playerId) return state;

//     if (playerId === 'player2') {
//       // Flip the entire game for player2 so they see their paddle at the bottom
//       return {
//         ...state,
//         ball: {
//           ...state.ball,
//           x: width - state.ball.x,
//           y: height - state.ball.y,
//           dx: -state.ball.dx,
//           dy: -state.ball.dy
//         },
//         paddles: {
//           player1: {
//             ...state.paddles.player2,
//             x: width - state.paddles.player2.x - state.paddles.player2.width,
//             y: height - state.paddles.player2.y - state.paddles.player2.height
//           },
//           player2: {
//             ...state.paddles.player1,
//             x: width - state.paddles.player1.x - state.paddles.player1.width,
//             y: height - state.paddles.player1.y - state.paddles.player1.height
//           }
//         },
//         score: {
//           player1: state.score.player2,
//           player2: state.score.player1
//         }
//       };
//     }

//     return state;
//   };

//   // Render game
//   useEffect(() => {
//     if (!gameState || !canvasRef.current) return;

//     const canvas: HTMLCanvasElement = canvasRef.current;
//     const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

//     if (!ctx) return;

//     const width = canvas.width;
//     const height = canvas.height;

//     // Calculate scale factors
//     const scaleX = width / 800;
//     const scaleY = height / 600;

//     // Transform game state based on player perspective
//     const transformedState = transformGameState(gameState, 800, 600); // always use 800x600 for logic

//     // Clear canvas
//     ctx.fillStyle = '#000';
//     ctx.fillRect(0, 0, width, height);

//     // Draw center line
//     ctx.setLineDash([5 * scaleX, 15 * scaleX]);
//     ctx.beginPath();
//     ctx.moveTo(0, height / 2);
//     ctx.lineTo(width, height / 2);
//     ctx.strokeStyle = '#fff';
//     ctx.stroke();
//     ctx.setLineDash([]);

//     // Draw ball
//     ctx.beginPath();
//     ctx.arc(
//       transformedState.ball.x * scaleX,
//       transformedState.ball.y * scaleY,
//       transformedState.ball.radius * ((scaleX + scaleY) / 2),
//       0, Math.PI * 2
//     );
//     ctx.fillStyle = '#fff';
//     ctx.fill();

//     // Draw player's paddle (always at bottom, always green)
//     ctx.fillStyle = '#4ade80';
//     ctx.fillRect(
//       transformedState.paddles.player1.x * scaleX,
//       transformedState.paddles.player1.y * scaleY,
//       transformedState.paddles.player1.width * scaleX,
//       transformedState.paddles.player1.height * scaleY
//     );

//     // Draw opponent's paddle (always at top, always white)
//     ctx.fillStyle = '#fff';
//     ctx.fillRect(
//       transformedState.paddles.player2.x * scaleX,
//       transformedState.paddles.player2.y * scaleY,
//       transformedState.paddles.player2.width * scaleX,
//       transformedState.paddles.player2.height * scaleY
//     );

//     // Draw scores
//     ctx.font = `${48 * ((scaleX + scaleY) / 2)}px Arial`;
//     ctx.fillStyle = '#fff';
//     ctx.textAlign = 'center';
//     // Your score (bottom)
//     ctx.fillText(transformedState.score.player1.toString(), width / 2, height - 50 * scaleY);
//     // Opponent's score (top)
//     ctx.fillText(transformedState.score.player2.toString(), width / 2, 80 * scaleY);

//   }, [gameState, playerId]);

//   // Auto-resize canvas to fullscreen
//   useEffect(() => {
//     const handleResize = () => {
//       if (canvasRef.current) {
//         canvasRef.current.width = window.innerWidth;
//         canvasRef.current.height = window.innerHeight;
//       }
//     };

//     handleResize();
//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   const getStatusColor = (): string => {
//     switch (connectionStatus) {
//       case 'connected': return 'text-green-500';
//       case 'connecting': return 'text-yellow-500';
//       case 'disconnected': return 'text-red-500';
//       default: return 'text-red-500';
//     }
//   };

//   const getGameStatusColor = (): string => {
//     switch (gameStatus) {
//       case 'playing': return 'text-green-500';
//       case 'waiting for opponent': return 'text-yellow-500';
//       default: return 'text-gray-500';
//     }
//   };

//   return (
//     <div className="w-screen h-screen bg-gray-900 text-white relative overflow-hidden flex justify-between">
//       {/* Status overlay */}
//       <div className="z-10 bg-black bg-opacity-50 p-3 rounded">
//         <div className="space-y-1 text-sm">
//           <p className={getStatusColor()}>
//             Connection: {connectionStatus}
//           </p>
//           <p className={getGameStatusColor()}>
//             Status: {gameStatus}
//           </p>
//           {playerId && (
//             <p className="text-blue-400">
//               You are {playerId}
//             </p>
//           )}
//         </div>
//       </div>

//       <canvas
//         ref={canvasRef}
//         className="block w-2/3 h-full"
//         tabIndex={0}
//       />

//       {/* Controls overlay */}
//       <div className="z-10 bg-black bg-opacity-50 p-3 rounded text-right">
//         <h3 className="text-sm font-semibold mb-1">Controls</h3>
//         <div className="text-xs text-gray-300">
//           <p>A/D or ← → to move paddle</p>
//           <p className="text-green-400">Your paddle: Green (bottom)</p>
//           <p className="text-gray-400">Opponent: White (top)</p>
//         </div>
//       </div>

//       {/* Full screen canvas */}


//       {/* Waiting overlay */}
//       {gameStatus === 'waiting for opponent' && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-20">
//           <div className="text-center p-8 bg-blue-900 rounded-lg">
//             <p className="text-blue-200 text-xl mb-2">
//               Waiting for another player...
//             </p>
//             <p className="text-sm text-blue-300">
//               Open this page in another tab or share with a friend!
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Game over/disconnected overlay */}
//       {gameStatus === 'opponent disconnected' && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-20">
//           <div className="text-center p-8 bg-red-900 rounded-lg">
//             <p className="text-red-200 text-xl mb-2">
//               Opponent disconnected
//             </p>
//             <p className="text-sm text-red-300">
//               Waiting for a new opponent...
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;

import React, { useState, useEffect, useRef } from 'react';
import { SocketService } from './services/socketService';
import { useKeyboardHandler } from './utils/useKeyboardHandler';
import GameCanvas from './components/gameCanvas';
import StatusPanel from './components/statusPanel';
import ControlsPanel from './components/controlsPanel';
import WaitingOverlay from './components/waitingOverlay';
import type { GameState, ConnectionStatus, GameStatus } from './types/game';

const App: React.FC = () => {
  const socketServiceRef = useRef<SocketService | null>(null);
  
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerId, setPlayerId] = useState<'player1' | 'player2' | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [gameStatus, setGameStatus] = useState<GameStatus>('waiting');

  useKeyboardHandler(socketServiceRef.current, playerId);

  useEffect(() => {
    socketServiceRef.current = new SocketService();
    const socketService = socketServiceRef.current;

    socketService.onConnect(() => {
      setConnectionStatus('connected');
    });

    socketService.onPlayerAssigned((data) => {
      console.log(data.playerId, 'data.playerId');
      setPlayerId(data.playerId);
      setGameStatus('waiting for opponent');
    });

    socketService.onGameFull(() => {
      setConnectionStatus('Game is full');
    });

    socketService.onGameStarted(() => {
      setGameStatus('playing');
    });

    socketService.onGameEnded(() => {
      setGameStatus('opponent disconnected');
    });

    socketService.onGameState((state) => {
      setGameState(state);
    });

    socketService.onPlayerScored((data) => {
      console.log(`${data.scorer} scored!`, data.score);
    });

    socketService.onGameOver((data) => {
      if (data.winner === playerId) {
        alert('You won!');
      } else {
        alert('You lost!');
      }
      setGameStatus('waiting');
    });

    socketService.onDisconnect(() => {
      setConnectionStatus('disconnected');
    });

    return () => {
      socketService.disconnect();
    };
  }, [playerId]);

  return (
    <div className="w-screen h-screen bg-gray-900 text-white relative overflow-hidden flex justify-between">
      <StatusPanel 
        connectionStatus={connectionStatus}
        gameStatus={gameStatus}
        playerId={playerId}
      />

      <GameCanvas 
        gameState={gameState}
        playerId={playerId}
      />

      <ControlsPanel />

      <WaitingOverlay gameStatus={gameStatus} />
    </div>
  );
};

export default App;