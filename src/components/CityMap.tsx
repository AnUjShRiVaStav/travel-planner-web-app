'use client';
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Place, Weather } from '@/types';

// Fix for default markers in Leaflet with Next.js
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

delete (L.Icon.Default.prototype as typeof L.Icon.Default.prototype & { _getIconUrl?: string })._getIconUrl;

interface CityMapProps {
  places: Place[];
  weather: Weather;
  cityName: string;
}

export default function CityMap({ places, weather, cityName }: CityMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  // Calculate center coordinates from weather data
  const centerLat = weather.coord.lat;
  const centerLng = weather.coord.lon;

  // Filter places that have coordinates
  const placesWithCoords = places.filter(
    (place) => place.latitude && place.longitude
  );

  useEffect(() => {
    // Fit bounds to include all markers when places change
    if (mapRef.current && placesWithCoords.length > 0) {
      const bounds = L.latLngBounds(
        placesWithCoords.map((place) => [
          place.latitude!,
          place.longitude!,
        ])
      );
      
      // Add some padding and include the city center
      bounds.extend([centerLat, centerLng]);
      mapRef.current.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [placesWithCoords, centerLat, centerLng]);

  if (placesWithCoords.length === 0) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          No places with coordinates available for {cityName}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Places of Interest in {cityName}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          {placesWithCoords.length} location{placesWithCoords.length !== 1 ? 's' : ''} found
        </p>
      </div>
      
      <div className="h-96 w-full">
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={12}
          className="h-full w-full"
          ref={mapRef}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* City center marker */}
          <Marker position={[centerLat, centerLng]}>
            <Popup>
              <div className="text-center">
                <h4 className="font-semibold text-gray-900">{cityName}</h4>
                <p className="text-sm text-gray-600">
                  {weather.weather[0]?.description}
                </p>
                <p className="text-sm text-gray-600">
                  {Math.round(weather.main.temp)}°C
                </p>
              </div>
            </Popup>
          </Marker>

          {/* Places of interest markers */}
          {placesWithCoords.map((place, index) => (
            <Marker
              key={`${place.fsq_place_id}-${index}`}
              position={[place.latitude!, place.longitude!]}
            >
              <Popup>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900">{place.name}</h4>
                  {place.location?.address && (
                    <p className="text-sm text-gray-600 mt-1">
                      {place.location.address}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(place.distance)}m away
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
} 