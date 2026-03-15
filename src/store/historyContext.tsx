import React, { createContext, useContext, useState, useEffect } from 'react';

export interface HistoryItem {
  mangaId: string;
  mangaTitle: string;
  chapterId: string;
  chapterNum: string;
  coverUrl: string;
  timestamp: number;
}

interface HistoryContextType {
  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('reading_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const addToHistory = (item: HistoryItem) => {
    const filtered = history.filter(h => h.mangaId !== item.mangaId);
    const newHistory = [item, ...filtered].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem('reading_history', JSON.stringify(newHistory));
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) throw new Error('useHistory must be used within HistoryProvider');
  return context;
};
