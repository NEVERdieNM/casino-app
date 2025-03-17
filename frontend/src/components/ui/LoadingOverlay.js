import React from 'react';

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-casino-primary rounded-lg p-6 shadow-lg flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-casino-secondary mb-4"></div>
        <p className="text-white">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;