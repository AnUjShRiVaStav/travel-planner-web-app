import { Metadata } from 'next';
import { fetchCityData } from '@/lib/api';

const DEFAULT_CITY_IMAGE = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'; // fallback image
const TWITTER_HANDLE = '';

type Props = {
  children: React.ReactNode;
  params: Promise<{ name: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const cityName = decodeURIComponent(resolvedParams.name);

    try {
      const cityData = await fetchCityData(cityName);
      const weather = cityData.weather;
      const country = cityData.country;

      const title = `${cityName}, ${country?.name?.common} - Travel Information`;
      const description = `Weather: ${weather?.main?.temp}°C, ${weather?.weather?.[0]?.description}. Country: ${country?.name?.common}. Region: ${country?.region}.`;
      const weatherIconUrl = weather?.weather?.[0]?.icon
        ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`
        : undefined;
      const twitterImage = weatherIconUrl || DEFAULT_CITY_IMAGE;

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          type: 'website',
          images: [
            {
              url: twitterImage,
              width: 400,
              height: 400,
              alt: weather?.weather?.[0]?.description
                ? `${weather?.weather?.[0]?.description} weather in ${cityName}`
                : `${cityName} city image`,
            }
          ],
          siteName: 'TMTC Travel Planner',
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [twitterImage],
          site: TWITTER_HANDLE,
          creator: TWITTER_HANDLE,
        },
        other: {
          'geo.region': country?.region,
          'geo.placename': cityName,
          'geo.position': `${weather?.coord?.lat};${weather?.coord?.lon}`,
          'ICBM': `${weather?.coord?.lat}, ${weather?.coord?.lon}`,
        },
      };
    } catch {
      // Handle error silently
      return {
        title: `${cityName} - TMTC Travel Planner`,
        description: `Explore ${cityName} with weather information and places of interest.`,
      };
    }
  } catch {
    return {
      title: 'City - TMTC Travel Planner',
      description: 'Explore cities with weather information and places of interest.',
    };
  }
}

export default function CityLayout({ children }: Props) {
  return children;
} 