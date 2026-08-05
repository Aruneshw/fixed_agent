import React from 'react';

/**
 * AuroraGlow — Layered light bands ripple like an aurora behind the interface.
 * Built with multiple CSS gradient layers that shift and pulse.
 * Uses the SentinelX color palette: Jet Black #1f2e37, Blue Slate #5c727b, Sunlit Clay #f2b968.
 */

const AuroraGlow: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`aurora-container ${className}`} aria-hidden="true">
      {/* Base aurora band — deep blue slate to jet black */}
      <div className="aurora-band aurora-band-1" />
      {/* Middle aurora band — sunlit clay warm glow */}
      <div className="aurora-band aurora-band-2" />
      {/* Top aurora band — lighter blue slate shimmer */}
      <div className="aurora-band aurora-band-3" />
      {/* Accent aurora — golden highlight edge */}
      <div className="aurora-band aurora-band-4" />
      {/* Subtle mist overlay */}
      <div className="aurora-band aurora-band-5" />
    </div>
  );
};

export default AuroraGlow;
