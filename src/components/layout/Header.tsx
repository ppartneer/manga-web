import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 h-16 glass z-50 flex items-center px-6 justify-between safe-top"
    >
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-premium-gradient flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-accent/20 group-active:scale-90 transition-transform">
          M
        </div>
        <span className="text-xl font-bold tracking-tight text-gradient hidden sm:block">Manga Premium</span>
      </Link>

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/search')}
          className="p-2 rounded-full hover:bg-white/5 transition-colors active:scale-90"
        >
          <Search size={22} className="text-white/80" />
        </button>
        <Link
          to="/favorites"
          className="p-2 rounded-full hover:bg-white/5 transition-colors active:scale-90"
        >
          <Heart size={22} className="text-white/80" />
        </Link>
        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
          <User size={18} className="text-white/60" />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
