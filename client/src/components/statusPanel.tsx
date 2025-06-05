import React from 'react';
import type { ConnectionStatus, GameStatus } from '../types/game';

interface StatusPanelProps {
  connectionStatus: ConnectionStatus;
  gameStatus: GameStatus;
  playerId: 'player1' | 'player2' | null;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ connectionStatus, gameStatus, playerId }) => {
  const getStatusColor = (): string => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'disconnected': return 'text-red-500';
      default: return 'text-red-500';
    }
  };

  const getGameStatusColor = (): string => {
    switch (gameStatus) {
      case 'playing': return 'text-green-500';
      case 'waiting for opponent': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="z-10 bg-black bg-opacity-50 p-3 rounded">
      <div className="space-y-1 text-sm">
        <p className={getStatusColor()}>
          Connection: {connectionStatus}
        </p>
        <p className={getGameStatusColor()}>
          Status: {gameStatus}
        </p>
        {playerId && (
          <p className="text-blue-400">
            You are {playerId}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatusPanel;