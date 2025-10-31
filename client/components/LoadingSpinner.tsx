import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900/50 dark:bg-black/50 flex flex-col justify-center items-center z-[60] backdrop-blur-sm">
      <div className="text-white text-center">
        <i className="fas fa-spinner fa-spin text-5xl mb-4"></i>
        <p className="text-xl font-semibold animate-pulse">
          Loading your financial data...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
