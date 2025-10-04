
import React, { useState, useCallback } from 'react';
// Fix: Updated import path for Crime type to central types.ts file.
import { Page, HistoryEntry, Crime } from './types';
import Header from './components/Header';
import CrimeAnalysisPage from './components/CrimeAnalysisPage';
import CaseConverterPage from './components/CaseConverterPage';
import ApiKeyEntryPage from './components/ApiKeyEntryPage';
import ImageCombinerPage from './components/ImageCombinerPage';


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.CrimeAnalysis);
  const [apiKey, setApiKey] = useState<string | null>(null);

  // State for CrimeAnalysisPage
  const [crimeInput, setCrimeInput] = useState<string>('');
  const [crimeResult, setCrimeResult] = useState<Crime[]>([]);
  const [crimeError, setCrimeError] = useState<string | null>(null);
  const [isCrimeLoading, setIsCrimeLoading] = useState<boolean>(false);
  const [analysisHistory, setAnalysisHistory] = useState<HistoryEntry[]>([]);

  // State for CaseConverterPage
  const [converterInput, setConverterInput] = useState<string>('');

  const handlePageChange = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const handleAddHistory = useCallback((entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    setAnalysisHistory(prevHistory => [
      { 
        ...entry, 
        id: new Date().toISOString(), 
        timestamp: new Date().toLocaleString() 
      },
      ...prevHistory
    ]);
  }, []);

  const handleLogout = useCallback(() => {
    setApiKey(null);
  }, []);

  if (!apiKey) {
    return <ApiKeyEntryPage onApiKeySubmit={setApiKey} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header currentPage={currentPage} onPageChange={handlePageChange} onLogout={handleLogout} />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {currentPage === Page.CrimeAnalysis && (
            <CrimeAnalysisPage 
              apiKey={apiKey}
              inputText={crimeInput}
              setInputText={setCrimeInput}
              result={crimeResult}
              setResult={setCrimeResult}
              error={crimeError}
              setError={setCrimeError}
              isLoading={isCrimeLoading}
              // Fix: Corrected prop name to match the state setter function.
              setIsLoading={setIsCrimeLoading}
              history={analysisHistory}
              onHistoryAdd={handleAddHistory}
              onHistoryChange={setAnalysisHistory}
            />
          )}
          {currentPage === Page.CaseConverter && (
            <CaseConverterPage
              inputText={converterInput}
              setInputText={setConverterInput}
            />
          )}
          {currentPage === Page.ImageCombiner && (
            <ImageCombinerPage />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;