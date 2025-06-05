import { useEffect, useRef, useCallback } from 'react';
import { SocketService } from '../services/socketService';
import type { PaddleMoveData } from '../types/game';

export const useKeyboardHandler = (
  socketService: SocketService | null,
  playerId: 'player1' | 'player2' | null
) => {
  const keysRef = useRef<Record<string, boolean>>({});

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!keysRef.current[e.key] && socketService) {
      keysRef.current[e.key] = true;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        const moveData1: PaddleMoveData = { direction: -1 };
        const moveData2: PaddleMoveData = { direction: 1 };
        socketService.emitPaddleMove(playerId === 'player1' ? moveData1 : moveData2);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        const moveData1: PaddleMoveData = { direction: 1 };
        const moveData2: PaddleMoveData = { direction: -1 };
        socketService.emitPaddleMove(playerId === 'player1' ? moveData1 : moveData2);
      }
    }
  }, [playerId, socketService]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysRef.current[e.key] = false;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' ||
      e.key === 'a' || e.key === 'A' || e.key === 'd' || e.key === 'D') {
      if (socketService) {
        socketService.emitPaddleStop();
      }
    }
  }, [socketService]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
};