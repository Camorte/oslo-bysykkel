import { CircleMarker, Popup } from 'react-leaflet'
import type { Station } from '../types'

const AVAILABLE = '#27ae60'
const EMPTY = '#c0392b'

export default function StationMarker({ station }: { station: Station }) {
  const color = station.availableBikes === 0 ? EMPTY : AVAILABLE
  return (
    <CircleMarker
      center={[station.lat, station.lon]}
      radius={8}
      color={color}
      fillColor={color}
      fillOpacity={0.7}
    >
      <Popup>
        <strong>{station.name}</strong>
        <ul className="m-0 mt-1.5 grid list-none gap-1 p-0 text-sm">
          <li title="Vanlige sykler">
            🚲 {station.bikesByType.bike} ledige sykler
          </li>
          <li title="El-sykler">
            ⚡ {station.bikesByType.ebike} ledige el-sykler
          </li>
          <li title="Låser">🔒 {station.availableLocks} ledige låser</li>
        </ul>
      </Popup>
    </CircleMarker>
  )
}
