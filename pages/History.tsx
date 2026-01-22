import React, { useState, useEffect } from 'react';
import { Shield, History as HistoryIcon, Trash2, Search, ArrowLeft, Clock } from 'lucide-react';
import { getHistory, clearHistory, removeFromHistory, HistoryItem } from '../utils/localStorage';

export const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setHistory(getHistory());
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      clearHistory();
      loadHistory();
    }
  };

  const handleRemoveItem = (weaponName: string) => {
    removeFromHistory(weaponName);
    loadHistory();
  };

  const handleWeaponClick = (weaponName: string) => {
    window.location.href = `/?search=${encodeURIComponent(weaponName)}`;
  };

  const filteredHistory = history.filter(item =>
    item.weapon.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    item.weapon.type.toLowerCase().includes(searchFilter.toLowerCase()) ||
    item.query.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Shield className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                Sector<span className="text-primary-400">One</span>
              </span>
            </a>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-2 text-slate-400">
              <HistoryIcon className="w-5 h-5" />
              <span className="font-semibold">Search History</span>
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
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter history..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-3 bg-red-950/30 hover:bg-red-900/40 text-red-400 hover:text-red-300 rounded-lg transition-all border border-red-900/50 hover:border-red-800"
            >
              <Trash2 className="w-4 h-4" />
              <span className="font-medium">Clear All</span>
            </button>
          )}
        </div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-20">
            <HistoryIcon className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-400 mb-2">
              {history.length === 0 ? 'No Search History' : 'No Results Found'}
            </h2>
            <p className="text-slate-500">
              {history.length === 0 
                ? 'Your weapon searches will appear here'
                : 'Try a different search term'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHistory.map((item, index) => (
              <div
                key={index}
                className="group bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-primary-500/50 transition-all hover:shadow-lg hover:shadow-primary-500/10 cursor-pointer relative"
                onClick={() => handleWeaponClick(item.weapon.name)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(item.weapon.name);
                  }}
                  className="absolute top-3 right-3 p-2 bg-slate-800/50 hover:bg-red-900/40 text-slate-400 hover:text-red-400 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  title="Remove from history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="mb-3">
                  <h3 className="text-lg font-bold text-white mb-1 pr-8 line-clamp-1">
                    {item.weapon.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 border border-primary-500/30 text-xs font-semibold rounded">
                      {item.weapon.type}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{item.weapon.origin}</span>
                  </div>
                </div>

                <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                  {item.weapon.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(item.searchedAt)}</span>
                  </div>
                  <span className="text-slate-600">Searched: "{item.query}"</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
