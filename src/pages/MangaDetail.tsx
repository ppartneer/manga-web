import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Manga, Chapter } from '../types/manga';
import { fetchMangaDetails, fetchMangaChapters, getCoverUrl } from '../services/mangadex';
import ChapterList from '../components/manga/ChapterList';
import { useFavorites } from '../store/favoritesContext';
import { motion } from 'framer-motion';
import { Heart, Share2, Play, Info, ChevronLeft } from 'lucide-react';
import Skeleton from '../components/common/LoadingSkeleton';

const MangaDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [manga, setManga] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        const [mangaData, chapterData] = await Promise.all([
          fetchMangaDetails(id),
          fetchMangaChapters(id)
        ]);
        setManga(mangaData);
        setChapters(chapterData.chapters);
      } catch (error) {
        console.error('Failed to load manga details:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading || !manga) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-64 bg-white/5 rounded-3xl" />
        <div className="flex gap-4">
          <div className="w-32 h-48 bg-white/5 rounded-xl" />
          <div className="flex-1 space-y-4">
             <div className="h-8 bg-white/5 rounded w-3/4" />
             <div className="h-4 bg-white/5 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  const coverUrl = getCoverUrl(manga.id, manga.coverFileName);
  const favorite = isFavorite(manga.id);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="pb-20 -mt-20"
    >
      {/* Hero Section */}
      <div className="relative h-[240px] sm:h-[300px] -mx-4">
        <img 
          src={coverUrl} 
          className="w-full h-full object-cover blur-md scale-110 opacity-30" 
          alt="" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-20 sm:top-24 left-4 sm:left-6 p-2 rounded-full glass z-10 active:scale-90 transition-transform"
        >
          <ChevronLeft size={20} className="sm:size-6" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex items-end gap-4 sm:gap-6">
           <div className="w-24 sm:w-32 aspect-[2/3] relative flex-shrink-0">
             <img 
               src={coverUrl} 
               className="w-full h-full object-cover rounded-xl shadow-2xl glass border border-white/10"
               alt={manga.title}
               referrerPolicy="no-referrer"
             />
           </div>
           <div className="flex-1 pb-1 sm:pb-2 overflow-hidden">
              <h1 className="text-xl sm:text-2xl font-bold line-clamp-2 mb-1 sm:mb-2 leading-tight">{manga.title}</h1>
              <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                 {manga.tags.slice(0, 3).map((tag: string) => (
                   <span key={tag} className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full glass border-white/5 text-white/50">{tag}</span>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 sm:gap-3 px-1 sm:px-2 mt-6">
         <button 
           onClick={() => chapters[0] && navigate(`/reader/${chapters[chapters.length - 1].id}`)}
           className="flex-[2] premium-button flex items-center justify-center gap-2"
         >
            <Play size={16} className="sm:size-[18px]" fill="currentColor" />
            <span>Читать</span>
         </button>
         <button 
           onClick={() => favorite ? removeFavorite(manga.id) : addFavorite(manga)}
           className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center glass border-white/10 transition-colors active:scale-95 ${favorite ? 'text-red-500' : 'text-white/40'}`}
         >
            <Heart size={20} className="sm:size-6" fill={favorite ? 'currentColor' : 'none'} />
         </button>
         <button className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center glass border-white/10 text-white/40 active:scale-95">
            <Share2 size={20} className="sm:size-6" />
         </button>
      </div>

      {/* Info & Chapters */}
      <div className="mt-8 space-y-8 px-1 sm:px-2">
         <section>
            <div className="flex items-center gap-2 mb-3 text-white/80">
               <Info size={16} className="sm:size-[18px] text-accent" />
               <h2 className="text-base sm:text-lg font-bold">Описание</h2>
            </div>
            <p className="text-[13px] sm:text-sm text-white/50 leading-relaxed italic break-words">
               {manga.description || 'Описание отсутствует.'}
            </p>
         </section>

         <section>
            <div className="flex items-center justify-between mb-4">
               <h2 className="font-bold text-base sm:text-lg">Главы ({chapters.length})</h2>
               <span className="text-[10px] sm:text-xs text-accent font-medium uppercase tracking-wider">Обновления</span>
            </div>
            <ChapterList chapters={chapters} mangaId={manga.id} mangaTitle={manga.title} coverUrl={coverUrl} />
         </section>
      </div>
    </motion.div>
  );
};

export default MangaDetail;
