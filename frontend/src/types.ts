export interface Station {
  id: string
  name: string
  availableLocks: number
  availableBikes: number
  bikesByType: { bike: number; ebike: number }
  lat: number
  lon: number
}
