import { useEffect, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { Station } from './types'
import StationMarker from './components/StationMarker'
import Overlay from './components/Overlay'
import Loading from './components/Loading'
import ErrorMessage from './components/ErrorMessage'

const OSLO_CENTER: [number, number] = [59.913, 10.74]

export default function App() {
  const [stations, setStations] = useState<Station[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetch('/api/stations')
      .then((res) => {
        if (!res.ok) throw new Error(`Server svarte ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        setStations(data)
        setError(null)
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const retry = () => {
    setLoading(true)
    setError(null)
    setReloadKey((k) => k + 1)
  }

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} onRetry={retry} />

  return (
    <div className="relative h-svh w-full">
      <Overlay />
      <MapContainer center={OSLO_CENTER} zoom={13} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stations.map((s) => (
          <StationMarker key={s.id} station={s} />
        ))}
      </MapContainer>
    </div>
  )
}
