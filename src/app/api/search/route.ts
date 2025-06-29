import { NextRequest, NextResponse } from 'next/server';

const OPENWEATHER_API = 'https://api.openweathermap.org/data/2.5/weather';
const RESTCOUNTRIES_API = 'https://restcountries.com/v3.1/alpha';
const FOURSQUARE_API = 'https://places-api.foursquare.com/places/search';

const OPENWEATHER_KEY = process.env.WEATHER_API_KEY;
const FOURSQUARE_KEY = process.env.PLACES_API_KEY;

export async function GET(request: NextRequest) {
  try {
    // Check if required environment variables are set
    if (!OPENWEATHER_KEY) {
      return NextResponse.json(
        { error: 'Weather API key not configured' },
        { status: 500 }
      );
    }

    if (!FOURSQUARE_KEY) {
      return NextResponse.json(
        { error: 'Places API key not configured' },
        { status: 500 }
      );
    }

    // Safely parse the URL and search parameters
    let searchParams;
    try {
      const url = request.url;
      
      if (!url) {
        throw new Error('Request URL is undefined');
      }
      
      const urlObj = new URL(url);
      searchParams = urlObj.searchParams;
    } catch {
      return NextResponse.json(
        { error: 'Invalid request URL' },
        { status: 400 }
      );
    }

    const cityName = searchParams.get('city');

    if (!cityName) {
      return NextResponse.json({ error: 'City name is required' }, { status: 400 });
    }

    // Fetch weather data
    const weatherRes = await fetch(
      `${OPENWEATHER_API}?q=${encodeURIComponent(cityName)}&appid=${OPENWEATHER_KEY}&units=metric`
    );
    
    if (!weatherRes.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch weather data' },
        { status: weatherRes.status }
      );
    }
    
    const weather = await weatherRes.json();

    // Fetch country data
    const countryCode = weather.sys?.country;
    if (!countryCode) {
      throw new Error('No country code found in weather data');
    }
    
    const countryRes = await fetch(`${RESTCOUNTRIES_API}/${countryCode}`);
    if (!countryRes.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch country data' },
        { status: countryRes.status }
      );
    }
    
    const country = await countryRes.json();

    // Fetch places data
    const { lat, lon } = weather.coord;
    if (!lat || !lon) {
      throw new Error('No coordinates found in weather data');
    }
    
    const placesUrl = `${FOURSQUARE_API}?ll=${lat},${lon}&limit=5&fields=fsq_place_id,name,categories,latitude,longitude,location,distance`;

    const response = await fetch(placesUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${FOURSQUARE_KEY}`,
        'X-Places-Api-Version': '2025-06-17',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch places data' },
        { status: response.status }
      );
    }

    const places = await response.json();
    const result = {
      name: cityName,
      weather,
      country: country[0],
      places: places.results || [],
    };

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 