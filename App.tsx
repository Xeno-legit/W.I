import React, { useState, useCallback } from 'react';
import { Search, Shield, Loader2, AlertCircle } from 'lucide-react';
import { identifyWeapon } from './services/geminiService';
import { fetchWikipediaImage } from './services/wikipediaService';
import { WeaponData } from './types';
import { WeaponCard } from './components/WeaponCard';

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WeaponData | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);
    setImageUrl(null);

    try {
      // 1. Start AI analysis
      const aiPromise = identifyWeapon(query);
      
      // 2. Try fetching image with user query immediately (optimistic)
      const wikiPromise = fetchWikipediaImage(query);

      const [aiData, initialImage] = await Promise.all([aiPromise, wikiPromise]);

      let finalImage = initialImage;

      // 3. Smart Retry: If no image found, use the OFFICIAL name from AI to try again.
      // This fixes cases where user types "deagle" but wiki needs "IMI Desert Eagle"
      if (!finalImage && aiData && aiData.isValidWeapon) {
        // Only retry if the name is sufficiently different to warrant a new search
        if (aiData.name.toLowerCase() !== query.trim().toLowerCase()) {
           console.log(`Retrying image search with official name: ${aiData.name}`);
           finalImage = await fetchWikipediaImage(aiData.name);
        }
        
        // If STILL no image, try appending the type (e.g. "M1 Abrams Tank")
        if (!finalImage) {
           console.log(`Retrying image search with context: ${aiData.name} weapon`);
           finalImage = await fetchWikipediaImage(`${aiData.name} weapon`);
        }
      }

      setData(aiData);
      setImageUrl(finalImage);

    } catch (err: any) {
      setError(err.message || "Failed to retrieve weapon data.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-primary-500/30 selection:text-white pb-20">
      
      {/* Navbar / Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Shield className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Tactical<span className="text-primary-400">Armory</span>
            </span>
          </div>
          <div className="text-xs font-mono text-slate-500 hidden md:block">
            V2.1 // VISUAL-LINKED
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-20">
        
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
                <Search className="ml-6 text-slate-400 w-6 h-6" />
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
          </div>
        </div>

        {/* Content Section */}
        {error && (
          <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-950/30 border border-red-900/50 rounded-lg flex items-start gap-3 animate-fade-in">
             <AlertCircle className="text-red-500 mt-1 shrink-0" />
             <div>
               <h3 className="text-red-400 font-bold">Analysis Failed</h3>
               <p className="text-red-200/60 text-sm">{error}</p>
             </div>
          </div>
        )}

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

        {data && <WeaponCard data={data} imageUrl={imageUrl} />}

      </main>
    </div>
  );
}

export default App;