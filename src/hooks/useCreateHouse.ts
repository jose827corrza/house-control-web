import { useState } from "react";
import { houseService } from "../api/houseService";

// Inside your hooks or extended from useHouseData
export function useCreateHouse(refetchHouses: () => void) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const createHouse = async (houseName: string) => {
    setIsUpdating(true);
    setMutationError(null);
    try {
      // Call your new POST service endpoint here
      await houseService.createHouse(houseName);
      
      // Refresh the house data to stay in sync with the backend
      refetchHouses();
    } catch (err: any) {
      console.error("Failed to create house:", err);
      setMutationError(err.message || "Failed to create ouse");
      // Optional: revert local UI state here if you did an optimistic update
    } finally {
      setIsUpdating(false);
    }
  };

  return { createHouse, isUpdating, mutationError };
}