import type { HouseInfo, RawHouseInfo } from '../types/api';
import { apiClient } from './client'

export const houseService = {
    async getHouses(): Promise<RawHouseInfo[]> {
        const response = await apiClient.get('/houses');
        return response.data;
    }
}

export function normalizeHouses(rawHouses: RawHouseInfo[]): HouseInfo[] {
    const houses = rawHouses.map((rawHouse) => ({
        id: rawHouse.house_id,
        name: rawHouse.house_name,
        actuators: Object.entries(rawHouse.actuators).map(([id, rawActuator]) => ({
            id,
            name: rawActuator.name,
            isActive: rawActuator.is_active
        }))
    }));
    return houses;
}