import type { Station, StationInfo, StationStatus } from "./types.ts";
import { mergeStations } from "./merge.ts";

const BASE = "https://gbfs.urbansharing.com/oslobysykkel.no";

// Oslo Bysykkel requires identifying the client via this header.
const HEADERS = { "Client-Identifier": "oslo-bysykkel-demo" };

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
