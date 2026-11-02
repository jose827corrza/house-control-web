import { useState, useEffect, useCallback } from "react";
import type { HouseInfo } from "../types/api";
import { houseService, normalizeHouses } from "../api/houseService";

export function useHouseData() {
    const [data, setData] = useState<HouseInfo[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStatus = useCallback(async (showLoading = true) => {
        console.log("🔄 Fetching houses data... Triggered by refetch?");
        try {
            if (showLoading) {
                setLoading(true);
            }
            const response = await houseService.getHouses();
            console.log("📥 Raw response received:", response);
            const normalizedData = normalizeHouses(response);
            setData(normalizedData);
            setError(null);
        } catch (err: any) {
            console.error("Error fetching house data:", err);
            setError(err.message || "An error occurred while fetching house data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    return { data, loading, error, refetch: () =>  fetchStatus(false) };
}