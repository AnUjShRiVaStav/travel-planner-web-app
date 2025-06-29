import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import SearchBar from '@/components/SearchBar'
import { fetchCityData } from '@/lib/api'
import '@testing-library/jest-dom'
import { City } from '@/types'
import userEvent from '@testing-library/user-event'
import toast from 'react-hot-toast'

// Mock the API module
jest.mock('@/lib/api', () => ({
  fetchCityData: jest.fn(),
}))

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    success: jest.fn(),
  },
  error: jest.fn(),
  success: jest.fn(),
}))

const mockFetchCityData = fetchCityData as jest.MockedFunction<typeof fetchCityData>
const mockToast = toast as jest.Mocked<typeof toast>

describe('SearchBar Component', () => {
  const mockSetSearchResult = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render search form with input and button', () => {
      render(<SearchBar setSearchResult={mockSetSearchResult} />)

      expect(screen.getByRole('search')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
    })

    it('should have proper accessibility attributes', () => {
      render(<SearchBar setSearchResult={mockSetSearchResult} />)

      const searchInput = screen.getByRole('textbox')
      expect(searchInput).toHaveAttribute('aria-required', 'true')
      expect(searchInput).toHaveAttribute('placeholder', 'Search city...')
    })
  })

  describe('Form Input Validation', () => {
    it('should update input value when typing', async () => {
      const user = userEvent.setup()
      render(<SearchBar setSearchResult={mockSetSearchResult} />)

      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'Bhopal')

      expect(searchInput).toHaveValue('Bhopal')
    })

    it('should handle special characters in city names', async () => {
      const user = userEvent.setup()
      render(<SearchBar setSearchResult={mockSetSearchResult} />)

      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'São Paulo')

      expect(searchInput).toHaveValue('São Paulo')
    })
  })

  describe('Search Functionality', () => {
    it('should call setSearchResult with city data on successful search', async () => {
      const mockCityData: City = {
        name: 'Bhopal',
        country: {
          name: { common: 'India' },
          region: 'Asia',
          subregion: 'Southern Asia'
        },
        weather: {
          main: {
            temp: 25,
            humidity: 60
          },
          weather: [{
            main: 'Clear',
            description: 'clear sky',
            icon: '01d'
          }],
          wind: {
            speed: 2.1
          },
          clouds: {
            all: 20
          },
          coord: {
            lat: 23.2599,
            lon: 77.4126
          },
          sys: {
            country: 'IN'
          }
        },
        places: [
          {
            fsq_place_id: '123',
            name: 'Upper Lake',
            distance: 1000,
            latitude: 23.2599,
            longitude: 77.4126
          }
        ]
      }

      mockFetchCityData.mockResolvedValue(mockCityData)

      const user = userEvent.setup()
      render(<SearchBar setSearchResult={mockSetSearchResult} />)

      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'Bhopal')

      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)

      await waitFor(() => {
        expect(mockFetchCityData).toHaveBeenCalledWith('Bhopal')
        expect(mockSetSearchResult).toHaveBeenCalledWith(mockCityData)
      })
    })

    it('should show loading state during search', async () => {
      mockFetchCityData.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

      const user = userEvent.setup()
      render(<SearchBar setSearchResult={mockSetSearchResult} />)

      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'Bhopal')

      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)

      expect(searchButton).toHaveTextContent('Loading...')
      expect(searchButton).toBeDisabled()
    })

    it('should handle search errors and show error message', async () => {
      mockFetchCityData.mockRejectedValue(new Error('City not found'))

      const user = userEvent.setup()
      render(<SearchBar setSearchResult={mockSetSearchResult} />)

      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'InvalidCity')

      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Failed to search for city. Please try again.')
      })
    })

    it('should disable button during search', async () => {
      mockFetchCityData.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

      const user = userEvent.setup()
      render(<SearchBar setSearchResult={mockSetSearchResult} />)

      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'Bhopal')

      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)

      expect(searchButton).toBeDisabled()
    })
  })

  describe('User Interactions', () => {
    it('should handle form submission via Enter key', async () => {
      const mockCityData: City = {
        name: 'Bhopal',
        country: {
          name: { common: 'India' },
          region: 'Asia',
          subregion: 'Southern Asia'
        },
        weather: {
          main: {
            temp: 25,
            humidity: 60
          },
          weather: [{
            main: 'Clear',
            description: 'clear sky',
            icon: '01d'
          }],
          wind: {
            speed: 2.1
          },
          clouds: {
            all: 20
          },
          coord: {
            lat: 23.2599,
            lon: 77.4126
          },
          sys: {
            country: 'IN'
          }
        },
        places: [
          {
            fsq_place_id: '123',
            name: 'Upper Lake',
            distance: 1000,
            latitude: 23.2599,
            longitude: 77.4126
          }
        ]
      }

      mockFetchCityData.mockResolvedValue(mockCityData)

      const user = userEvent.setup()
      render(<SearchBar setSearchResult={mockSetSearchResult} />)

      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'Bhopal')
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(mockFetchCityData).toHaveBeenCalledWith('Bhopal')
      })
    })

    it('should not submit form when pressing other keys', async () => {
      const user = userEvent.setup()
      render(<SearchBar setSearchResult={mockSetSearchResult} />)

      const searchInput = screen.getByRole('textbox')
      await user.type(searchInput, 'Bhopal')
      await user.keyboard('{Tab}')

      expect(mockFetchCityData).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should show error for empty search', async () => {
      const user = userEvent.setup()
      render(<SearchBar setSearchResult={mockSetSearchResult} />)

      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)

      expect(mockFetchCityData).not.toHaveBeenCalled()
    })
  })
}) 