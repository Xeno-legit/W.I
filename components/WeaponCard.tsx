import React from 'react';
import { WeaponData } from '../types';
import { SpecsGrid } from './SpecsGrid';
import { 
  Crosshair, 
  Globe, 
  Calendar, 
  Factory 
} from 'lucide-react';

interface WeaponCardProps {
  data: WeaponData;
  imageUrl: string | null;
}

export const WeaponCard: React.FC<WeaponCardProps> = ({ data, imageUrl }) => {
  if (!data.isValidWeapon) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-10 p-8 bg-red-900/10 border border-red-900/30 rounded-2xl text-center">
        <h2 className="text-xl text-red-400 font-bold mb-2">Target Not Identified</h2>
        <p className="text-slate-400">The query "{data.name}" does not appear to be a recognized weapon system.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-fade-in-up">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/5">
        
        {/* Header Section */}
        <div className="relative h-64 md:h-80 w-full bg-slate-950 group">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={data.name} 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
              <span className="text-slate-600 font-mono text-sm uppercase tracking-[0.2em]">[No Visual Data]</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent pointer-events-none" />
          
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
             <div className="flex items-center space-x-3 mb-3">
                <span className="px-3 py-1 bg-primary-500/20 text-primary-400 border border-primary-500/30 text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-md">
                  {data.type}
                </span>
                {data.origin && (
                   <span className="px-3 py-1 bg-slate-800/60 text-slate-300 border border-slate-700 text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-md flex items-center gap-1">
                     <Globe size={12} /> {data.origin}
                   </span>
                )}
             </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">
              {data.name}
            </h1>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8">
          
          {/* Metadata Row */}
          <div className="flex flex-wrap gap-6 mb-8 text-sm text-slate-400 border-b border-slate-800 pb-6">
            {data.manufacturer && (
              <div className="flex items-center gap-2">
                <Factory size={16} className="text-primary-500" />
                <span className="font-medium text-slate-200">{data.manufacturer}</span>
              </div>
            )}
            {data.year && (
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-primary-500" />
                <span>In Service: <span className="font-medium text-slate-200">{data.year}</span></span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Crosshair size={20} className="text-primary-500" />
                  Technical Analysis
                </h3>
                <p className="text-slate-300 leading-relaxed text-lg">
                  {data.description}
                </p>
              </div>
              
              <div>
                 <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Specifications</h3>
                 <SpecsGrid specs={data.specs} />
              </div>
            </div>

            {/* Sidebar / Context */}
            <div className="md:col-span-1">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                <h4 className="text-xs font-mono text-primary-400 uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">
                  System Status
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Classification</span>
                    <span className="text-sm font-medium text-white">{data.type}</span>
                  </div>
                   <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Origin</span>
                    <span className="text-sm font-medium text-white">{data.origin}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Validation</span>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">CONFIRMED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};