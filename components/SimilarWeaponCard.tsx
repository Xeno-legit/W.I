import React, { useState, useEffect } from 'react';
import { SimilarWeapon } from '../types';
import { fetchWikipediaImage } from '../services/wikipediaService';
import { Globe } from 'lucide-react';

interface SimilarWeaponCardProps {
  weapon: SimilarWeapon;
  onClick: (weaponName: string) => void;
}

export const SimilarWeaponCard: React.FC<SimilarWeaponCardProps> = ({ weapon, onClick }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      setImageLoading(true);
      const url = await fetchWikipediaImage(weapon.name);
      setImageUrl(url);
      setImageLoading(false);
    };
    loadImage();
  }, [weapon.name]);

  return (
    <div 
      onClick={() => onClick(weapon.name)}
      className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-primary-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-500/10"
    >
      {/* Image Section (A) */}
      <div className="relative h-40 bg-slate-950 overflow-hidden">
        {imageLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-900 animate-pulse">
            <div className="w-12 h-12 border-2 border-slate-700 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        ) : imageUrl ? (
          <img 
            src={imageUrl} 
            alt={weapon.name}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
            <span className="text-slate-600 font-mono text-xs uppercase tracking-wider">[No Image]</span>
          </div>
        )}
        
        {/* Gradient Fade from A to B */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/60 to-slate-900 pointer-events-none" />
      </div>

      {/* Info Section (B) */}
      <div className="p-4 space-y-2">
        <h3 className="text-white font-bold text-lg leading-tight group-hover:text-primary-400 transition-colors line-clamp-2">
          {weapon.name}
        </h3>
        
        <div className="flex flex-col gap-1.5 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Type</span>
            <span className="text-slate-300 font-medium">{weapon.type}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Globe size={12} className="text-primary-500" />
            <span className="text-slate-400 text-xs">{weapon.origin}</span>
          </div>
        </div>
      </div>

      {/* Hover Indicator */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(14,165,233,0.8)]"></div>
      </div>
    </div>
  );
};
