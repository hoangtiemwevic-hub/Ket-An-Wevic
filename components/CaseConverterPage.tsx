import React, { useState, useMemo, useCallback } from 'react';

interface CaseConverterPageProps {
  inputText: string;
  setInputText: (text: string) => void;
}

const CaseConverterPage: React.FC<CaseConverterPageProps> = ({ inputText, setInputText }) => {
  const [copyButtonText, setCopyButtonText] = useState<string>('Sao chép');

  const uppercaseText = useMemo(() => inputText.toUpperCase(), [inputText]);

  const handleCopy = useCallback(() => {
    if (uppercaseText) {
      navigator.clipboard.writeText(uppercaseText);
      setCopyButtonText('Đã sao chép!');
      setTimeout(() => {
        setCopyButtonText('Sao chép');
      }, 2000);
    }
  }, [uppercaseText]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-teal-400">Chuyển Đổi Chữ Thường thành Chữ Hoa</h2>
        <p className="mt-2 text-gray-400">Nhập văn bản vào ô đầu tiên để xem kết quả chữ hoa ở ô thứ hai.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
          <label htmlFor="input-text" className="block text-lg font-medium text-gray-300">Văn bản gốc</label>
          <textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Nhập văn bản chữ thường..."
            className="w-full h-48 p-4 bg-gray-900 border-2 border-gray-700 rounded-md text-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 resize-none"
          />
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
          <div className="flex justify-between items-center">
             <label htmlFor="output-text" className="block text-lg font-medium text-gray-300">Văn bản chữ hoa</label>
             <button
                onClick={handleCopy}
                disabled={!uppercaseText}
                className="px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-md hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200"
              >
               {copyButtonText}
             </button>
          </div>
          <textarea
            id="output-text"
            value={uppercaseText}
            readOnly
            placeholder="Kết quả chữ hoa sẽ hiện ở đây..."
            className="w-full h-48 p-4 bg-gray-900 border-2 border-gray-700 rounded-md text-gray-400 cursor-not-allowed resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default CaseConverterPage;