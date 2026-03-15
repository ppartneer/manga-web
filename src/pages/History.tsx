import React from 'react';
import { useHistory } from '../store/historyContext';
import { motion } from 'framer-motion';
import { Clock, Play, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const History: React.FC = () => {
  const { history } = useHistory();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-accent/10 text-accent glass border-accent/20">
            <Clock size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">История</h1>
            <p className="text-sm text-white/40">Ваши последние прочтения</p>
          </div>
        </div>
      </div>

      {history.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {history.map((item: any) => (
            <Link
              key={item.mangaId}
              to={`/reader/${item.chapterId}`}
              className="group glass p-4 rounded-2xl flex gap-4 hover:bg-white/5 transition-all active:scale-[0.99]"
            >
              <img src={item.coverUrl} className="w-20 aspect-[2/3] object-cover rounded-xl" alt="" />
              <div className="flex-1 flex flex-col justify-center gap-1">
                <h3 className="font-bold line-clamp-1 group-hover:text-accent transition-colors">{item.mangaTitle}</h3>
                <p className="text-xs text-white/50">Глава {item.chapterNum}</p>
                <span className="text-[10px] text-white/30 mt-1">
                  Прочитано: {new Date(item.timestamp).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent/20 group-hover:text-accent transition-all">
                  <Play size={16} fill="currentColor" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-white/20">
          <Clock size={64} className="mb-4" />
          <p className="text-lg">История пуста</p>
          <p className="text-sm">Ваши прочитанные главы появятся здесь</p>
        </div>
      )}
    </motion.div>
  );
};

export default History;
