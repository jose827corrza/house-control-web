import React, { useState } from 'react';
import type { HouseInfo, Actuator } from '../types/api';

interface HouseCardProps {
  house: HouseInfo;
  onToggleActuator: (houseId: string, actuatorId: string, status: boolean) => void;
}

export const HouseCard: React.FC<HouseCardProps> = ({ house, onToggleActuator }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border border-gray-700 rounded-lg p-4 mb-4 bg-gray-900 text-white shadow-md">
      <div 
        className="flex justify-between items-center cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <h2 className="text-lg font-bold">{house.name}</h2>
          <p className="text-xs text-gray-500 font-mono">{house.id}</p>
        </div>
        <span className="text-sm text-blue-400">
          {expanded ? '▲ Collapse' : '▼ Expand'} ({house.actuators.length} Actuators)
        </span>
      </div>

      {expanded && (
        <div className="mt-4 border-t border-gray-800 pt-3 space-y-2">
          {house.actuators.map((actuator: Actuator) => (
            <div 
              key={actuator.id} 
              className="flex justify-between items-center bg-gray-800 p-2.5 rounded-md"
            >
              <div>
                <span className="font-medium">{actuator.name}</span>
                <span className="text-xs text-gray-400 ml-2 font-mono">({actuator.id.slice(0, 8)}...)</span>
              </div>
              
              <button
                onClick={() => onToggleActuator(house.id, actuator.id, actuator.isActive)}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                  actuator.isActive 
                    ? 'bg-green-600 hover:bg-green-500 text-white' 
                    : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                }`}
              >
                {actuator.isActive ? 'ON' : 'OFF'}
              </button>
            </div>
          ))}
          {house.actuators.length === 0 && (
            <p className="text-sm text-gray-500 italic">No actuators found for this house.</p>
          )}
        </div>
      )}
    </div>
  );
};