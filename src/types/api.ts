export interface RawHouseInfo {
    house_name: string;
    house_id: string;
    actuators: Record<string, RawActuator>;
}

export interface RawActuator {
    is_active: boolean;
    name: string;
}

// UI

export interface HouseInfo {
    id: string;
    name: string;
    actuators: Actuator[];
}

export interface Actuator {
    id: string;
    name: string;
    isActive: boolean;
}