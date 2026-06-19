import { test } from "node:test";
import assert from "node:assert/strict";
import { mergeStations } from "./merge.ts";

const info = [
  { station_id: "2", name: "Bislett", lat: 59.92, lon: 10.73 },
  { station_id: "1", name: "Aker Brygge", lat: 59.91, lon: 10.72 },
];

const status = [
  {
    station_id: "1",
    num_bikes_available: 5,
    num_docks_available: 10,
    vehicle_types_available: [
      { vehicle_type_id: "bike", count: 3 },
      { vehicle_type_id: "ebike", count: 2 },
    ],
  },
  { station_id: "2", num_bikes_available: 0, num_docks_available: 15 },
];

test("merges info and status by station_id, splitting bikes by type", () => {
  const result = mergeStations(info, status);
  const aker = result.find((s) => s.id === "1");
  assert.deepEqual(aker, {
    id: "1",
    name: "Aker Brygge",
    availableLocks: 10,
    availableBikes: 5,
    bikesByType: { bike: 3, ebike: 2 },
    lat: 59.91,
    lon: 10.72,
  });
});

test("defaults bike types to 0 when status omits the breakdown", () => {
  const bislett = mergeStations(info, status).find((s) => s.id === "2");
  assert.deepEqual(bislett?.bikesByType, { bike: 0, ebike: 0 });
});

test("sorts stations by name", () => {
  const result = mergeStations(info, status);
  assert.deepEqual(
    result.map((s) => s.name),
    ["Aker Brygge", "Bislett"],
  );
});

test("drops stations that have no status", () => {
  const result = mergeStations(
    [...info, { station_id: "3", name: "Ghost", lat: 0, lon: 0 }],
    status,
  );
  assert.equal(result.length, 2);
  assert.ok(!result.some((s) => s.id === "3"));
});
