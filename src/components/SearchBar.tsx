'use client';
import { useState } from 'react';
import { fetchCityData } from '@/lib/api';
import toast from 'react-hot-toast';
import { City } from '@/types';

type Props = {
    setSearchResult: (data: City) => void;
};

export default function SearchBar({ setSearchResult }: Props) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) {
            toast.error('Please enter a city name!', {
                duration: 3000,
                position: 'top-right',
                style: {
                    background: '#ef4444',
                    color: '#fff',
                },
            });
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = await fetchCityData(query);
            setSearchResult(data);
            toast.success(`Found ${query}! 🌍`, {
                duration: 3000,
                position: 'top-right',
                style: {
                    background: '#10b981',
                    color: '#fff',
                },
                icon: '✅',
            });
        } catch {
            toast.error('Failed to search for city. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form 
            onSubmit={handleSearch} 
            className="mb-6"
            role="search"
            aria-label="Search for a city"
        >
            <div className="space-y-3">
                <label htmlFor="city-search" className="sr-only">
                    Search for a city
                </label>
                <input
                    id="city-search"
                    type="text"
                    placeholder="Search city..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="p-3 border border-gray-300 
                    dark:border-gray-600 
                    rounded-lg w-full 
                    bg-white 
                    dark:bg-zinc-800 
                    text-gray-900
                     dark:text-white placeholder-gray-500 
                     dark:placeholder-gray-400 focus:outline-none 
                     focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent 
                     transition-colors duration-200"
                    aria-describedby={error ? "search-error" : undefined}
                    aria-invalid={!!error}
                    aria-required="true"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                />
                <button
                    type="submit"
                    className="mt-3 w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    disabled={loading}
                    aria-describedby={loading ? "loading-status" : undefined}
                >
                    {loading ? 'Loading...' : 'Search'}
                </button>
                {loading && (
                    <div id="loading-status" className="sr-only" aria-live="polite">
                        Searching for city data...
                    </div>
                )}
                {error && (
                    <p 
                        id="search-error" 
                        className="text-red-500 dark:text-red-400 mt-2 text-sm"
                        role="alert"
                        aria-live="assertive"
                    >
                        {error}
                    </p>
                )}
            </div>
        </form>
    );
}
