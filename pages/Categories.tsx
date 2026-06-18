import React, { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';

interface WeaponExample {
  name: string;
  origin: string;
  year: string;
}

interface Category {
  type: string;
  description: string;
  examples: WeaponExample[];
}

const categories: Category[] = [
  {
    type: 'Assault Rifle',
    description: 'Selective-fire rifles for military use',
    examples: [
      { name: 'AK-47', origin: 'Russia', year: '1947' },
      { name: 'M16', origin: 'USA', year: '1964' },
      { name: 'SCAR', origin: 'Belgium', year: '2004' },
      { name: 'AUG', origin: 'Austria', year: '1977' }
    ]
  },
  {
    type: 'Sniper Rifle',
    description: 'Long-range precision rifles',
    examples: [
      { name: 'Barrett M82', origin: 'USA', year: '1982' },
      { name: 'AWM', origin: 'UK', year: '1996' },
      { name: 'Dragunov SVD', origin: 'Russia', year: '1963' },
      { name: 'CheyTac M200', origin: 'USA', year: '2001' }
    ]
  },
  {
    type: 'Pistol',
    description: 'Handheld semi-automatic firearms',
    examples: [
      { name: 'Glock 17', origin: 'Austria', year: '1982' },
      { name: 'Desert Eagle', origin: 'Israel', year: '1983' },
      { name: 'Beretta 92', origin: 'Italy', year: '1975' },
      { name: 'Colt 1911', origin: 'USA', year: '1911' }
    ]
  },
  {
    type: 'Submachine Gun',
    description: 'Compact automatic weapons',
    examples: [
      { name: 'MP5', origin: 'Germany', year: '1966' },
      { name: 'UZI', origin: 'Israel', year: '1950' },
      { name: 'P90', origin: 'Belgium', year: '1990' },
      { name: 'MAC-10', origin: 'USA', year: '1964' }
    ]
  },
  {
    type: 'Machine Gun',
    description: 'Fully automatic heavy firearms',
    examples: [
      { name: 'M249 SAW', origin: 'Belgium', year: '1984' },
      { name: 'PKM', origin: 'Russia', year: '1969' },
      { name: 'MG42', origin: 'Germany', year: '1942' },
      { name: 'M240', origin: 'Belgium', year: '1977' }
    ]
  },
  {
    type: 'Shotgun',
    description: 'Short-range firearms firing shells',
    examples: [
      { name: 'Remington 870', origin: 'USA', year: '1951' },
      { name: 'Benelli M4', origin: 'Italy', year: '1998' },
      { name: 'SPAS-12', origin: 'Italy', year: '1979' },
      { name: 'Mossberg 500', origin: 'USA', year: '1960' }
    ]
  },
  {
    type: 'Grenade Launcher',
    description: 'Weapons that fire explosive projectiles',
    examples: [
      { name: 'M203', origin: 'USA', year: '1969' },
      { name: 'GP-25', origin: 'Russia', year: '1978' },
      { name: 'Milkor MGL', origin: 'South Africa', year: '1983' },
      { name: 'M32', origin: 'USA', year: '2000' }
    ]
  },
  {
    type: 'Rocket Launcher',
    description: 'Portable anti-tank weapons',
    examples: [
      { name: 'RPG-7', origin: 'Russia', year: '1961' },
      { name: 'AT4', origin: 'Sweden', year: '1987' },
      { name: 'Javelin', origin: 'USA', year: '1996' },
      { name: 'SMAW', origin: 'USA', year: '1984' }
    ]
  },
  {
    type: 'Battle Rifle',
    description: 'Full-power rifle cartridge firearms',
    examples: [
      { name: 'M14', origin: 'USA', year: '1959' },
      { name: 'FAL', origin: 'Belgium', year: '1953' },
      { name: 'G3', origin: 'Germany', year: '1959' },
      { name: 'SCAR-H', origin: 'Belgium', year: '2004' }
    ]
  },
  {
    type: 'Revolver',
    description: 'Rotating cylinder handguns',
    examples: [
      { name: 'Colt Python', origin: 'USA', year: '1955' },
      { name: 'Smith & Wesson Model 29', origin: 'USA', year: '1955' },
      { name: 'Ruger GP100', origin: 'USA', year: '1985' },
      { name: 'Chiappa Rhino', origin: 'Italy', year: '2009' }
    ]
  },
  {
    type: 'Anti-Material Rifle',
    description: 'Large-caliber rifles for equipment destruction',
    examples: [
      { name: 'Barrett M107', origin: 'USA', year: '2002' },
      { name: 'AS50', origin: 'UK', year: '2005' },
      { name: 'OSV-96', origin: 'Russia', year: '1996' },
      { name: 'M95', origin: 'USA', year: '1995' }
    ]
  },
  {
    type: 'Carbine',
    description: 'Shortened rifles for close combat',
    examples: [
      { name: 'M4 Carbine', origin: 'USA', year: '1994' },
      { name: 'AKS-74U', origin: 'Russia', year: '1979' },
      { name: 'G36C', origin: 'Germany', year: '2001' },
      { name: 'SIG MCX', origin: 'USA', year: '2015' }
    ]
  }
];

export const Categories: React.FC = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleWeaponClick = (weaponName: string) => {
    window.location.href = `/?search=${encodeURIComponent(weaponName)}`;
  };

  const toggleCategory = (type: string) => {
    if (expandedCategory === type) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(type);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img 
                src="/SectorOnelogo.png" 
                alt="SectorOne Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-lg tracking-tight text-white">
                Sector<span className="text-primary-400">One</span>
              </span>
            </a>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-2 text-slate-400">
              <img 
                src="/SectorOnelogo.png" 
                alt="SectorOne" 
                className="w-5 h-5 object-contain"
              />
              <span className="font-semibold">Categories</span>
            </div>
          </div>
          
          <a
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all border border-slate-700 hover:border-slate-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Search</span>
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
            CATEGORIES
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Explore weapon systems by category. Click on any weapon to view detailed specifications.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="space-y-4">
          {categories.map((category) => {
            const isExpanded = expandedCategory === category.type;
            
            return (
              <div
                key={category.type}
                className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isExpanded 
                    ? 'border-primary-500/50 shadow-lg shadow-primary-500/10' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.type)}
                  className="w-full p-6 flex items-center justify-between hover:bg-slate-800/30 transition-colors group"
                >
                  <div className="text-left">
                    <h2 className={`text-2xl font-bold mb-1 transition-colors ${
                      isExpanded ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-600' : 'text-white group-hover:text-primary-400'
                    }`}>
                      {category.type}
                    </h2>
                    <p className="text-sm text-slate-400">
                      {category.description}
                    </p>
                  </div>
                  <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown className={`w-6 h-6 ${isExpanded ? 'text-primary-400' : 'text-slate-400'}`} />
                  </div>
                </button>

                {/* Weapon Examples - Only show when expanded */}
                {isExpanded && (
                  <div className="border-t border-slate-800 p-6 bg-slate-950/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.examples.map((weapon, index) => (
                        <button
                          key={index}
                          onClick={() => handleWeaponClick(weapon.name)}
                          className="group p-5 bg-slate-900 hover:bg-slate-800 rounded-xl transition-all text-left border border-slate-800 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10 animate-fade-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors mb-2">
                                {weapon.name}
                              </h3>
                              <div className="flex items-center gap-3 text-sm">
                                <span className="px-2 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded text-xs font-semibold">
                                  {weapon.origin}
                                </span>
                                <div className="flex items-center gap-1 text-slate-500">
                                  <span className="text-slate-600">•</span>
                                  <span>{weapon.year}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-primary-400 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 text-xl">
                              →
                            </div>
                          </div>
                          <div className="h-px bg-gradient-to-r from-slate-800 via-slate-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 backdrop-blur-xl mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <img 
                src="/SectorOnelogo.png" 
                alt="SectorOne" 
                className="w-4 h-4 object-contain opacity-70"
              />
              <span>Sector<span className="text-primary-400">One</span></span>
              <span className="text-slate-700">•</span>
              <span>© 2026</span>
            </div>
            <div className="text-xs text-slate-500">
              <span>Built with React & TypeScript</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
