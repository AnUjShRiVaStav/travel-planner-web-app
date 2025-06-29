import { fetchCityData } from '@/lib/api'

// Mock fetch globally
global.fetch = jest.fn()

const mockCityData = {
  name: 'Test City',
  country: { name: { common: 'Testland' }, region: 'TestRegion', subregion: 'TestSubregion' },
  weather: {
    main: { temp: 0, humidity: 0 },
    weather: [],
    wind: { speed: 0 },
    clouds: { all: 0 },
    coord: { lat: 0, lon: 0 },
    sys: { country: '' }
  },
  places: []
}

describe('API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchCityData', () => {
    it('should fetch city data successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCityData,
      });

      const result = await fetchCityData('Test City');

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/search?city=Test%20City',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      expect(result).toEqual(mockCityData);
    });

    it('should handle API errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ error: 'City not found' }),
      })

      await expect(fetchCityData('InvalidCity')).rejects.toThrow('Failed to fetch city data: City not found')
    })

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      await expect(fetchCityData('Bhopal')).rejects.toThrow('Failed to fetch city data: Network error')
    })

    it('should handle JSON parsing errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON')
        },
      })

      await expect(fetchCityData('Bhopal')).rejects.toThrow('Failed to fetch city data: Invalid JSON')
    })
  })
}) 