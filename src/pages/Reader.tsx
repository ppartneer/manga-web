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
      <div 
        className="flex flex-col min-h-screen"
        onClick={handleCenterClick}
      >
        {pages.map((page, index) => (
          <img
            key={page}
            src={getPageUrl(hash, page)}
            alt={`Page ${index + 1}`}
            className="w-full h-auto object-contain select-none"
            loading={index < 3 ? 'eager' : 'lazy'}
            referrerPolicy="no-referrer"
          />
        ))}
      </div>

      {/* Overlay Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-0 left-0 right-0 p-3 pt-10 sm:pt-12 glass z-[70] flex items-center justify-between safe-top"
            >
              <button 
                onClick={(e) => { e.stopPropagation(); navigate(-1); }} 
                className="p-2 rounded-full glass border-white/5 active:scale-90 transition-transform"
              >
                <ChevronLeft size={20} className="sm:size-6" />
              </button>
              <div className="flex flex-col items-center">
                <span className="text-[10px] sm:text-xs text-white/50 uppercase tracking-widest font-bold">Глава {state?.chapterNum}</span>
                <span className="text-xs sm:text-sm font-bold line-clamp-1 max-w-[200px]">{state?.mangaTitle}</span>
              </div>
              <button 
                className="p-2 rounded-full glass border-white/5 active:scale-90 transition-transform"
                onClick={(e) => e.stopPropagation()}
              >
                <Bookmark size={18} className="sm:size-5" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 glass z-[70] flex items-center justify-around border-t border-glass-border safe-bottom"
              onClick={(e) => e.stopPropagation()}
            >
               <div className="flex flex-col items-center gap-1 cursor-pointer group active:scale-90 transition-transform">
                  <Menu size={20} className="sm:size-6 text-white/50 group-hover:text-accent transition-colors" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-white/40 group-hover:text-accent uppercase tracking-wider">Список</span>
               </div>
               <div className="flex flex-col items-center gap-1 cursor-pointer group active:scale-90 transition-transform">
                  <SettingsIcon size={20} className="sm:size-6 text-white/50 group-hover:text-accent transition-colors" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-white/40 group-hover:text-accent uppercase tracking-wider">Опции</span>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reader;
