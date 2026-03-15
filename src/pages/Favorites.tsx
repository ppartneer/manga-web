import React from 'react';
import { useFavorites } from '../store/favoritesContext';
import MangaGrid from '../components/manga/MangaGrid';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Favorites: React.FC = () => {
  const { favorites } = useFavorites();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-red-500/10 text-red-500 glass border-red-500/20">
          <Heart size={24} fill="currentColor" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Избранное</h1>
          <p className="text-sm text-white/40">{favorites.length} манг сохранено</p>
        </div>
      </div>

      {favorites.length > 0 ? (
        <MangaGrid manga={favorites} isLoading={false} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-white/20">
          <Heart size={64} className="mb-4" />
          <p className="text-lg">У вас пока нет избранной манги</p>
          <p className="text-sm">Добавляйте мангу в избранное, чтобы не потерять ее</p>
        </div>
      )}
    </motion.div>
  );
};

export default Favorites;
