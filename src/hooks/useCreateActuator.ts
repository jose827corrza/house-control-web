import { useState } from "react";
import { houseService } from "../api/houseService";

export function useCreateActuator(refetchHouses: () => void) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const createActuator = async (houseId: string, actuatorName: string) => {
    setIsUpdating(true);
    setMutationError(null);
    try {
      // Call your new POST service endpoint here
      await houseService.addActuator(houseId, actuatorName);
      
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

  return { createActuator, isUpdating, mutationError };
}