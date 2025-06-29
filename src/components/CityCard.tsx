// src/components/CityCard.tsx
'use client';
import React from 'react';
import { WiCloud, WiHumidity, WiStrongWind } from 'react-icons/wi';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { City, Place } from '@/types';
import Image from 'next/image';

type CityCardProps = {
  city: City;
  showRemoveButton?: boolean;
};

export default function CityCard({ city, showRemoveButton = false }: CityCardProps) {
  const { name, weather, country, places } = city;
  const { addCity, savedCities, removeCity } = useAppContext();
  const searchCityName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  const pathname = usePathname();

  const handleSaveCity = () => {
    const isAlreadySaved = savedCities.find((c: City) => c.name === name);
    if (isAlreadySaved) {
      return;
    } else {
      addCity(city);
    }
  };

  const handleRemoveCity = () => {
    removeCity(name);
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: 'save' | 'remove') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (action === 'save') {
        handleSaveCity();
      } else {
        handleRemoveCity();
      }
    }
  };

  // Get weather icon URL from OpenWeatherMap
  const getWeatherIconUrl = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  // Get weather emoji for fallback
  const getWeatherEmoji = (weatherMain: string) => {
    switch (weatherMain) {
      case 'Clear': return '☀️';
      case 'Clouds': return '☁️';
      case 'Rain': return '🌧️';
      case 'Snow': return '❄️';
      case 'Thunderstorm': return '⛈️';
      case 'Drizzle': return '🌦️';
      case 'Mist':
      case 'Fog': return '🌫️';
      default: return '🌤️';
    }
  };

  return (
    <article
      className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-gray-900 text-gray-900 dark:text-white rounded-3xl p-8 shadow-xl mt-8 border border-gray-200 dark:border-gray-700 transition-all duration-500 ease-out hover:shadow-2xl hover:scale-[1.02] transform card-enter-active scale-in"
      aria-labelledby={`city-title-${name}`}
    >
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex-1 slide-in-left">
          <header>
            <h2
              id={`city-title-${name}`}
              className="text-4xl font-extrabold tracking-tight fade-in"
            >
              {searchCityName}, {country?.name?.common}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 fade-in stagger-1">
              {country?.region} — {country?.subregion}
            </p>
          </header>

          <div className="flex gap-2 mt-1 mb-4 slide-in-up stagger-2">
            {!showRemoveButton && (
              <button
                onClick={handleSaveCity}
                onKeyDown={(e) => handleKeyDown(e, 'save')}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-1 px-3 rounded text-sm transition-all duration-300 ease-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`Save ${name} to dashboard`}
              >
                <span role="img" aria-label="save" className="inline-block animate-bounce-slow">💾</span> Save City
              </button>
            )}
            {showRemoveButton && (
              <button
                onClick={handleRemoveCity}
                onKeyDown={(e) => handleKeyDown(e, 'remove')}
                className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white py-1 px-3 rounded text-sm transition-all duration-300 ease-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label={`Remove ${name} from dashboard`}
              >
                <span role="img" aria-label="delete" className="inline-block animate-pulse-slow">🗑️</span> Remove City
              </button>
            )}
            {pathname !== `/city/${encodeURIComponent(name)}` && (
              <Link
                href={`/city/${encodeURIComponent(name)}`}
                className="text-blue-500 underline text-sm flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded transition-all duration-300 ease-out hover:scale-105"
                aria-label={`View detailed information for ${name}`}
              >
                <span role="img" aria-label="view details" className="inline-block animate-pulse-slow">🔍</span> View Full Details
              </Link>
            )}
          </div>

          <section aria-labelledby={`weather-section-${name}`} className="slide-in-up stagger-3">
            <div className="flex items-center space-x-6 mb-6">
              <div className="text-6xl float" role="img" aria-label="temperature">🌡</div>
              <div>
                <p className="text-3xl font-semibold fade-in">{weather?.main?.temp}°C</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 capitalize fade-in stagger-1">{weather?.weather?.[0]?.description}</p>
              </div>
            </div>

            <div
              className="grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300"
              role="list"
              aria-label="Weather details"
            >
              <div className="flex items-center space-x-2 slide-in-left stagger-1" role="listitem">
                <WiHumidity className="text-2xl animate-pulse-slow" aria-hidden="true" />
                <span>Humidity: {weather?.main?.humidity}%</span>
              </div>
              <div className="flex items-center space-x-2 slide-in-left stagger-2" role="listitem">
                <WiStrongWind className="text-2xl animate-pulse-slow" aria-hidden="true" />
                <span>Wind: {weather?.wind?.speed} m/s</span>
              </div>
              <div className="flex items-center space-x-2 slide-in-left stagger-3" role="listitem">
                <WiCloud className="text-2xl animate-pulse-slow" aria-hidden="true" />
                <span>Clouds: {weather?.clouds?.all}%</span>
              </div>
            </div>
          </section>
        </div>

        <div className="hidden md:block flex-1 flex items-center justify-center slide-in-right">
          {weather?.weather?.[0]?.icon ? (
            <Image
              src={getWeatherIconUrl(weather.weather[0].icon)}
              alt={`${weather.weather[0].description} weather icon`}
              width={192}
              height={192}
              className="h-48 w-48 opacity-90 transition-all duration-500 ease-out hover:scale-110 float"
              unoptimized
              onError={(e) => {
                // Fallback to emoji if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div
            className={`text-8xl ${weather?.weather?.[0]?.icon ? 'hidden' : ''} float`}
            role="img"
            aria-label={`${weather?.weather?.[0]?.description || 'weather'} icon`}
          >
            {getWeatherEmoji(weather?.weather?.[0]?.main)}
          </div>
        </div>
      </div>

      <section className="mt-10 slide-in-up stagger-4" aria-labelledby={`places-section-${name}`}>
        <div className="flex items-center justify-between mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
          <h3
            id={`places-section-${name}`}
            className="text-xl font-bold fade-in"
          >
            <span role="img" aria-label="location" className="inline-block animate-bounce-slow">📍</span> Top Places to Visit
          </h3>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          role="list"
          aria-label={`Places to visit in ${name}`}
        >
          {places.length > 0 ? (
            places.map((place: Place, index: number) => (
              <div
                key={place.fsq_place_id}
                className={`bg-gray-50 dark:bg-white/5 backdrop-blur-md p-4 rounded-lg border border-gray-200 dark:border-gray-600 transition-all duration-300 ease-out hover:shadow-lg hover:scale-105 transform slide-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
                role="listitem"
              >
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white fade-in">{place.name}</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm fade-in stagger-1">
                  {place.location?.address || 'No address provided'}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs fade-in stagger-2">
                  {place.distance} meters away
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 fade-in" role="status">No places found.</p>
          )}
        </div>
      </section>
    </article>
  );
}
