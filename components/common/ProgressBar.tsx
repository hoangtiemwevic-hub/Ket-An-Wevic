import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="w-full bg-gray-700 rounded-full h-4 relative overflow-hidden">
      <div 
        className="bg-teal-500 h-full rounded-full transition-all duration-300 ease-in-out" 
        style={{ width: `${safeProgress}%` }}
      >
      </div>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white select-none">
        {Math.round(safeProgress)}%
      </span>
    </div>
  );
};

export default ProgressBar;