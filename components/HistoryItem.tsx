import React from 'react';
import { HistoryEntry } from '../types';

interface HistoryItemProps {
    entry: HistoryEntry;
    onReload: (entry: HistoryEntry) => void;
    onDelete: (id: string) => void;
}

const ReloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 15M20 20l-1.5-1.5A9 9 0 003.5 9" />
    </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);


const HistoryItem: React.FC<HistoryItemProps> = ({ entry, onReload, onDelete }) => {
    return (
        <div className="bg-gray-900 p-4 rounded-lg flex items-center justify-between gap-4 transition-colors duration-200 hover:bg-gray-900/50">
            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-1">{entry.timestamp}</p>
                <p className="text-sm text-gray-300 truncate">
                    {entry.inputText}
                </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <button
                    onClick={() => onReload(entry)}
                    className="p-2 rounded-md hover:bg-gray-700 transition-colors text-gray-400 hover:text-teal-400"
                    aria-label="Reload this analysis"
                >
                    <ReloadIcon className="h-5 w-5" />
                </button>
                <button
                    onClick={() => onDelete(entry.id)}
                    className="p-2 rounded-md hover:bg-gray-700 transition-colors text-gray-400 hover:text-red-500"
                    aria-label="Delete this analysis"
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default HistoryItem;
