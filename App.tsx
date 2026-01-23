import React, { useState, useCallback, useEffect } from 'react';
import { Search, Shield, Loader2, AlertCircle, AlertTriangle, Clock, XCircle, History, Grid, Heart, Github, Linkedin, Mail } from 'lucide-react';
import { identifyWeapon, getSimilarWeapons, getCurrentApiKey } from './services/geminiService';
import { fetchWikipediaImage } from './services/wikipediaService';
import { saveToHistory, saveToCache, getFromCache } from './utils/localStorage';
import { WeaponData, SimilarWeapon } from './types';
import { WeaponCard } from './components/WeaponCard';
import { SimilarWeaponCard } from './components/SimilarWeaponCard';

type ErrorType = 'rate_limit' | 'api_error' | 'invalid_search' | 'network_error' | 'unknown';

interface ErrorState {
  message: string;
  type: ErrorType;
}

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [data, setData] = useState<WeaponData | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [similarWeapons, setSimilarWeapons] = useState<SimilarWeapon[]>([]);
  const [apiKeyIndex, setApiKeyIndex] = useState<number>(0);

  // Check for search query parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setQuery(searchParam);
      handleSearch(undefined, searchParam);
    }
  }, []);

  const getErrorType = (errorMessage: string): ErrorType => {
    const msg = errorMessage.toLowerCase();
    if (msg.includes('429') || msg.includes('too many requests') || msg.includes('rate limit')) {
      return 'rate_limit';
    }
    if (msg.includes('invalid') || msg.includes('not found') || msg.includes('not recognized')) {
      return 'invalid_search';
    }
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('connection')) {
      return 'network_error';
    }
    if (msg.includes('api') || msg.includes('service')) {
      return 'api_error';
    }
    return 'unknown';
  };

  const handleSearch = useCallback(async (e?: React.FormEvent, searchQuery?: string) => {
    if (e) e.preventDefault();
    const searchTerm = searchQuery || query;
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);
    setImageUrl(null);
    setSuggestion(null);
    setSimilarWeapons([]);

    try {
      // Check cache first
      const cached = getFromCache(searchTerm);
      
      if (cached) {
        // Use cached data - instant load!
        setData(cached.weapon);
        setImageUrl(cached.imageUrl);
        setSimilarWeapons(cached.similarWeapons || []); // Load cached similar weapons
        setApiKeyIndex(getCurrentApiKey());
        
        // Still save to history to update timestamp
        if (cached.weapon.isValidWeapon) {
          saveToHistory(cached.weapon, cached.imageUrl, searchTerm);
        }
        
        // Check for suggestion
        if (cached.weapon.suggestedName && cached.weapon.suggestedName !== searchTerm) {
          setSuggestion(cached.weapon.suggestedName);
        }
        
        setLoading(false);
        return;
      }

      // SEQUENTIAL LOADING to avoid rate limits
      
      // Step 1: Get weapon data from AI
      const aiData = await identifyWeapon(searchTerm);
      
      // Check if AI suggested a correction
      if (aiData.suggestedName && aiData.suggestedName !== searchTerm) {
        setSuggestion(aiData.suggestedName);
      }

      setData(aiData);
      setApiKeyIndex(getCurrentApiKey());

      // Step 2: Fetch main weapon image (after a small delay)
      await new Promise(resolve => setTimeout(resolve, 500));
      let finalImage = await fetchWikipediaImage(searchTerm);

      // Step 3: Smart Retry for image if needed
      if (!finalImage && aiData && aiData.isValidWeapon) {
        if (aiData.name.toLowerCase() !== searchTerm.trim().toLowerCase()) {
           console.log(`Retrying image search with official name: ${aiData.name}`);
           await new Promise(resolve => setTimeout(resolve, 500));
           finalImage = await fetchWikipediaImage(aiData.name);
        }
        
        if (!finalImage) {
           console.log(`Retrying image search with context: ${aiData.name} weapon`);
           await new Promise(resolve => setTimeout(resolve, 500));
           finalImage = await fetchWikipediaImage(`${aiData.name} weapon`);
        }
      }

      setImageUrl(finalImage);

      // Step 4: Fetch similar weapons (with delay to avoid rate limit)
      let similar: SimilarWeapon[] = [];
      if (aiData.isValidWeapon) {
        await new Promise(resolve => setTimeout(resolve, 800));
        similar = await getSimilarWeapons(aiData.name, aiData.type);
        setSimilarWeapons(similar);
      }

      // Save to cache for future instant loads (including similar weapons)
      saveToCache(aiData, finalImage, similar, searchTerm);

      // Save to history with image (after we have all data)
      if (aiData.isValidWeapon) {
        saveToHistory(aiData, finalImage, searchTerm);
      }

    } catch (err: any) {
      const errorMessage = err.message || "Failed to retrieve weapon data.";
      const errorType = getErrorType(errorMessage);
      setError({ message: errorMessage, type: errorType });
      
      // Auto-dismiss error after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleSuggestionClick = () => {
    if (suggestion) {
      setQuery(suggestion);
      handleSearch(undefined, suggestion);
    }
  };

  const handleSimilarWeaponClick = (weaponName: string) => {
    setQuery(weaponName);
    handleSearch(undefined, weaponName);
  };

  const getErrorIcon = (type: ErrorType) => {
    switch (type) {
      case 'rate_limit':
        return <Clock className="text-amber-400 mt-0.5 shrink-0 w-6 h-6" />;
      case 'invalid_search':
        return <XCircle className="text-red-400 mt-0.5 shrink-0 w-6 h-6" />;
      case 'network_error':
        return <AlertCircle className="text-orange-400 mt-0.5 shrink-0 w-6 h-6" />;
      default:
        return <AlertCircle className="text-red-500 mt-0.5 shrink-0 w-6 h-6" />;
    }
  };

  const getErrorTitle = (type: ErrorType) => {
    switch (type) {
      case 'rate_limit':
        return 'Rate Limit Reached';
      case 'invalid_search':
        return 'Invalid Search';
      case 'network_error':
        return 'Network Error';
      case 'api_error':
        return 'API Error';
      default:
        return 'Analysis Failed';
    }
  };

  const getErrorColor = (type: ErrorType) => {
    switch (type) {
      case 'rate_limit':
        return 'bg-amber-950/30 border-amber-700/50';
      case 'invalid_search':
        return 'bg-red-950/30 border-red-900/50';
      case 'network_error':
        return 'bg-orange-950/30 border-orange-700/50';
      default:
        return 'bg-red-950/30 border-red-900/50';
    }
  };

  const getErrorTextColor = (type: ErrorType) => {
    switch (type) {
      case 'rate_limit':
        return 'text-amber-300';
      case 'invalid_search':
        return 'text-red-400';
      case 'network_error':
        return 'text-orange-300';
      default:
        return 'text-red-400';
    }
  };

  const getApiKeyDisplay = () => {
    return apiKeyIndex === 0 ? 'API Key 1' : 'API Key 2';
  };

  const getErrorDescription = (type: ErrorType) => {
    switch (type) {
      case 'rate_limit':
        return 'Too many requests. Please wait a moment and try again.';
      case 'invalid_search':
        return 'The search query does not match any known weapon system.';
      case 'network_error':
        return 'Unable to connect to the service. Check your internet connection.';
      case 'api_error':
        return 'The API service is currently unavailable. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-primary-500/30 selection:text-white flex flex-col">
      
      {/* Navbar / Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/SectorOnelogo.png" 
              alt="SectorOne Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="font-bold text-lg tracking-tight text-white">
              Sector<span className="text-primary-400">One</span>
            </span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <a
              href="/history"
              className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all border border-slate-700 hover:border-slate-600"
              title="Search History"
            >
              <History className="w-4 h-4" />
              <span className="hidden md:inline text-sm font-medium">History</span>
            </a>
            
            <button
              onClick={() => console.log('Categories clicked')}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all border border-slate-700 hover:border-slate-600"
              title="Browse Categories"
            >
              <Grid className="w-4 h-4" />
              <span className="hidden md:inline text-sm font-medium">Categories</span>
            </button>
            
            <a
              href="/favorites"
              className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all border border-slate-700 hover:border-slate-600"
              title="Favorites"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden md:inline text-sm font-medium">Favorites</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-20 flex-1 w-full">
        
        {/* Search Section */}
        <div className={`transition-all duration-700 ease-in-out ${data ? 'translate-y-0' : 'translate-y-[15vh]'}`}>
          <div className="max-w-3xl mx-auto text-center mb-8">
            {!data && !loading && (
              <>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                  Identify. Analyze. <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-600">
                    Categorize.
                  </span>
                </h1>
                <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
                  Enter any weapon system name to access classified specifications, history, and real-time categorization analysis.
                </p>
              </>
            )}

            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-blue-600 to-primary-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="relative flex items-center bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700 group-hover:border-slate-600 transition-colors">
                <img 
                  src="/SectorOnelogo.png" 
                  alt="SectorOne" 
                  className="ml-4 w-5 h-5 object-contain opacity-60"
                />
                <Search className="ml-3 text-slate-400 w-6 h-6" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. AK-47, M1 Abrams, Desert Eagle..."
                  className="w-full bg-transparent border-none text-white text-lg py-5 px-4 focus:outline-none placeholder:text-slate-600 font-medium"
                />
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="mr-2 px-6 py-3 bg-slate-800 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    "Analyze"
                  )}
                </button>
              </div>
            </form>

            {/* Error Section - DIRECTLY BELOW SEARCH BAR */}
            {error && (
              <div className={`mt-4 p-5 ${getErrorColor(error.type)} border rounded-xl flex items-start gap-4 animate-fade-in backdrop-blur-sm shadow-lg`}>
                {getErrorIcon(error.type)}
                <div className="flex-1 text-left">
                  <h3 className={`${getErrorTextColor(error.type)} font-bold text-lg mb-1`}>
                    {getErrorTitle(error.type)}
                  </h3>
                  <p className="text-slate-300 text-sm mb-2">
                    {getErrorDescription(error.type)}
                  </p>
                  <p className="text-slate-400 text-xs font-mono bg-slate-900/50 px-3 py-2 rounded border border-slate-800 mt-2">
                    {error.message}
                  </p>
                </div>
              </div>
            )}

            {/* Suggestion Section - BELOW ERROR */}
            {suggestion && !error && (
              <div className="mt-4 p-5 bg-amber-950/30 border border-amber-700/50 rounded-xl flex items-start gap-4 animate-fade-in backdrop-blur-sm shadow-lg">
                <AlertTriangle className="text-amber-400 mt-0.5 shrink-0 w-6 h-6" />
                <div className="flex-1 text-left">
                  <h3 className="text-amber-300 font-bold text-lg mb-1">Did you mean?</h3>
                  <p className="text-amber-100/80 text-sm mb-3">
                    We found a close match to your search query.
                  </p>
                  <button
                    onClick={handleSuggestionClick}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                  >
                    Search for "{suggestion}"
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading && !data && (
           <div className="max-w-4xl mx-auto mt-12 space-y-8 animate-pulse">
              <div className="h-64 bg-slate-900 rounded-3xl w-full border border-slate-800" />
              <div className="space-y-4">
                <div className="h-8 bg-slate-800 rounded w-1/3" />
                <div className="h-4 bg-slate-900 rounded w-full" />
                <div className="h-4 bg-slate-900 rounded w-5/6" />
              </div>
           </div>
        )}

        {/* Main Content with Similar Weapons */}
        {data && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Main Weapon Card - Takes 2 columns */}
            <div className="lg:col-span-2">
              <WeaponCard data={data} imageUrl={imageUrl} />
            </div>

            {/* Similar Weapons Section - Takes 1 column */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-600">
                    Similar Weapons
                  </span>
                </h2>
                
                {similarWeapons.length > 0 ? (
                  <div className="space-y-4">
                    {similarWeapons.map((weapon, index) => (
                      <SimilarWeaponCard 
                        key={index} 
                        weapon={weapon}
                        onClick={handleSimilarWeaponClick}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-64 bg-slate-900 rounded-2xl border border-slate-800 animate-pulse" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* New Search Button */}
        {data && !error && (
          <div className="flex justify-center mt-8 mb-10">
            <button
              onClick={() => {
                setQuery('');
                setData(null);
                setImageUrl(null);
                setSimilarWeapons([]);
                setSuggestion(null);
                setError(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 active:scale-95"
            >
              <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Search Another Weapon</span>
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 backdrop-blur-xl mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left: Version & API Info */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <span>V2.4 // OPTIMIZED</span>
                {data && (
                  <>
                    <span className="text-slate-700">•</span>
                    <span>
                      API: <span className="text-blue-400">{getApiKeyDisplay()}</span>
                    </span>
                  </>
                )}
              </div>
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
            </div>

            {/* Center: Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Xeno-legit"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800/50 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all hover:scale-110"
                title="GitHub"
              >
                <Github className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </a>
              
              <a
                href="https://www.linkedin.com/in/abdulhamid-ali-11ba22315/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800/50 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 transition-all hover:scale-110"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </a>
            </div>

            {/* Right: Additional Info */}
            <div className="flex flex-col items-center md:items-end gap-2 text-xs text-slate-500">
              <span>Built with React & TypeScript</span>
              <span className="text-slate-600">Powered by Wikipedia & Gemini API</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;