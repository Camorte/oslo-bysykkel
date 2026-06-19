// Shape we serve to clients.
export interface Station {
  id: string;
  name: string;
  availableLocks: number;
  availableBikes: number; // total, incl. e-bikes
  bikesByType: { bike: number; ebike: number };
  lat: number;
  lon: number;
}

// Raw GBFS feed shapes (only the fields we use).
export interface StationInfo {
  station_id: string;
  name: string;
  lat: number;
  lon: number;
}

export interface StationStatus {
  station_id: string;
  num_bikes_available: number;
  num_docks_available: number;
  vehicle_types_available?: { vehicle_type_id: string; count: number }[];
}
