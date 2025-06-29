'use client';
import { useState, useEffect } from 'react';
import { use } from 'react';
import { fetchCityData } from '@/lib/api';
import CityCard from '@/components/CityCard';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { City } from '@/types';

const LazyCityMap = dynamic(() => import('@/components/CityMap'), {
  loading: () => (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
      <div className="animate-pulse">
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-300">Loading map...</p>
        </div>
      </div>
    </div>
  ),
  ssr: false,
});

type Props = {
  params: Promise<{
    name: string;
  }>;
};

export default function CityPage({ params }: Props) {
  const [cityData, setCityData] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);
  const cityName = use(params).name;

  useEffect(() => {
    const loadCityData = async () => {
      try {
        setLoading(true);
        const data = await fetchCityData(cityName);
        setCityData(data);
        toast.success(`Loaded ${cityName}! 🌍`, {
          duration: 2000,
          position: 'top-right',
          style: {
            background: '#10b981',
            color: '#fff',
          },
        });
      } catch {
        toast.error('Failed to load city data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCityData();
  }, [cityName]);

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto p-6" role="main">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
              role="status"
              aria-label="Loading"
            ></div>
            <p className="text-gray-600 dark:text-gray-300">
              Loading {cityName}...
            </p>
            <div className="sr-only" aria-live="polite">
              Loading city data for {cityName}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!cityData) {
    return (
      <main className="max-w-4xl mx-auto p-6" role="main">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Could not load {cityName}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            City data not available
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Return to search page"
          >
            <span role="img" aria-label="back arrow">←</span> Back to Search
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      {/* Structured Data for SEO */}
      {cityData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "City",
              "name": cityData.name,
              "description": `Travel information, weather, and places of interest in ${cityData.name}`,
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": cityData.weather.coord.lat,
                "longitude": cityData.weather.coord.lon
              },
              "containedInPlace": cityData.country?.name?.common,
              "weather": cityData.weather.weather?.[0]?.description,
              "placesOfInterest": cityData.places?.map(place => ({
                "@type": "Place",
                "name": place.name,
                "address": place.location?.address,
                "geo": place.latitude && place.longitude ? {
                  "@type": "GeoCoordinates",
                  "latitude": place.latitude,
                  "longitude": place.longitude
                } : undefined,
                "distance": place.distance
              }))
            })
          }}
        />
      )}
      <main className="max-w-4xl mx-auto p-6" role="main">
        <header>
          <nav aria-label="Breadcrumb">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              aria-label="Return to search page"
            >
              <span role="img" aria-label="back arrow">←</span> Back to Search
            </Link>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {cityName} - City Details
          </h1>
        </header>

        <section aria-label="City information" className="mb-8">
          <CityCard city={cityData} showRemoveButton={false} />
        </section>

        <section aria-label="City map">
          <LazyCityMap
            places={cityData.places}
            weather={cityData.weather}
            cityName={cityName}
          />
        </section>
      </main>
    </>
  );
} 