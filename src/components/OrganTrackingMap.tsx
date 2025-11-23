import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { Icon, LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default icons in react-leaflet
const createIcon = (iconUrl: string) => new Icon({
  iconUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

// Create custom icons
const donorIcon = createIcon('data:image/svg+xml;base64,' + btoa(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10b981">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
`))

const hospitalIcon = createIcon('data:image/svg+xml;base64,' + btoa(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6">
    <path d="M12 2L3 7v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7l-9-5zM12 17H8v-2h4v2zm0-4H8v-2h4v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
  </svg>
`))

const transportIcon = createIcon('data:image/svg+xml;base64,' + btoa(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f59e0b">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
`))

interface TrackingData {
  id: string
  organType: string
  donorLocation: LatLngExpression
  hospitalLocation: LatLngExpression
  currentLocation: LatLngExpression
  route: LatLngExpression[]
  status: string
  donorName: string
  hospitalName: string
  progress: number
}

interface OrganTrackingMapProps {
  trackingId?: string
}

export const OrganTrackingMap: React.FC<OrganTrackingMapProps> = ({ trackingId }) => {
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching tracking data from Firebase
    const fetchTrackingData = async () => {
      try {
        setLoading(true)
        
        // Mock data centered on Andhra Pradesh - registered AP donors only
        const mockData: TrackingData = {
          id: trackingId || 'TRN-001',
          organType: 'Heart',
          donorLocation: [16.5062, 80.6480], // Vijayawada, AP
          hospitalLocation: [17.3850, 78.4867], // Hyderabad, AP
          currentLocation: [16.8409, 79.5941], // Midway point near Guntur
          route: [
            [16.5062, 80.6480], // Vijayawada
            [16.7087, 80.3707], // Guntur
            [16.8409, 79.5941], // Current position
            [17.1568, 78.9491], // Approaching Hyderabad
            [17.3850, 78.4867]  // Apollo Hospitals, Hyderabad
          ],
          status: 'In Transit',
          donorName: 'Vijayawada Medical Center',
          hospitalName: 'Apollo Hospitals, Hyderabad',
          progress: 75
        }
        
        setTrackingData(mockData)
      } catch (error) {
        console.error('Failed to fetch tracking data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrackingData()
  }, [trackingId])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-muted rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }

  if (!trackingData) {
    return (
      <div className="h-full flex items-center justify-center bg-muted rounded-lg">
        <p className="text-muted-foreground">No tracking data available</p>
      </div>
    )
  }

  // Calculate center point for map
  const centerLat = (trackingData.donorLocation[0] + trackingData.hospitalLocation[0]) / 2
  const centerLng = (trackingData.donorLocation[1] + trackingData.hospitalLocation[1]) / 2
  const center: LatLngExpression = [centerLat, centerLng]

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={[17.0000, 79.0000]} // Centered on Andhra Pradesh
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Route line */}
        <Polyline
          positions={trackingData.route}
          color="hsl(var(--primary))"
          weight={4}
          opacity={0.7}
          dashArray="10, 10"
        />
        
        {/* Donor location */}
        <Marker position={trackingData.donorLocation} icon={donorIcon}>
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-success">Donor Location</h3>
              <p className="text-sm">{trackingData.donorName}</p>
              <p className="text-xs text-muted-foreground">
                Organ Type: {trackingData.organType}
              </p>
            </div>
          </Popup>
        </Marker>
        
        {/* Current transport location */}
        <Marker position={trackingData.currentLocation} icon={transportIcon}>
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-warning">Current Location</h3>
              <p className="text-sm">Transport in progress</p>
              <p className="text-xs text-muted-foreground">
                Progress: {trackingData.progress}%
              </p>
              <p className="text-xs text-muted-foreground">
                Status: {trackingData.status}
              </p>
            </div>
          </Popup>
        </Marker>
        
        {/* Hospital destination */}
        <Marker position={trackingData.hospitalLocation} icon={hospitalIcon}>
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-accent">Destination Hospital</h3>
              <p className="text-sm">{trackingData.hospitalName}</p>
              <p className="text-xs text-muted-foreground">
                Awaiting organ arrival
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}