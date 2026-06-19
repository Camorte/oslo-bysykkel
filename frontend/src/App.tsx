import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

interface Station {
  id: string
  name: string
  availableLocks: number
  availableBikes: number
  bikesByType: { bike: number; ebike: number }
  lat: number
  lon: number
}

const OSLO_CENTER: [number, number] = [59.913, 10.74]

export default function App() {
  const [stations, setStations] = useState<Station[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stations')
      .then((res) => {
        if (!res.ok) throw new Error(`Server svarte ${res.status}`)
        return res.json()
      })
      .then(setStations)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-6 text-center">Laster stasjoner…</p>
  if (error)
    return (
      <p className="p-6 text-center">Kunne ikke laste stasjoner: {error}</p>
    )

  return (
    <div className="relative h-svh w-full">
      <div className="absolute top-3 right-3 z-[1000] rounded-lg bg-white/90 px-4 py-3 shadow-md">
        <header>
          <h1 className="m-0 text-3xl font-semibold">Oslo Bysykkel</h1>
          <p className="mt-0.5 text-sm text-gray-600">
            Ledige sykler og låser akkurat nå
          </p>
        </header>

        <div className="mt-2.5 grid gap-1.5 border-t border-gray-300 pt-2.5 text-sm">
          <span>
            <i className="mr-1.5 inline-block h-3 w-3 rounded-full align-middle bg-[#27ae60]" />{' '}
            Ledige sykler
          </span>
          <span>
            <i className="mr-1.5 inline-block h-3 w-3 rounded-full align-middle bg-[#c0392b]" />{' '}
            Ingen sykler
          </span>
        </div>
      </div>

      <MapContainer center={OSLO_CENTER} zoom={13} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      {stations.map((s) => {
        const color = s.availableBikes === 0 ? '#c0392b' : '#27ae60'
        return (
          <CircleMarker
            key={s.id}
            center={[s.lat, s.lon]}
            radius={8}
            color={color}
            fillColor={color}
            fillOpacity={0.7}
          >
            <Popup>
              <strong>{s.name}</strong>
              <ul className="m-0 mt-1.5 grid list-none gap-1 p-0 text-sm">
                <li title="Vanlige sykler">
                  🚲 {s.bikesByType.bike} ledige sykler
                </li>
                <li title="El-sykler">
                  ⚡ {s.bikesByType.ebike} ledige el-sykler
                </li>
                <li title="Låser">🔒 {s.availableLocks} ledige låser</li>
              </ul>
            </Popup>
          </CircleMarker>
        )
      })}
      </MapContainer>
    </div>
  )
}
