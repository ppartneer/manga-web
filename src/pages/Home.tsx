import React, { useEffect, useState } from 'react';
import { Manga } from '../types/manga';
import { fetchMangaList } from '../services/mangadex';
import MangaGrid from '../components/manga/MangaGrid';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Clock } from 'lucide-react';
import { useHistory } from '../store/historyContext';
import { getCoverUrl } from '../services/mangadex';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [popular, setPopular] = useState<Manga[]>([]);
  const [latest, setLatest] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const { history } = useHistory();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [popData, latestData] = await Promise.all([
          fetchMangaList('order[followedCount]=desc&limit=12'),
          fetchMangaList('order[latestUploadedChapter]=desc&limit=12'),
        ]);
        setPopular(popData);
        setLatest(latestData);
      } catch (error) {
        console.error('Failed to fetch manga:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-6 sm:gap-10 pb-10"
    >
      {/* Continue Reading Section */}
      {history.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-accent" />
            <h2 className="text-lg font-bold">Продолжить чтение</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 snap-x">
            {history.slice(0, 5).map((item: any) => (
              <Link 
                key={item.mangaId} 
                to={`/reader/${item.chapterId}`}
                className="flex-shrink-0 w-32 sm:w-40 glass-card p-2 active:scale-95 transition-transform snap-start"
              >
                <img src={item.coverUrl} className="w-full aspect-[2/3] object-cover rounded-lg mb-2" alt="" referrerPolicy="no-referrer" />
                <p className="text-[11px] font-bold line-clamp-1">{item.mangaTitle}</p>
                <p className="text-[9px] text-white/50 tracking-wide">Глава {item.chapterNum}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Popular Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-accent" />
            <h2 className="text-lg font-bold">Популярное сейчас</h2>
          </div>
        </div>
        <MangaGrid manga={popular} isLoading={loading} />
      </section>

      {/* Featured Banner */}
      <section className="relative h-40 sm:h-48 rounded-2xl sm:rounded-3xl overflow-hidden glass group">
         <div className="absolute inset-0 bg-premium-gradient opacity-10 group-hover:opacity-20 transition-opacity"></div>
         <div className="absolute inset-0 p-5 sm:p-8 flex flex-col justify-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Откройте для себя новое</h3>
            <p className="text-[12px] sm:text-sm text-white/50 max-w-[180px] sm:max-w-[220px]">Тысячи историй в вашем кармане каждый день.</p>
         </div>
         <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-center">
            <Sparkles size={60} className="text-white/5 rotate-12 group-hover:scale-110 transition-transform" />
         </div>
      </section>

      {/* Latest Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-accent" />
            <h2 className="text-lg font-bold">Новинки</h2>
          </div>
        </div>
        <MangaGrid manga={latest} isLoading={loading} />
      </section>
    </motion.div>
  );
};

export default Home;
