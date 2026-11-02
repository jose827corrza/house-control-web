import { useState } from "react";
import { houseService } from "../api/houseService";

// Inside your hooks or extended from useHouseData
export function useHouseMutations(refetchHouses: () => void) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const toggleActuator = async (houseId: string, actuatorId: string, newState: boolean) => {
    setIsUpdating(true);
    setMutationError(null);
    try {
      // Call your new POST service endpoint here
      await houseService.updateActuatorState(houseId, actuatorId, newState);
      
      // Refresh the house data to stay in sync with the backend
      refetchHouses();
    } catch (err: any) {
      console.error("Failed to update actuator:", err);
      setMutationError(err.message || "Failed to update device state");
      // Optional: revert local UI state here if you did an optimistic update
    } finally {
      setIsUpdating(false);
    }
  };

  return { toggleActuator, isUpdating, mutationError };
}