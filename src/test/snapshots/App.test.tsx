import React from 'react'
import { render } from '@/test/utils/testUtils'
import Home from '@/app/page'

// Mock the toast module
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  Toaster: () => null,
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

describe('App Snapshot Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Home Page', () => {
    it('should match snapshot for home page', () => {
      const { container } = render(<Home />)
      expect(container).toMatchSnapshot()
    })

    it('should render main heading', () => {
      const { container } = render(<Home />)
      const heading = container.querySelector('h1')
      expect(heading).toHaveTextContent('Travel Planner')
    })

    it('should render search form', () => {
      const { container } = render(<Home />)
      const form = container.querySelector('form')
      expect(form).toBeInTheDocument()
    })

    it('should render search input', () => {
      const { container } = render(<Home />)
      const input = container.querySelector('input[type="text"]')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('placeholder', 'Search city...')
    })

    it('should render search button', () => {
      const { container } = render(<Home />)
      const button = container.querySelector('button[type="submit"]')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Search')
    })
  })

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      const { container } = render(<Home />)

      // Check for main landmark
      const main = container.querySelector('main')
      expect(main).toBeInTheDocument()
      expect(main).toHaveAttribute('role', 'main')

      // Check for header
      const header = container.querySelector('header')
      expect(header).toBeInTheDocument()

      // Check for heading hierarchy
      const h1 = container.querySelector('h1')
      expect(h1).toBeInTheDocument()
    })

    it('should have proper form labels', () => {
      const { container } = render(<Home />)

      const label = container.querySelector('label')
      expect(label).toBeInTheDocument()
      expect(label).toHaveTextContent('Search for a city')
    })

    it('should have proper ARIA attributes', () => {
      const { container } = render(<Home />)

      const input = container.querySelector('input')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('placeholder', 'Search city...')

      // Check for search form role
      const form = container.querySelector('form')
      expect(form).toHaveAttribute('role', 'search')
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive classes', () => {
      const { container } = render(<Home />)

      const main = container.querySelector('main')
      expect(main).toHaveClass('max-w-3xl')
      expect(main).toHaveClass('mx-auto')
      expect(main).toHaveClass('p-4')
    })

    it('should have dark mode support', () => {
      const { container } = render(<Home />)

      const heading = container.querySelector('h1')
      expect(heading).toHaveClass('dark:text-white')

      const paragraph = container.querySelector('p')
      expect(paragraph).toHaveClass('dark:text-gray-300')
    })
  })

  describe('Component Structure', () => {
    it('should render SearchBar component', () => {
      const { container } = render(<Home />)

      // Check for search form
      const form = container.querySelector('form[role="search"]')
      expect(form).toBeInTheDocument()
    })

    it('should have proper section structure', () => {
      const { container } = render(<Home />)

      // Initially no sections should be present (only appears after search)
      const sections = container.querySelectorAll('section')
      expect(sections.length).toBe(0)

      // But the main element should be present
      const main = container.querySelector('main')
      expect(main).toBeInTheDocument()
    })
  })

  describe('Content', () => {
    it('should display app title', () => {
      const { container } = render(<Home />)

      const title = container.querySelector('h1')
      expect(title).toHaveTextContent('🌍 Travel Planner')
    })

    it('should display app description', () => {
      const { container } = render(<Home />)

      const description = container.querySelector('p')
      expect(description).toHaveTextContent('Search for any city to get weather information')
    })
  })
}) 