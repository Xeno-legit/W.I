import React from 'react';
import { WeaponSpec } from '../types';

interface SpecsGridProps {
  specs: WeaponSpec[];
}

export const SpecsGrid: React.FC<SpecsGridProps> = ({ specs }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {specs.map((spec, index) => (
        <div 
          key={index} 
          className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 flex flex-col transition-all hover:border-primary-500/50 hover:bg-slate-800"
        >
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            {spec.label}
          </span>
          <span className="text-sm font-semibold text-slate-100 truncate" title={spec.value}>
            {spec.value}
          </span>
        </div>
      ))}
    </div>
  );
};