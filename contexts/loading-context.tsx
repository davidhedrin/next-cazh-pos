"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define context type
interface LoadingContextType {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
}

// Create context with a default value
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Context Provider component
export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = (value: boolean) => {
    setIsLoading(value);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook to use the context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};