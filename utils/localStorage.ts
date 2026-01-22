import { WeaponData } from '../types';

const HISTORY_KEY = 'weaponSearchHistory';
const CACHE_KEY = 'weaponCache';
const MAX_HISTORY_ITEMS = 50;
const MAX_CACHE_ITEMS = 100;
const CACHE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface HistoryItem {
  weapon: WeaponData;
  searchedAt: string;
  query: string;
}

export interface CachedWeapon {
  weapon: WeaponData;
  imageUrl: string | null;
  similarWeapons: any[]; // Store similar weapons too
  cachedAt: string;
  query: string;
}

// ============ HISTORY FUNCTIONS ============

export const saveToHistory = (weapon: WeaponData, query: string): void => {
  try {
    const history = getHistory();
    
    // Check if weapon already exists in history
    const existingIndex = history.findIndex(item => 
      item.weapon.name.toLowerCase() === weapon.name.toLowerCase()
    );
    
    // Remove existing entry if found
    if (existingIndex !== -1) {
      history.splice(existingIndex, 1);
    }
    
    // Add new entry at the beginning
    const newItem: HistoryItem = {
      weapon,
      searchedAt: new Date().toISOString(),
      query
    };
    
    history.unshift(newItem);
    
    // Keep only the last MAX_HISTORY_ITEMS
    if (history.length > MAX_HISTORY_ITEMS) {
      history.splice(MAX_HISTORY_ITEMS);
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save to history:', error);
  }
};

export const getHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};

export const removeFromHistory = (weaponName: string): void => {
  try {
    const history = getHistory();
    const filtered = history.filter(item => 
      item.weapon.name.toLowerCase() !== weaponName.toLowerCase()
    );
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove from history:', error);
  }
};

// ============ CACHE FUNCTIONS ============

export const saveToCache = (weapon: WeaponData, imageUrl: string | null, similarWeapons: any[], query: string): void => {
  try {
    const cache = getCache();
    
    // Remove existing entry if found
    const existingIndex = cache.findIndex(item => 
      item.query.toLowerCase() === query.toLowerCase()
    );
    
    if (existingIndex !== -1) {
      cache.splice(existingIndex, 1);
    }
    
    // Add new entry at the beginning
    const newItem: CachedWeapon = {
      weapon,
      imageUrl,
      similarWeapons,
      cachedAt: new Date().toISOString(),
      query
    };
    
    cache.unshift(newItem);
    
    // Keep only the last MAX_CACHE_ITEMS
    if (cache.length > MAX_CACHE_ITEMS) {
      cache.splice(MAX_CACHE_ITEMS);
    }
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    console.log('✅ Cached weapon with similar weapons:', query);
  } catch (error) {
    console.error('Failed to save to cache:', error);
  }
};

export const getFromCache = (query: string): CachedWeapon | null => {
  try {
    const cache = getCache();
    const cached = cache.find(item => 
      item.query.toLowerCase() === query.toLowerCase()
    );
    
    if (!cached) return null;
    
    // Check if cache is expired
    const cachedDate = new Date(cached.cachedAt);
    const now = new Date();
    const age = now.getTime() - cachedDate.getTime();
    
    if (age > CACHE_DURATION_MS) {
      console.log('⏰ Cache expired for:', query);
      removeFromCache(query);
      return null;
    }
    
    console.log('🚀 Using cached data for:', query);
    return cached;
  } catch (error) {
    console.error('Failed to get from cache:', error);
    return null;
  }
};

const getCache = (): CachedWeapon[] => {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load cache:', error);
    return [];
  }
};

export const clearCache = (): void => {
  try {
    localStorage.removeItem(CACHE_KEY);
    console.log('🗑️ Cache cleared');
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
};

const removeFromCache = (query: string): void => {
  try {
    const cache = getCache();
    const filtered = cache.filter(item => 
      item.query.toLowerCase() !== query.toLowerCase()
    );
    localStorage.setItem(CACHE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove from cache:', error);
  }
};

