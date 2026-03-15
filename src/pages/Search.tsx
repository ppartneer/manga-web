import React, { useState, useEffect, useCallback } from 'react';
import { Manga } from '../types/manga';
import { fetchMangaList } from '../services/mangadex';
import MangaGrid from '../components/manga/MangaGrid';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchMangaList(`title=${encodeURIComponent(q)}&limit=20`);
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="pb-8"
    >
      <div className="sticky top-20 z-40 mb-6 flex flex-col gap-4">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input
            type="text"
            placeholder="Найти мангу..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-surface border border-glass-border rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:border-accent transition-colors shadow-xl"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
           <button className="flex-shrink-0 px-4 py-2 rounded-full glass border-accent/20 bg-accent/10 text-accent text-sm font-medium">Все</button>
           <button className="flex-shrink-0 px-4 py-2 rounded-full glass text-white/60 text-sm">Популярное</button>
           <button className="flex-shrink-0 px-4 py-2 rounded-full glass text-white/60 text-sm">Завершено</button>
           <button className="flex-shrink-0 px-4 py-2 rounded-full glass text-white/60 text-sm">Онгоинг</button>
           <button className="flex-shrink-0 p-2 rounded-full glass text-white/60"><Filter size={18} /></button>
        </div>
      </div>

      {loading ? (
        <MangaGrid manga={[]} isLoading={true} />
      ) : results.length > 0 ? (
        <>
          <h2 className="text-sm font-medium text-white/40 mb-4 px-1">Результаты поиска: {results.length}</h2>
          <MangaGrid manga={results} isLoading={false} />
        </>
      ) : query && !loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/40">
           <SearchIcon size={48} className="mb-4 opacity-20" />
           <p>Ничего не найдено</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-white/40">
           <p>Введите название вашей любимой манги</p>
        </div>
      )}
    </motion.div>
  );
};

export default Search;
