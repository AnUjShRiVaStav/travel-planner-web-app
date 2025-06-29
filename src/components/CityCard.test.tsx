import React from 'react'
import { render, screen } from '@/test/utils/testUtils'
import CityCard from '@/components/CityCard'
import { mockCityData } from '../test/utils/testUtils'

// Mock the toast module
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Removed AppContext mock to use the real provider from test-utils

describe('CityCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render city information and weather icon correctly', () => {
      render(<CityCard city={mockCityData} showRemoveButton={true} />)

      // Check if city name is displayed - use flexible matching since it's split across elements
      const bhopalElements = screen.getAllByText((content, element) => {
        return element?.textContent?.includes('Bhopal') || false
      })
      expect(bhopalElements.length).toBeGreaterThan(0)

      // Check if weather information is displayed
      expect(screen.getByText('25.5°C')).toBeInTheDocument()
      expect(screen.getByText('clear sky')).toBeInTheDocument()

      // Check if country information is displayed
      const indiaElements = screen.getAllByText((content, element) => {
        return element?.textContent?.includes('India') || false
      })
      expect(indiaElements.length).toBeGreaterThan(0)
      const asiaElements = screen.getAllByText((content, element) => {
        return element?.textContent?.includes('Asia') || false
      })
      expect(asiaElements.length).toBeGreaterThan(0)
      expect(screen.getByText('Upper Lake')).toBeInTheDocument()

      // Weather icon should render correctly
      const weatherIcon = screen.getByAltText(/clear sky/i)
      expect(weatherIcon).toBeInTheDocument()
      expect(weatherIcon).toHaveAttribute('src', expect.stringContaining('01d'))
      expect(screen.getByText(/65%/)).toBeInTheDocument()
      expect(screen.getByText(/2.1 m\/s/)).toBeInTheDocument()
    })
  })

  describe('Action Buttons', () => {
    it('should show save button when showRemoveButton is false', () => {
      render(<CityCard city={mockCityData} showRemoveButton={false} />)

      expect(screen.getByRole('button', { name: /save.*bhopal.*dashboard/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /remove.*bhopal.*dashboard/i })).not.toBeInTheDocument()
    })

    it('should show remove button when showRemoveButton is true', () => {
      render(<CityCard city={mockCityData} showRemoveButton={true} />)

      expect(screen.getByRole('button', { name: /remove.*bhopal.*dashboard/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /save.*bhopal.*dashboard/i })).not.toBeInTheDocument()
    })
  })

  describe('Places Section', () => {

    it('should handle city with no places', () => {
      const cityWithoutPlaces = {
        ...mockCityData,
        places: []
      }

      render(<CityCard city={cityWithoutPlaces} showRemoveButton={true} />)

      expect(screen.getByText('Top Places to Visit')).toBeInTheDocument()
      expect(screen.getByText('No places found.')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<CityCard city={mockCityData} showRemoveButton={true} />)

      const weatherIcon = screen.getByAltText(/clear sky/i)
      expect(weatherIcon).toBeInTheDocument()

      const removeButton = screen.getByRole('button', { name: /remove.*bhopal/i })
      expect(removeButton).toHaveAttribute('aria-label', expect.stringContaining('Remove'))

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('Bhopal')
    })
  })

  describe('Missing weather data', () => {
    it('should handle missing weather data successfully', () => {
      const cityWithMissingWeather = {
        ...mockCityData,
        weather: {
          ...mockCityData.weather,
          main: { temp: 0, humidity: 0 },
          weather: []
        }
      }

      render(<CityCard city={cityWithMissingWeather} showRemoveButton={true} />)

      // Should still render the city name - use getAllByText since multiple elements contain "Bhopal"
      const bhopalElements = screen.getAllByText((content, element) => {
        return element?.textContent?.includes('Bhopal') || false
      })
      expect(bhopalElements.length).toBeGreaterThan(0)
    })

    it('should handle missing country data successfully', () => {
      const cityWithMissingCountry = {
        ...mockCityData,
        country: {
          name: { common: '' },
          region: '',
          subregion: ''
        }
      }

      render(<CityCard city={cityWithMissingCountry} showRemoveButton={true} />)

      // Should still render the city name - use getAllByText since multiple elements contain "Bhopal"
      const bhopalElements = screen.getAllByText((content, element) => {
        return element?.textContent?.includes('Bhopal') || false
      })
      expect(bhopalElements.length).toBeGreaterThan(0)
    })
  })
}) 