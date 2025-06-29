import { City } from '@/types';
import { cityCache } from './cache';

export async function fetchCityData(cityName: string): Promise<City> {
  // Check cache first
  const cachedData = cityCache.get(cityName);
  if (cachedData) {
    return cachedData;
  }

  try {
    // Construct API URL based on environment
    let apiUrl: string;
    
    if (typeof window !== 'undefined') {
      // Client-side: use relative URL
      apiUrl = `/api/search?city=${encodeURIComponent(cityName)}`;
    } else {
      // Server-side: use absolute URL with localhost
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
      const host = process.env.VERCEL_URL || process.env.HOSTNAME || 'localhost';
      const port = process.env.PORT || '3000';
      
      // For Vercel deployment, use the VERCEL_URL
      if (process.env.VERCEL_URL) {
        apiUrl = `${protocol}://${host}/api/search?city=${encodeURIComponent(cityName)}`;
      } else {
        // For local development
        apiUrl = `${protocol}://${host}:${port}/api/search?city=${encodeURIComponent(cityName)}`;
      }
    }
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'City data fetch failed');
    }
    
    const data = await response.json();
    
    // Cache the result
    cityCache.set(cityName, data);
    
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch city data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Function to clear cache (useful for testing or manual refresh)
export function clearCityCache(): void {
  cityCache.clear();
}

// Function to get cache statistics
export function getCacheStats() {
  return cityCache.getStats();
} 