import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import { AppProvider } from '@/context/AppContext'
import { City } from '@/types'

// Mock data for testing
export const mockCityData: City = {
  name: 'Bhopal',
  weather: {
    coord: { lat: 23.2599, lon: 77.4126 },
    weather: [
      {
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }
    ],
    main: {
      temp: 25.5,
      humidity: 65
    },
    wind: {
      speed: 2.1
    },
    clouds: {
      all: 0
    },
    sys: {
      country: 'IN'
    }
  },
  country: {
    name: {
      common: 'India'
    },
    region: 'Asia',
    subregion: 'Southern Asia'
  },
  places: [
    {
      fsq_place_id: 'test-place-1',
      name: 'Upper Lake',
      location: {
        address: 'Bhopal, Madhya Pradesh'
      },
      distance: 1000,
      latitude: 23.2599,
      longitude: 77.4126
    }
  ]
}

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppProvider>
      {children}
    </AppProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything from testing library
export * from '@testing-library/react'
export { customRender as render, screen, waitFor }
export const fireEvent = userEvent

// Mock API responses
export const mockApiResponses = {
  success: {
    ok: true,
    status: 200,
    json: async () => mockCityData
  },
  error: {
    ok: false,
    status: 404,
    json: async () => ({ error: 'City not found' })
  },
  serverError: {
    ok: false,
    status: 500,
    json: async () => ({ error: 'Internal server error' })
  }
}

// Helper function to mock fetch
export const mockFetch = (response: Partial<Response>) => {
  return (global.fetch as jest.Mock).mockResolvedValue(response);
}

// Helper function to wait for async operations
export const waitForAsync = (): Promise<void> => new Promise(resolve => setTimeout(resolve, 0)); 