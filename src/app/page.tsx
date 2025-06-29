'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { City } from '@/types';

// Lazy load SearchBar component for better performance
const LazySearchBar = dynamic(() => import('@/components/SearchBar'), {
  loading: () => (
    <div className="mb-6">
      <div className="space-y-3">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        <div className="h-12 bg-blue-600 rounded-lg animate-pulse"></div>
      </div>
    </div>
  ),
});

// Lazy load CityCard component for better performance
const LazyCityCard = dynamic(() => import('@/components/CityCard'), {
  loading: () => (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 
    dark:to-gray-900 rounded-3xl p-8 
    shadow-xl mt-8 border border-gray-200
     dark:border-gray-700 animate-pulse">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex-1">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="hidden md:block flex-1 flex items-center justify-center">
          <div className="h-48 w-48 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>
  ),
});

export default function Home() {
  const [searchResult, setSearchResult] = useState<City | null>(null);

  return (
    <main className="max-w-3xl mx-auto p-4" role="main">
      <header>
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          <span role="img" aria-label="globe">🌍</span> Travel Planner
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Search for any city to get weather information, country details, and nearby places to visit.
        </p>
      </header>

      <LazySearchBar setSearchResult={setSearchResult} />

      {searchResult && (
        <section aria-label="Search results">
          <LazyCityCard city={searchResult} />
        </section>
      )}
    </main>
  );
}
