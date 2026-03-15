import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchChapterPages, getPageUrl } from '../services/mangadex';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Menu, Settings as SettingsIcon, Bookmark } from 'lucide-react';
import { useHistory } from '../store/historyContext';

const Reader: React.FC = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { mangaId: string; mangaTitle: string; chapterNum: string; coverUrl?: string } | null;
  const [pages, setPages] = useState<string[]>([]);
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const { addToHistory } = useHistory();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chapterId) return;
    const loadPages = async () => {
      setLoading(true);
      try {
        const data = await fetchChapterPages(chapterId);
        setPages(data.data);
        setHash(data.hash);
        // Reset scroll
        window.scrollTo(0, 0);

        // Add to history
        if (chapterId && state) {
          addToHistory({
            mangaId: state.mangaId,
            mangaTitle: state.mangaTitle,
            chapterId: chapterId,
            chapterNum: state.chapterNum,
            coverUrl: state.coverUrl || '', 
            timestamp: Date.now()
          });
        }
      } catch (error) {
        console.error('Failed to load pages:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPages();
  }, [chapterId]);

  // Toggle menu on center click
  const handleCenterClick = (e: React.MouseEvent) => {
    const { clientY, clientX } = e;
    const { innerHeight, innerWidth } = window;
    
    // Check if click is in the center 40% of the screen
    if (
      clientY > innerHeight * 0.3 && 
      clientY < innerHeight * 0.7 &&
      clientX > innerWidth * 0.2 &&
      clientX < innerWidth * 0.8
    ) {
      setShowMenu(!showMenu);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-[100]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 animate-pulse">Загрузка страниц...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black z-[60] overflow-y-auto overflow-x-hidden no-scrollbar"
      onClick={handleCenterClick}
      ref={containerRef}
    >
      <div className="flex flex-col">
        {pages.map((page, index) => (
          <img
            key={page}
            src={getPageUrl(hash, page)}
            alt={`Page ${index + 1}`}
            className="w-full h-auto object-contain select-none"
            loading={index < 3 ? 'eager' : 'lazy'}
          />
        ))}
      </div>

      {/* Overlay Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-0 left-0 right-0 p-4 pt-12 glass z-[70] flex items-center justify-between"
            >
              <button onClick={() => navigate(-1)} className="p-2 rounded-full glass border-white/5">
                <ChevronLeft size={24} />
              </button>
              <span className="font-bold">Глава</span>
              <button className="p-2 rounded-full glass border-white/5">
                <Bookmark size={20} />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-0 left-0 right-0 p-6 glass z-[70] flex items-center justify-around border-t border-white/10"
            >
               <div className="flex flex-col items-center gap-1">
                  <Menu size={24} className="text-white/60" />
                  <span className="text-[10px]">Список</span>
               </div>
               <div className="flex flex-col items-center gap-1">
                  <SettingsIcon size={24} className="text-white/60" />
                  <span className="text-[10px]">Настройки</span>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reader;
