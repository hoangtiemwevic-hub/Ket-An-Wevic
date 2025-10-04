
import React, { useState } from 'react';

interface ApiKeyEntryPageProps {
  onApiKeySubmit: (apiKey: string) => void;
}

const ApiKeyEntryPage: React.FC<ApiKeyEntryPageProps> = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Vui lòng nhập một API key.');
      return;
    }
    setError('');
    onApiKeySubmit(apiKey.trim());
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg animate-fade-in">
        <div className="text-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h1 className="text-3xl font-bold text-white mt-4">Chào mừng!</h1>
            <p className="text-gray-400 mt-2">Vui lòng nhập API Key của bạn để tiếp tục.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="api-key" className="block text-sm font-medium text-gray-300 mb-2">
              Gemini API Key
            </label>
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="••••••••••••••••••••"
              className="w-full p-3 bg-gray-900 border-2 border-gray-700 rounded-md text-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
              aria-label="Gemini API Key Input"
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 disabled:bg-gray-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500"
            >
              Tiếp tục
            </button>
          </div>
        </form>
         <div className="mt-6 text-center text-xs text-gray-500">
            <p>API key của bạn chỉ được sử dụng cho phiên này và không được lưu trữ ở bất cứ đâu.</p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyEntryPage;