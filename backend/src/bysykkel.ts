const BASE = "https://gbfs.urbansharing.com/oslobysykkel.no";

// Oslo Bysykkel requires identifying the client via this header.
const HEADERS = { "Client-Identifier": "oslo-bysykkel-demo" };

export interface Station {
  id: string;
  name: string;
  availableLocks: number;
  availableBikes: number; // total, incl. e-bikes
  bikesByType: { bike: number; ebike: number };
  lat: number;
  lon: number;
}

interface StationInfo {
  station_id: string;
  name: string;
  lat: number;
  lon: number;
}

interface StationStatus {
  station_id: string;
  num_bikes_available: number;
  num_docks_available: number;
  vehicle_types_available?: { vehicle_type_id: string; count: number }[];
}

export function mergeStations(
  info: StationInfo[],
  status: StationStatus[],
): Station[] {
  const statusById = new Map(status.map((s) => [s.station_id, s]));
  return info
    .map((station) => {
      const s = statusById.get(station.station_id);
      if (!s) return null;
      const byType = new Map(
        (s.vehicle_types_available ?? []).map((v) => [v.vehicle_type_id, v.count]),
      );
      return {
        id: station.station_id,
        name: station.name,
        availableLocks: s.num_docks_available,
        availableBikes: s.num_bikes_available,
        bikesByType: {
          bike: byType.get("bike") ?? 0,
          ebike: byType.get("ebike") ?? 0,
        },
        lat: station.lat,
        lon: station.lon,
      };
    })
    .filter((s): s is Station => s !== null)
    .sort((a, b) => a.name.localeCompare(b.name, "nb"));
}

async function fetchFeed<T>(feed: string): Promise<T[]> {
  const res = await fetch(`${BASE}/${feed}.json`, { headers: HEADERS });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${feed}: ${res.status} ${res.statusText}`);
  }
  const body = (await res.json()) as { data: { stations: T[] } };
  return body.data.stations;
}

export async function getStations(): Promise<Station[]> {
  const [info, status] = await Promise.all([
    fetchFeed<StationInfo>("station_information"),
    fetchFeed<StationStatus>("station_status"),
  ]);
  return mergeStations(info, status);
}
