'use client';
import { AppProvider } from '@/context/AppContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AppProvider>
      {children}
    </AppProvider>
  );
} 