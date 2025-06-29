import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CityPage from '@/app/city/[name]/page';
import { fetchCityData } from '@/lib/api';
import { use } from 'react';
import { AppProvider } from '@/context/AppContext';

// Mock the API module
jest.mock('@/lib/api', () => ({
  fetchCityData: jest.fn(),
}));

// Mock the toast module
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  Toaster: () => null,
}));

// Mock the CityMap component to avoid react-leaflet issues
jest.mock('@/components/CityMap', () => {
  return function MockCityMap() {
    return <div data-testid="city-map">Mock City Map</div>
  }
});

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/test',
}));

// Mock the use hook
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: jest.fn(),
}));

describe('CityPage Integration', () => {
  const mockFetchCityData = fetchCityData as jest.MockedFunction<typeof fetchCityData>;
  const mockUse = use as jest.MockedFunction<typeof use>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render city page with data', async () => {
    const mockCityData = {
      name: 'Test City',
      weather: {
        main: { temp: 25, humidity: 60 },
        weather: [{ main: 'Clear', description: 'sunny', icon: '01d' }],
        wind: { speed: 5 },
        clouds: { all: 20 },
        coord: { lat: 40, lon: -74 },
        sys: { country: 'US' },
      },
      country: {
        name: { common: 'United States' },
        region: 'Americas',
        subregion: 'North America',
      },
      places: [
        {
          fsq_place_id: '1',
          name: 'Test Place',
          location: { address: 'Test Address' },
          distance: 100,
          latitude: 40,
          longitude: -74,
        },
      ],
    };

    mockUse.mockReturnValue({ name: 'test-city' });
    mockFetchCityData.mockResolvedValue(mockCityData);

    render(
      <AppProvider>
        <CityPage params={Promise.resolve({ name: 'test-city' })} />
      </AppProvider>
    );

    await waitFor(() => {
      expect(screen.getByText((content) => content.includes('Test City'))).toBeInTheDocument();
    });
  });

  it('should handle loading state', () => {
    mockUse.mockReturnValue({ name: 'test-city' });
    mockFetchCityData.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <AppProvider>
        <CityPage params={Promise.resolve({ name: 'test-city' })} />
      </AppProvider>
    );

    expect(screen.getByText('Loading test-city...')).toBeInTheDocument();
  });

  it('should handle error state', async () => {
    mockUse.mockReturnValue({ name: 'test-city' });
    mockFetchCityData.mockRejectedValue(new Error('City not found'));

    render(
      <AppProvider>
        <CityPage params={Promise.resolve({ name: 'test-city' })} />
      </AppProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Could not load test-city')).toBeInTheDocument();
    });
  });
}); 