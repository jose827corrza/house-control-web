import React, { useEffect, useState } from 'react';
import { HouseCard } from './HouseCard';
import type { HouseInfo } from '../types/api';
import { useHouseMutations } from '../hooks/useActuatorMutation';

interface HouseListProps {
  housesArray: HouseInfo[];
  refetchHouses: () => void;
}

export const HouseList: React.FC<HouseListProps> = ({ housesArray, refetchHouses }) => {
  const [houses, setHouses] = useState<HouseInfo[]>(housesArray);
  const { toggleActuator } = useHouseMutations(refetchHouses);

  useEffect(() => {
    setHouses(housesArray);
  }, [housesArray]);

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
    </div>
  );
};