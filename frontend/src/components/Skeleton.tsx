import React from 'react';

/**
 * Skeleton Loader - Glassmorphism Theme
 */

const SkeletonBlock: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`skeleton-shimmer rounded-full ${className}`} />
);

export const SkeletonCircle: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = '',
}) => (
  <div
    className={`skeleton-shimmer rounded-full flex-shrink-0 ${className}`}
    style={{ width: size, height: size }}
  />
);

export const SkeletonLine: React.FC<{ width?: string; height?: number; className?: string }> = ({
  width = '100%',
  height = 14,
  className = '',
}) => (
  <div
    className={`skeleton-shimmer rounded-full ${className}`}
    style={{ width, height }}
  />
);

export const SkeletonStatCard: React.FC = () => (
  <div className="glass-panel rounded-[20px] p-6 flex flex-col justify-between">
    <div className="mb-8">
      <SkeletonCircle size={56} />
    </div>
    <div className="space-y-4">
      <SkeletonLine width="50%" height={14} />
      <SkeletonLine width="80%" height={40} />
    </div>
  </div>
);

export const SkeletonEventRow: React.FC = () => (
  <div className="flex items-center justify-between py-4 px-5 rounded-xl bg-[rgba(255,255,255,0.3)] border border-[rgba(255,255,255,0.4)] shadow-sm">
    <div className="flex items-center gap-6">
      <SkeletonCircle size={48} />
      <div className="space-y-3">
        <SkeletonLine width="200px" height={20} />
        <SkeletonLine width="120px" height={12} />
      </div>
    </div>
    <SkeletonLine width="60px" height={16} />
  </div>
);

export const SkeletonTableRow: React.FC = () => (
  <div className="grid grid-cols-[60px_1fr_120px_100px_120px] gap-4 px-5 py-5 items-center rounded-xl bg-[rgba(255,255,255,0.3)] border border-[rgba(255,255,255,0.4)] shadow-sm">
    <SkeletonLine width="40px" height={16} />
    <div className="space-y-3">
      <SkeletonLine width="60%" height={20} />
      <SkeletonLine width="40%" height={12} />
    </div>
    <SkeletonLine width="80px" height={16} />
    <SkeletonLine width="60px" height={28} className="rounded-full" />
    <SkeletonLine width="70px" height={16} />
  </div>
);

export const SkeletonRuleCard: React.FC = () => (
  <div className="glass-panel rounded-[20px] p-6 lg:p-7 flex flex-col">
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-5">
        <SkeletonCircle size={56} />
        <div className="space-y-3">
          <SkeletonLine width="120px" height={28} />
          <SkeletonLine width="140px" height={14} />
        </div>
      </div>
      <SkeletonLine width="90px" height={36} className="rounded-full" />
    </div>
    
    <div className="space-y-6 flex-1">
      <div className="bg-[rgba(255,255,255,0.3)] border border-[rgba(255,255,255,0.4)] rounded-[1.5rem] p-5 space-y-4">
        <SkeletonLine width="80px" height={12} />
        <div className="flex gap-3">
          <SkeletonLine width="120px" height={32} className="rounded-full" />
          <SkeletonLine width="100px" height={32} className="rounded-full" />
        </div>
      </div>
      
      <div className="space-y-3">
        <SkeletonLine width="60px" height={12} />
        <div className="flex gap-3">
          <SkeletonLine width="80px" height={36} className="rounded-full" />
          <SkeletonLine width="80px" height={36} className="rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

export const SkeletonOverview: React.FC = () => (
  <div className="space-y-10">
    <div className="flex justify-between items-end">
      <SkeletonLine width="300px" height={60} />
      <div className="flex gap-4">
        <SkeletonCircle size={56} />
        <SkeletonLine width="160px" height={56} className="rounded-full" />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <SkeletonStatCard />
      <SkeletonStatCard />
      <SkeletonStatCard />
      <SkeletonStatCard />
    </div>

    <div className="glass-panel rounded-[20px] p-6 lg:p-7 space-y-6">
      <div className="flex justify-between items-center mb-5">
        <SkeletonLine width="200px" height={28} />
        <SkeletonLine width="80px" height={14} />
      </div>
      <div className="space-y-4">
        <SkeletonEventRow />
        <SkeletonEventRow />
        <SkeletonEventRow />
        <SkeletonEventRow />
      </div>
    </div>
  </div>
);

export default SkeletonBlock;
