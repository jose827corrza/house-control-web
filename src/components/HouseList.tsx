import React, { useEffect, useState } from 'react';
import { HouseCard } from './HouseCard';
import type { HouseInfo } from '../types/api';
import { useHouseMutations } from '../hooks/useActuatorMutation';
import { useCreateHouse } from '../hooks/useCreateHouse';

interface HouseListProps {
  housesArray: HouseInfo[];
  refetchHouses: () => void;
}

export const HouseList: React.FC<HouseListProps> = ({ housesArray, refetchHouses }) => {
  const [houses, setHouses] = useState<HouseInfo[]>(housesArray);
  const [newHouseName, setNewHouseName] = useState('');
  const [isHouseModalOpen, setIsHouseModalOpen] = useState(false);
  const [isSubmittingHouse, setIsSubmittingHouse] = useState(false);
  const [houseError, setHouseError] = useState<string | null>(null);
  const { toggleActuator } = useHouseMutations(refetchHouses);
  const { createHouse } = useCreateHouse(refetchHouses); // Use the new hook for creating houses

  useEffect(() => {
    setHouses(housesArray);
  }, [housesArray]);

  const handleToggleActuator = async (houseId: string, actuatorId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    setHouses((prevHouses) =>
      prevHouses.map((house) => {
        if (house.id !== houseId) return house;

        return {
          ...house,
          actuators: house.actuators.map((actuator) =>
            actuator.id === actuatorId ? { ...actuator, isActive: nextStatus } : actuator
          ),
        };
      })
    );

    try {
      await toggleActuator(houseId, actuatorId, nextStatus);
    } catch (error) {
      console.error("Failed to update actuator:", error);

      setHouses((prevHouses) =>
        prevHouses.map((house) => {
          if (house.id !== houseId) return house;

          return {
            ...house,
            actuators: house.actuators.map((actuator) =>
              actuator.id === actuatorId ? { ...actuator, isActive: currentStatus } : actuator
            ),
          };
        })
      );
    }
  };

  const handleCreateHouseSubmit = async (e: React.FormEvent) =>{
    e.preventDefault();

    if(!newHouseName.trim()) return;

    try {
      setIsSubmittingHouse(true);
      setHouseError(null);

      await createHouse(newHouseName);

      setNewHouseName('');
      setIsHouseModalOpen(false);
      refetchHouses();
    } catch (err: any) {
      console.error("Failed to create house:", err);
      setHouseError(err.message || "Failed to create house. Please try again.");
    } finally {
      setIsSubmittingHouse(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-1">
      <div className="max-h-[75vh] overflow-y-auto pr-2 space-y-4">
        {houses.map((house) => (
          <HouseCard 
            key={house.id} 
            house={house} 
            onToggleActuator={handleToggleActuator} 
            refetchHouses={refetchHouses}
          />
        ))}
      </div>

      <button
        onClick={() => setIsHouseModalOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-500 text-white font-bold p-4 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105 z-40 group"
        title="Add New House"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 ease-in-out text-sm">
          Add House
        </span>
      </button>

      {isHouseModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold text-white mb-2">Create New House</h3>
            <p className="text-sm text-gray-400 mb-4">Add a new property linked to your account.</p>

            {houseError && (
              <p className="text-red-500 text-xs mb-3">{houseError}</p>
            )}

            <form onSubmit={handleCreateHouseSubmit}>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                  House Name
                </label>
                <input
                  type="text"
                  value={newHouseName}
                  onChange={(e) => setNewHouseName(e.target.value)}
                  placeholder="e.g., Beach House, Downtown Apartment"
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  autoFocus
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsHouseModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded font-medium transition-colors"
                  disabled={isSubmittingHouse}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded font-medium transition-colors disabled:opacity-50"
                  disabled={isSubmittingHouse}
                >
                  {isSubmittingHouse ? 'Creating...' : 'Create House'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};