import React, { useRef, useEffect } from 'react';
import type { GameState } from '../types/game';
import { transformGameState } from '../utils/gameUtils';

interface GameCanvasProps {
  gameState: GameState | null;
  playerId: 'player1' | 'player2' | null;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, playerId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!gameState || !canvasRef.current) return;

    const canvas: HTMLCanvasElement = canvasRef.current;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const scaleX = width / 800;
    const scaleY = height / 600;

    const transformedState = transformGameState(gameState, playerId, 800, 600);

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    ctx.setLineDash([5 * scaleX, 15 * scaleX]);
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(
      transformedState.ball.x * scaleX,
      transformedState.ball.y * scaleY,
      transformedState.ball.radius * ((scaleX + scaleY) / 2),
      0, Math.PI * 2
    );
    ctx.fillStyle = '#fff';
    ctx.fill();

    ctx.fillStyle = '#4ade80';
    ctx.fillRect(
      transformedState.paddles.player1.x * scaleX,
      transformedState.paddles.player1.y * scaleY,
      transformedState.paddles.player1.width * scaleX,
      transformedState.paddles.player1.height * scaleY
    );

    ctx.fillStyle = '#fff';
    ctx.fillRect(
      transformedState.paddles.player2.x * scaleX,
      transformedState.paddles.player2.y * scaleY,
      transformedState.paddles.player2.width * scaleX,
      transformedState.paddles.player2.height * scaleY
    );

    ctx.font = `${48 * ((scaleX + scaleY) / 2)}px Arial`;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(transformedState.score.player1.toString(), width / 2, height - 50 * scaleY);
    ctx.fillText(transformedState.score.player2.toString(), width / 2, 80 * scaleY);

  }, [gameState, playerId]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="block w-2/3 h-full"
      tabIndex={0}
    />
  );
};

export default GameCanvas;