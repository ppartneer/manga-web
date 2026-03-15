import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Heart, Clock } from 'lucide-react';
import { cn } from '../common/Glass';
import { motion } from 'framer-motion';

const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Главная' },
    { to: '/search', icon: Search, label: 'Поиск' },
    { to: '/favorites', icon: Heart, label: 'Избранное' },
    { to: '/history', icon: Clock, label: 'История' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-14 glass z-50 flex items-center justify-around px-2 border-t border-glass-border safe-bottom sm:hidden">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => cn(
            'flex flex-col items-center justify-center gap-0.5 transition-all duration-300 w-full h-full relative',
            isActive ? 'text-accent' : 'text-white/30 hover:text-white/70'
          )}
        >
          {({ isActive }) => (
            <>
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn("text-[9px] font-bold uppercase tracking-wider", isActive ? "opacity-100" : "opacity-60")}>
                {label}
              </span>
              {isActive && (
                <motion.div 
                   layoutId="nav-pill"
                   className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]"
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
