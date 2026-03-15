import React from 'react';
import { cn } from './Glass';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={cn(
      'bg-white/5 animate-pulse rounded-lg',
      className
    )} />
  );
};

export const MangaCardSkeleton = () => (
  <div className="flex flex-col gap-2">
    <Skeleton className="aspect-[2/3] w-full rounded-xl" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
  </div>
);

export default Skeleton;
