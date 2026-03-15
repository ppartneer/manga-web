import React from 'react';
import { Link } from 'react-router-dom';
import { Manga } from '../../types/manga';
import { getCoverUrl } from '../../services/mangadex';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface MangaCardProps {
  manga: Manga;
}

const MangaCard: React.FC<MangaCardProps> = ({ manga }) => {
  const coverUrl = getCoverUrl(manga.id, manga.coverFileName);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex flex-col gap-2"
    >
      <Link to={`/manga/${manga.id}`} className="block relative aspect-[2/3] rounded-xl overflow-hidden glass-card">
        <img
          src={coverUrl}
          alt={manga.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
           <span className="text-xs font-medium text-white/90 line-clamp-2">{manga.description}</span>
        </div>
        {manga.rating && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-md glass backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider">
            {manga.rating}
          </div>
        )}
      </Link>
      <div className="flex flex-col gap-1 px-1">
        <Link to={`/manga/${manga.id}`} className="text-sm font-semibold line-clamp-1 group-hover:text-accent transition-colors">
          {manga.title}
        </Link>
        <div className="flex items-center justify-between text-[10px] text-white/50">
          <span>{manga.status}</span>
          <div className="flex items-center gap-0.5">
             <Star size={10} className="fill-yellow-500 text-yellow-500" />
             <span>NEW</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MangaCard;
