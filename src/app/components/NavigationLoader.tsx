'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoading } from '@/app/contexts/LoadingContext';

export function NavigationLoader() {
  const { setLoading } = useLoading();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // Skip the initial load to avoid showing loader on first page load
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    // This effect will run on route changes
    setLoading(true, 'Changing page...');
    
    // Add a small delay to make the loader visible for very fast transitions
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300); // Reduced timeout to 300ms
    
    return () => clearTimeout(timer);
  }, [pathname, searchParams, setLoading]);

  return null; // This component doesn't render anything
}