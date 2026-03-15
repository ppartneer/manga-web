import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Heart, Clock } from 'lucide-react';
import { cn } from '../common/Glass';

const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Главная' },
    { to: '/search', icon: Search, label: 'Поиск' },
    { to: '/favorites', icon: Heart, label: 'Избранное' },
    { to: '/history', icon: Clock, label: 'История' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 glass z-50 flex items-center justify-around px-4 border-t border-glass-border safe-bottom sm:hidden">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => cn(
            'flex flex-col items-center justify-center gap-1 transition-all duration-300',
            isActive ? 'text-accent scale-110' : 'text-white/40 hover:text-white/70'
          )}
        >
          <Icon size={20} />
          <span className="text-[10px] font-medium">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
