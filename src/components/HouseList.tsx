import React, { useState } from 'react';
import { HouseCard } from './HouseCard';
import type { HouseInfo } from '../types/api';
import { houseService } from '../api/houseService';

interface HouseListProps {
  housesArray: HouseInfo[];
}

export const HouseList: React.FC<HouseListProps> = ({ housesArray }) => {
  const [houses, setHouses] = useState<HouseInfo[]>(housesArray);

  const handleToggleActuator = async (houseId: string, actuatorId: string, currentStatus: boolean) => {
    console.log(`Toggling actuator ${actuatorId} for house ${houseId} to ${currentStatus ? 'OFF' : 'ON'}`);
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
      await houseService.updateActuatorState(houseId, actuatorId, !currentStatus);
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

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="max-h-[75vh] overflow-y-auto pr-2 space-y-4">
        {houses.map((house) => (
          <HouseCard 
            key={house.id} 
            house={house} 
            onToggleActuator={handleToggleActuator} 
          />
        ))}
      </div>
    </div>
  );
};