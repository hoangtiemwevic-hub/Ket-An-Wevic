
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { analyzeCrimeText } from '../services/geminiService';
import Spinner from './common/Spinner';
// Fix: Updated imports to get Crime type from the central types.ts file, which resolves the 'history' prop type issue.
import { HistoryEntry, Crime } from '../types';
import HistoryItem from './HistoryItem';
import ProgressBar from './common/ProgressBar';

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const formatCrimeText = (text: string): string => {
  if (!text || text.length === 0) return '';
  const trimmedText = text.trim();
  return `- ${trimmedText.charAt(0).toUpperCase() + trimmedText.slice(1)}`;
};

interface CrimeAnalysisPageProps {
  apiKey: string;
  inputText: string;
  setInputText: (text: string) => void;
  result: Crime[];
  setResult: (result: Crime[]) => void;
  error: string | null;
  setError: (error: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  history: HistoryEntry[];
  onHistoryAdd: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  onHistoryChange: (history: HistoryEntry[]) => void;
}

const CrimeAnalysisPage: React.FC<CrimeAnalysisPageProps> = ({
  apiKey, inputText, setInputText, result, setResult, error, setError, isLoading, setIsLoading, history, onHistoryAdd, onHistoryChange
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<number | null>(null);

  const groupedResults = useMemo(() => {
    // Fix: Add Array.isArray check to safely handle the result prop. This prevents runtime errors on 'reduce' if 'result' is not an array.
    if (!result || !Array.isArray(result) || result.length === 0) return {};
    return result.reduce((acc, crime) => {
      const subject = crime.subject || 'Unspecified';
      if (!acc[subject]) {
        acc[subject] = [];
      }
      acc[subject].push(crime);
      return acc;
    }, {} as Record<string, Crime[]>);
  }, [result]);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Vui lòng nhập nội dung vụ án.');
      return;
    }

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    setIsLoading(true);
    setError(null);
    setResult([]);
    setProgress(10); 

    progressIntervalRef.current = window.setInterval(() => {
        setProgress(p => {
          if (p >= 95) {
            if(progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            return 95;
          }
          if (p < 50) return p + 15;
          if (p < 80) return p + 5;
          return p + 2;
        });
      }, 500);


    try {
      const analysisResult = await analyzeCrimeText(inputText, apiKey);
      setResult(analysisResult);
      if (analysisResult.length > 0) {
        onHistoryAdd({ inputText, result: analysisResult });
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Đã xảy ra lỗi không xác định khi phân tích. Vui lòng thử lại.');
      }
      console.error(err);
    } finally {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 500);
    }
  }, [inputText, apiKey, setResult, setError, setIsLoading, onHistoryAdd]);
  
  const handleCopy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  }, []);

  const handleReloadHistory = useCallback((entry: HistoryEntry) => {
    setInputText(entry.inputText);
    setResult(entry.result);
  }, [setInputText, setResult]);

  const handleDeleteHistoryItem = useCallback((id: string) => {
    onHistoryChange(history.filter(item => item.id !== id));
  }, [history, onHistoryChange]);

  const handleClearHistory = useCallback(() => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử không?")) {
      onHistoryChange([]);
    }
  }, [onHistoryChange]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-teal-400">Phân Tích Tội Phạm Hoa Kỳ</h2>
        <p className="mt-2 text-gray-400">Dán nội dung vụ án vào ô bên dưới để AI phân tích và liệt kê các tội danh.</p>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Nhập hoặc dán thông tin kết tội của tội phạm ở đây..."
          className="w-full h-48 p-4 bg-gray-900 border-2 border-gray-700 rounded-md text-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 resize-none"
          disabled={isLoading}
          aria-label="Crime case input"
        />
        <div className="mt-4 h-6 flex items-center justify-center">
            {isLoading && <ProgressBar progress={progress} />}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="flex items-center justify-center w-32 px-6 py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500"
          >
            {isLoading ? <Spinner /> : 'Phân Tích'}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md text-center" role="alert">{error}</div>}
      
      {/* Fix: Add Array.isArray check to safely render results. This prevents runtime errors on '.length' and '.map' if 'result' is not an array. */}
      {Array.isArray(result) && result.length > 0 && (
         <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in">
           <h3 className="text-2xl font-bold text-teal-400 mb-4">Kết Quả Phân Tích</h3>
           <div className="space-y-6">
            {Object.entries(groupedResults).map(([subject, crimes]) => (
              <div key={subject}>
                <h4 className="text-xl font-semibold text-white bg-gray-700/50 px-4 py-2 rounded-t-md">{subject}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-4 border border-t-0 border-gray-700 rounded-b-md">
                  {crimes.length > 0 && (
                    <>
                      <h5 className="font-semibold text-lg text-gray-300 md:col-span-1">Tội danh (Tiếng Anh)</h5>
                      <h5 className="font-semibold text-lg text-gray-300 md:col-span-1">Tội danh (Tiếng Việt)</h5>
                    </>
                  )}
                  {crimes.map((crime, index) => {
                    const formattedEnglish = formatCrimeText(crime.english);
                    const formattedVietnamese = formatCrimeText(crime.vietnamese);
                    return (
                        <React.Fragment key={index}>
                        <div className="bg-gray-900 p-3 rounded-md flex items-center justify-between gap-2">
                            <span className="text-gray-300 break-words">{formattedEnglish}</span>
                            <button 
                                onClick={() => handleCopy(formattedEnglish, `${subject}-en-${index}`)}
                                className="p-2 rounded-md hover:bg-gray-700 transition-colors text-gray-400 hover:text-teal-400 flex-shrink-0"
                                aria-label={`Copy English term: ${crime.english}`}
                            >
                                {copiedKey === `${subject}-en-${index}` ? <CheckIcon className="h-5 w-5 text-green-400" /> : <CopyIcon className="h-5 w-5" />}
                            </button>
                        </div>
                        <div className="bg-gray-900 p-3 rounded-md flex items-center justify-between gap-2">
                            <span className="text-gray-300 break-words">{formattedVietnamese}</span>
                            <button 
                                onClick={() => handleCopy(formattedVietnamese, `${subject}-vi-${index}`)}
                                className="p-2 rounded-md hover:bg-gray-700 transition-colors text-gray-400 hover:text-teal-400 flex-shrink-0"
                                aria-label={`Copy Vietnamese term: ${crime.vietnamese}`}
                            >
                                {copiedKey === `${subject}-vi-${index}` ? <CheckIcon className="h-5 w-5 text-green-400" /> : <CopyIcon className="h-5 w-5" />}
                            </button>
                        </div>
                        </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ))}
           </div>
         </div>
      )}

      {history.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-teal-400">Lịch Sử Phân Tích</h3>
                <button
                    onClick={handleClearHistory}
                    className="px-4 py-2 bg-red-800 text-white text-sm font-semibold rounded-md hover:bg-red-900 transition-colors duration-200"
                >
                    Xóa Toàn Bộ Lịch Sử
                </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {history.map(entry => (
                    <HistoryItem
                        key={entry.id}
                        entry={entry}
                        onReload={handleReloadHistory}
                        onDelete={handleDeleteHistoryItem}
                    />
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default CrimeAnalysisPage;