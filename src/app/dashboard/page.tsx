'use client';
import { useAppContext } from '@/context/AppContext';
import dynamic from 'next/dynamic';
import { City } from '@/types';

const LazyCityCard = dynamic(() => import('@/components/CityCard'), {
    loading: () => (
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 
        dark:to-gray-900 rounded-3xl p-8 shadow-xl mt-8 border 
        border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="flex flex-col md:flex-row justify-between">
                <div className="flex-1">
                    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>
                <div className="hidden md:block flex-1 flex items-center justify-center">
                    <div className="h-48 w-48 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
            </div>
        </div>
    ),
    ssr: false,
});

export default function DashboardPage() {
    const { savedCities } = useAppContext();

    return (
        <main className="max-w-5xl mx-auto p-6" role="main">
            <header>
                <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                    <span role="img" aria-label="pin">📌</span> Saved Cities
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Your collection of saved cities with weather and travel information.
                </p>
            </header>

            {savedCities.length === 0 ? (
                <section aria-label="Empty state">
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4" role="img" aria-label="empty folder">📁</div>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            No cities saved yet. Search and save one from the homepage.
                        </p>
                    </div>
                </section>
            ) : (
                <section aria-label="Saved cities list">
                    <div className="space-y-8" role="list" aria-label="Saved cities">
                        {savedCities.map((city: City, idx: number) => (
                            <div key={idx} role="listitem">
                                <LazyCityCard
                                    city={city}
                                    showRemoveButton={true}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
