import { City } from '@/types';

interface CacheEntry {
  data: City;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
};

class CityCache {
  private cache = new Map<string, CacheEntry>();
  private readonly DEFAULT_TTL = 30 * 60 * 1000; // 30 minutes for weather data
  private readonly MAX_CACHE_SIZE = 50; // Maximum number of cached cities

  set(key: string, data: City, ttl: number = this.DEFAULT_TTL): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key.toLowerCase(), {
      data,
      timestamp: Date.now(),
      ttl
    });

    // Persist to localStorage for page refreshes (only in browser)
    if (isBrowser()) {
      this.persistToStorage();
    }
  }

  get(key: string): City | null {
    const entry = this.cache.get(key.toLowerCase());
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key.toLowerCase());
      if (isBrowser()) {
        this.persistToStorage();
      }
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.cache.clear();
    if (isBrowser()) {
      this.persistToStorage();
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
      keys: Array.from(this.cache.keys())
    };
  }

  private persistToStorage(): void {
    if (!isBrowser()) {
      return;
    }

    try {
      const cacheData = Array.from(this.cache.entries());
      window.localStorage.setItem('cityCache', JSON.stringify(cacheData));
    } catch {
      // Silently fail - cache persistence is not critical
    }
  }

  // Load cache from localStorage on app startup
  loadFromStorage(): void {
    if (!isBrowser()) {
      return;
    }

    try {
      const cached = window.localStorage.getItem('cityCache');
      if (cached) {
        const cacheData = JSON.parse(cached) as [string, CacheEntry][];
        
        // Filter out expired entries
        const now = Date.now();
        const validEntries = cacheData.filter(([, entry]) => 
          now - entry.timestamp <= entry.ttl
        );

        this.cache = new Map(validEntries);
      }
    } catch {
      // Silently fail - cache loading is not critical
    }
  }
}

// Export singleton instance
export const cityCache = new CityCache();

// Initialize cache from storage (only in browser)
if (isBrowser()) {
  cityCache.loadFromStorage();
} 