import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Glass: React.FC<GlassProps> = ({ children, className, hover = false }) => {
  return (
    <div className={cn(
      'glass rounded-2xl border border-glass-border',
      hover && 'hover:bg-white/10 transition-colors duration-300',
      className
    )}>
      {children}
    </div>
  );
};

export default Glass;
export { cn };
