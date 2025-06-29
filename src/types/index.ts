export interface Weather {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  clouds: {
    all: number;
  };
  coord: {
    lat: number;
    lon: number;
  };
  sys: {
    country: string;
  };
}

export interface Country {
  name: {
    common: string;
  };
  region: string;
  subregion: string;
}

export interface Place {
  fsq_place_id: string;
  name: string;
  location?: {
    address?: string;
  };
  distance: number;
  latitude?: number;
  longitude?: number;
}

export interface City {
  name: string;
  weather: Weather;
  country: Country;
  places: Place[];
} 