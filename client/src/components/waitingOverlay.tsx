import React from 'react';
import type { GameStatus } from '../types/game';

interface WaitingOverlayProps {
  gameStatus: GameStatus;
}

const WaitingOverlay: React.FC<WaitingOverlayProps> = ({ gameStatus }) => {
  if (gameStatus === 'waiting for opponent') {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-20">
        <div className="text-center p-8 bg-blue-900 rounded-lg">
          <p className="text-blue-200 text-xl mb-2">
            Waiting for another player...
          </p>
          <p className="text-sm text-blue-300">
            Open this page in another tab or share with a friend!
          </p>
        </div>
      </div>
    );
  }

  if (gameStatus === 'opponent disconnected') {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-20">
        <div className="text-center p-8 bg-red-900 rounded-lg">
          <p className="text-red-200 text-xl mb-2">
            Opponent disconnected
          </p>
          <p className="text-sm text-red-300">
            Waiting for a new opponent...
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default WaitingOverlay;