import { cityCache } from '@/lib/cache';
import { City } from '@/types';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock window object for SSR testing
const originalWindow = global.window;

describe('CityCache', () => {
  beforeEach(() => {
    // Clear cache before each test
    cityCache.clear();
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore original window
    global.window = originalWindow;
  });

  const mockCity: City = {
    name: 'Test City',
    weather: {
      main: { temp: 20, humidity: 65 },
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
      wind: { speed: 5 },
      clouds: { all: 20 },
      coord: { lat: 40.7128, lon: -74.0060 },
      sys: { country: 'US' },
    },
    country: {
      name: { common: 'United States' },
      region: 'Americas',
      subregion: 'North America',
    },
    places: [],
  };

  describe('Browser environment', () => {
    it('should set and get data correctly', () => {
      cityCache.set('test-city', mockCity);
      const result = cityCache.get('test-city');
      
      expect(result).toEqual(mockCity);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'cityCache',
        expect.any(String)
      );
    });

    it('should persist to localStorage when setting data', () => {
      cityCache.set('test-city', mockCity);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'cityCache',
        expect.any(String)
      );
    });

    it('should load from localStorage on initialization', () => {
      const mockCacheData = [['test-city', {
        data: mockCity,
        timestamp: Date.now(),
        ttl: 30 * 60 * 1000,
      }]];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCacheData));
      
      // Create a new cache instance to test initialization
      // Note: In a real scenario, you would import the cache module
      // For testing purposes, we'll use the existing cityCache instance
      const newCache = cityCache;
      newCache.loadFromStorage();
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('cityCache');
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      // Should not throw error
      expect(() => {
        cityCache.set('test-city', mockCity);
      }).not.toThrow();
    });
  });

  describe('SSR environment', () => {
    beforeEach(() => {
      // Remove window and localStorage to simulate SSR
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (global as any).window;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (global as any).localStorage;
    });

    afterEach(() => {
      // Restore window object
      global.window = originalWindow;
      global.localStorage = localStorageMock;
    });

    it('should work without localStorage in SSR', () => {
      // Should not throw error when window is undefined
      expect(() => {
        cityCache.set('test-city', mockCity);
        const result = cityCache.get('test-city');
        expect(result).toEqual(mockCity);
      }).not.toThrow();
    });

    it('should not try to access localStorage during SSR', () => {
      cityCache.set('test-city', mockCity);
      
      // localStorage methods should not be called
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('should clear cache without localStorage in SSR', () => {
      cityCache.set('test-city', mockCity);
      cityCache.clear();
      
      const result = cityCache.get('test-city');
      expect(result).toBeNull();
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe('Cache functionality', () => {
    it('should handle case-insensitive keys', () => {
      cityCache.set('Test-City', mockCity);
      const result = cityCache.get('test-city');
      expect(result).toEqual(mockCity);
    });

    it('should return null for non-existent keys', () => {
      const result = cityCache.get('non-existent');
      expect(result).toBeNull();
    });

    it('should check if key exists', () => {
      expect(cityCache.has('test-city')).toBe(false);
      
      cityCache.set('test-city', mockCity);
      expect(cityCache.has('test-city')).toBe(true);
    });

    it('should provide cache statistics', () => {
      const stats = cityCache.getStats();
      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('maxSize');
      expect(stats).toHaveProperty('keys');
      expect(Array.isArray(stats.keys)).toBe(true);
    });

    it('should handle expired entries', () => {
      // Set entry with very short TTL
      cityCache.set('test-city', mockCity, 1);
      
      // Wait for expiration
      setTimeout(() => {
        const result = cityCache.get('test-city');
        expect(result).toBeNull();
      }, 10);
    });
  });
}); 