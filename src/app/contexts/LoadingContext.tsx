'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  loadingMessage: string;
  setLoading: (loading: boolean, message?: string) => void;
  withLoading: <T>(promise: Promise<T>, message?: string) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingCount, setLoadingCount] = useState(0);

  const setLoading = useCallback((loading: boolean, message: string = '') => {
    if (loading) {
      setLoadingCount(prev => prev + 1);
      setIsLoading(true);
      setLoadingMessage(message);
    } else {
      setLoadingCount(prev => {
        const newCount = Math.max(0, prev - 1);
        if (newCount === 0) {
          setIsLoading(false);
          setLoadingMessage('');
        }
        return newCount;
      });
    }
  }, []);

  const withLoading = useCallback(async <T,>(promise: Promise<T>, message: string = 'Loading...'): Promise<T> => {
    setLoading(true, message);
    try {
      const result = await promise;
      return result;
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  return (
    <LoadingContext.Provider value={{
      isLoading,
      loadingMessage,
      setLoading,
      withLoading
    }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}