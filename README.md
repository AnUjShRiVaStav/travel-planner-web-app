# TMTC Travel Planner

A modern travel planning application built with Next.js that helps you discover cities, check weather conditions, and explore places of interest with an interactive map.

## Features

- **City Search**: Search for cities worldwide and get detailed information
- **Weather Information**: Real-time weather data including temperature, humidity, and conditions
- **Places of Interest**: Discover popular locations and attractions in each city
- **Interactive Map**: View places of interest on an interactive Leaflet map with markers and popups
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Support**: Automatic dark/light mode based on system preferences

## Getting Started

### Installation

```bash
yarn install
```

### Running Locally

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment Variables

To run this application locally, you need to generate the following API keys:

- **WEATHER_API_KEY**: Required for weather data functionality
- **PLACES_API_KEY**: Required for places of interest data

Create a `.env.local` file in the root directory and add your API keys:

```env
WEATHER_API_KEY=your_weather_api_key_here
PLACES_API_KEY=your_places_api_key_here
```

## Map Features

The application includes an interactive map powered by Leaflet that displays:

- **City Center Marker**: Shows the main city location with weather information
- **Places of Interest Markers**: Interactive markers for each location with:
  - Place name and address
  - Distance from city center
  - Clickable popups with detailed information
- **Automatic Bounds**: Map automatically adjusts to show all locations
- **Responsive Design**: Map adapts to different screen sizes

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet with react-leaflet
- **Testing**: Jest with React Testing Library
- **Icons**: React Icons
- **Notifications**: React Hot Toast
- **Package Manager**: Yarn
- **Environment Variables**: WEATHER_API_KEY, PLACES_API_KEY

## Project Structure

```
src/
├── app/                   # Next.js app router pages
│   ├── api/               # API routes
│   │   ├── robots.txt/    # Robots.txt API route
│   │   └── search/        # Search API endpoint
│   ├── city/              # City pages
│   │   └── [name]/        # Dynamic city route
│   │       ├── layout.tsx # City page layout
│   │       └── page.tsx   # City detail page
│   ├── dashboard/         # Dashboard page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── CityCard.tsx       # City information display
│   ├── CityCard.test.tsx  # CityCard component tests
│   ├── CityMap.tsx        # Interactive map component
│   ├── CityMap.test.tsx   # CityMap component tests
│   ├── Navigation.tsx     # Navigation component
│   ├── Navigation.test.tsx # Navigation component tests
│   ├── Providers.tsx      # Context providers
│   ├── SearchBar.tsx      # City search functionality
│   └── SearchBar.test.tsx # SearchBar component tests
├── context/               # React context providers
│   └── AppContext.tsx     # Main app context
├── lib/                   # API and utility functions
│   ├── api.ts             # API functions
│   ├── api.test.ts        # API tests
│   ├── cache.ts           # Caching utilities
│   └── cache.test.ts      # Cache tests
├── test/                  # Test files
│   ├── integration/       # Integration tests
│   ├── snapshots/         # Snapshot tests
│   └── utils/             # Test utilities
└── types/                 # TypeScript type definitions
    └── index.ts           # Type definitions
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Leaflet Documentation](https://leafletjs.com/) - interactive maps for the web
- [React Leaflet](https://react-leaflet.js.org/) - React components for Leaflet maps
- [Tailwind CSS](https://tailwindcss.com/) - utility-first CSS framework

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
