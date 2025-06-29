import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CityMap from '@/components/CityMap';
import { Place, Weather } from '@/types';

// Mock react-leaflet components
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="marker">{children}</div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popup">{children}</div>
  ),
}));

// Mock Leaflet
jest.mock('leaflet', () => ({
  Icon: {
    Default: {
      prototype: {},
      mergeOptions: jest.fn(),
    },
  },
  latLngBounds: jest.fn(() => ({
    extend: jest.fn(),
  })),
}));

const mockWeather: Weather = {
  main: {
    temp: 20,
    humidity: 65,
  },
  weather: [
    {
      main: 'Clear',
      description: 'clear sky',
      icon: '01d',
    },
  ],
  wind: {
    speed: 5,
  },
  clouds: {
    all: 20,
  },
  coord: {
    lat: 40.7128,
    lon: -74.0060,
  },
  sys: {
    country: 'US',
  },
};

const mockPlaces: Place[] = [
  {
    fsq_place_id: '1',
    name: 'Central Park',
    location: {
      address: 'New York, NY',
    },
    distance: 1000,
    latitude: 40.7829,
    longitude: -73.9654,
  },
  {
    fsq_place_id: '2',
    name: 'Times Square',
    location: {
      address: 'Manhattan, NY',
    },
    distance: 2000,
    latitude: 40.7580,
    longitude: -73.9855,
  },
];

describe('CityMap', () => {
  it('renders map with places', () => {
    render(
      <CityMap
        places={mockPlaces}
        weather={mockWeather}
        cityName="New York"
      />
    );

    expect(screen.getByText('Places of Interest in New York')).toBeInTheDocument();
    expect(screen.getByText('2 locations found')).toBeInTheDocument();
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getAllByTestId('marker')).toHaveLength(3); // 2 places + 1 city center
  });

  it('shows message when no places have coordinates', () => {
    const placesWithoutCoords: Place[] = [
      {
        fsq_place_id: '1',
        name: 'Place without coords',
        distance: 1000,
      },
    ];

    render(
      <CityMap
        places={placesWithoutCoords}
        weather={mockWeather}
        cityName="New York"
      />
    );

    expect(
      screen.getByText('No places with coordinates available for New York')
    ).toBeInTheDocument();
  });

  it('displays correct place information in popups', () => {
    render(
      <CityMap
        places={mockPlaces}
        weather={mockWeather}
        cityName="New York"
      />
    );

    expect(screen.getByText('Central Park')).toBeInTheDocument();
    expect(screen.getByText('Times Square')).toBeInTheDocument();
    expect(screen.getByText('New York, NY')).toBeInTheDocument();
    expect(screen.getByText('Manhattan, NY')).toBeInTheDocument();
  });
}); 