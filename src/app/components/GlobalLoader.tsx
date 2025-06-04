'use client';

import React from 'react';
import { useLoading } from '@/app/contexts/LoadingContext';
import { Loader2, Car } from 'lucide-react';

export function GlobalLoader() {
  const { isLoading, loadingMessage } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-6 p-8">
        {/* Animated Car Icon */}
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
            <Car className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl opacity-20 animate-ping"></div>
        </div>

        {/* Spinning Loader */}
        <div className="relative">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <div className="absolute inset-0 w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>

        {/* Loading Message */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {loadingMessage || 'Loading...'}
          </h3>
          <p className="text-sm text-gray-600">
            Please wait while we process your request
          </p>
        </div>

        {/* Progress Bar Animation */}
        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" style={{
            animation: 'loading-progress 2s ease-in-out infinite'
          }}></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-progress {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 75%;
            margin-left: 12.5%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
      `}</style>
    </div>
  );
}