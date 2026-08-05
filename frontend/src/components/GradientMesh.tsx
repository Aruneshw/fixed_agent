import React from 'react';

/**
 * GradientMesh — Soft blurred color blobs that drift and blend
 * slowly behind content. Uses CSS animations for GPU-accelerated
 * performance with the SentinelX palette.
 */

const GradientMesh: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`gradient-mesh ${className}`} aria-hidden="true">
      {/* Jet Black deep base blob */}
      <div className="mesh-blob mesh-blob-1" />
      {/* Blue Slate shifting blob */}
      <div className="mesh-blob mesh-blob-2" />
      {/* Sunlit Clay warm accent blob */}
      <div className="mesh-blob mesh-blob-3" />
      {/* Secondary Blue Slate accent */}
      <div className="mesh-blob mesh-blob-4" />
      {/* Faint warm ambient fill */}
      <div className="mesh-blob mesh-blob-5" />
    </div>
  );
};

export default GradientMesh;
