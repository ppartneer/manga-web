import React from 'react';
import { Manga } from '../../types/manga';
import MangaCard from './MangaCard';
import { MangaCardSkeleton } from '../common/LoadingSkeleton';

interface MangaGridProps {
  manga: Manga[];
  isLoading?: boolean;
  columns?: number;
}

const MangaGrid: React.FC<MangaGridProps> = ({ manga, isLoading, columns = 2 }) => {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-${columns} md:grid-cols-4 lg:grid-cols-6 gap-4`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <MangaCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-${columns} md:grid-cols-4 lg:grid-cols-6 gap-4`}>
      {manga.map((m) => (
        <MangaCard key={m.id} manga={m} />
      ))}
    </div>
  );
};

export default MangaGrid;
