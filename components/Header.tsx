
import React from 'react';
import { Page } from '../types';

interface HeaderProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const NavButton: React.FC<{
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ isActive, onClick, children }) => {
  const baseClasses = "px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 whitespace-nowrap";
  const activeClasses = "bg-teal-600 text-white";
  const inactiveClasses = "bg-gray-800 text-gray-300 hover:bg-gray-700";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {children}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 shadow-lg shadow-black/20">
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
           </svg>
           <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight">Công Cụ Pháp Lý AI</h1>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <NavButton
            isActive={currentPage === Page.CrimeAnalysis}
            onClick={() => onPageChange(Page.CrimeAnalysis)}
          >
            Phân Tích
          </NavButton>
          <NavButton
            isActive={currentPage === Page.CaseConverter}
            onClick={() => onPageChange(Page.CaseConverter)}
          >
            Chuyển Đổi Chữ
          </NavButton>
        </div>
      </nav>
    </header>
  );
};

export default Header;