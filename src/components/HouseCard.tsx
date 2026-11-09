import React, { useState } from 'react';
import type { HouseInfo, Actuator } from '../types/api';
import { useCreateActuator } from '../hooks/useCreateActuator';

interface HouseCardProps {
  house: HouseInfo;
  onToggleActuator: (houseId: string, actuatorId: string, status: boolean) => void;
  refetchHouses: () => void;
}

export const HouseCard: React.FC<HouseCardProps> = ({ house, onToggleActuator, refetchHouses }) => {
  const [expanded, setExpanded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newActuatorName, setNewActuatorName] = useState('');
  const [isSubmitting] = useState(false);

  const { createActuator } = useCreateActuator(refetchHouses);

const handleCreateActuator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActuatorName.trim()) return;

    try {
      // Calls the POST endpoint and triggers silent refetch automatically
      await createActuator(house.id, newActuatorName.trim());
      
      setNewActuatorName('');
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to add actuator", err);
    }
  };

  return (
    <div className="border border-gray-700 rounded-lg p-4 mb-4 bg-gray-900 text-white shadow-md relative">
      {/* House Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
        <div
          className="cursor-pointer select-none flex-1"
          onClick={() => setExpanded(!expanded)}
        >
          <h2 className="text-lg font-bold">{house.name}</h2>
          <p className="text-xs font-mono text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/50 px-2 py-0.5 rounded-md inline-block">{house.id}</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Add Actuator Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center text-xs font-medium px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-700 hover:bg-indigo-600 transition-colors"
          >
            + Add Actuator
          </button>

          <span
            className="text-sm text-blue-400 cursor-pointer select-none"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? '▲ Collapse' : '▼ Expand'} ({house.actuators.length})
          </span>
        </div>
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
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${actuator.isActive
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold mb-2">Add New Actuator</h3>
            <p className="text-sm text-gray-400 mb-4">House: <span className="text-white font-semibold">{house.name}</span></p>

            <form onSubmit={handleCreateActuator}>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                  Actuator Name (e.g., Living Room Light)
                </label>
                <input
                  type="text"
                  value={newActuatorName}
                  onChange={(e) => setNewActuatorName(e.target.value)}
                  placeholder="Enter name..."
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  autoFocus
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded font-medium transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded font-medium transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};