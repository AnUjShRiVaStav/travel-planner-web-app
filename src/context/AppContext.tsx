'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { City } from '@/types';
import toast from 'react-hot-toast';

interface AppContextType {
  savedCities: City[];
  addCity: (city: City) => void;
  removeCity: (cityName: string) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [savedCities, setSavedCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load cities from localStorage on mount
  useEffect(() => {
    const localCities = localStorage.getItem('savedCities');
    if (localCities) {
      try {
        setSavedCities(JSON.parse(localCities));
      } catch {
        // Silently fail - localStorage parsing error
      }
    }
  }, []);

  const addCity = (city: City) => {
    setIsLoading(true);
    
    // Check if city is already saved
    const isAlreadySaved = savedCities.find(c => c.name === city.name);
    if (isAlreadySaved) {
      toast.error(`${city.name} is already saved!`, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
      setIsLoading(false);
      return;
    }

    // Add city to saved cities
    const updatedCities = [city, ...savedCities];
    setSavedCities(updatedCities);
    localStorage.setItem('savedCities', JSON.stringify(updatedCities));
    
    toast.success(`${city.name} saved to local storage! 🌍`, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#fff',
      },
      icon: '💾',
    });
    
    setIsLoading(false);
  };

  const removeCity = (cityName: string) => {
    setIsLoading(true);
    
    // Remove city from saved cities
    const updatedCities = savedCities.filter(city => city.name !== cityName);
    setSavedCities(updatedCities);
    localStorage.setItem('savedCities', JSON.stringify(updatedCities));
    
    toast.success(`${cityName} removed from local storage.`, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#f87171',
        color: '#fff',
      },
      icon: '🗑️',
    });
    
    setIsLoading(false);
  };

  const value: AppContextType = {
    savedCities,
    addCity,
    removeCity,
    isLoading,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
