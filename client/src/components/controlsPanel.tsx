import React from 'react';

const ControlsPanel: React.FC = () => {
  return (
    <div className="z-10 bg-black bg-opacity-50 p-3 rounded text-right">
      <h3 className="text-sm font-semibold mb-1">Controls</h3>
      <div className="text-xs text-gray-300">
        <p>A/D or ← → to move paddle</p>
        <p className="text-green-400">Your paddle: Green (bottom)</p>
        <p className="text-gray-400">Opponent: White (top)</p>
      </div>
    </div>
  );
};

export default ControlsPanel;