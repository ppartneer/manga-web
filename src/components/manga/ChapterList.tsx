import React from 'react';
import { Chapter } from '../../types/manga';
import { Link } from 'react-router-dom';
import { Play, CheckCircle } from 'lucide-react';

interface ChapterListProps {
  chapters: Chapter[];
  mangaId: string;
  mangaTitle: string;
  coverUrl: string;
}

const ChapterList: React.FC<ChapterListProps> = ({ chapters, mangaId, mangaTitle, coverUrl }) => {
  return (
    <div className="flex flex-col gap-2">
      {chapters.map((chapter) => (
        <Link
          key={chapter.id}
          to={`/reader/${chapter.id}`}
          state={{ 
            mangaId, 
            chapterNum: chapter.chapterNum,
            mangaTitle,
            coverUrl
          }}
          className="group flex items-center justify-between p-4 glass rounded-2xl hover:bg-white/5 transition-colors active:scale-[0.99]"
        >
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-sm group-hover:text-accent transition-colors">
              Глава {chapter.chapterNum} {chapter.title && `- ${chapter.title}`}
            </span>
            <span className="text-[10px] text-white/40">
              {new Date(chapter.publishAt).toLocaleDateString('ru-RU')} • {chapter.pages} стр.
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent/20 group-hover:text-accent transition-all">
             <Play size={14} fill="currentColor" />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ChapterList;
