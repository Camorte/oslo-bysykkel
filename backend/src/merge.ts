import type { Station, StationInfo, StationStatus } from "./types.ts";

// Joins the two GBFS feeds by station_id into the shape we serve.
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
