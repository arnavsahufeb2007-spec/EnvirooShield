import React, { useState, useEffect, useRef } from 'react';
import {
  searchGlobalLocations,
  PRESET_WORLD_CITIES,
  GlobalLocationSearchResult
} from '../services/airQualityApi';

interface GlobalSearchBarProps {
  onSelectLocation: (loc: GlobalLocationSearchResult) => void;
  selectedCityName?: string;
  isLoading?: boolean;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  onSelectLocation,
  selectedCityName = 'Delhi',
  isLoading = false
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalLocationSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener ('/' to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const found = await searchGlobalLocations(query);
        setResults(found);
        setIsOpen(true);
      } catch (e) {
        console.error('Search error', e);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: GlobalLocationSearchResult) => {
    setQuery('');
    setIsOpen(false);
    onSelectLocation(loc);
  };

  return (
    <div className="w-full flex flex-col gap-3" ref={containerRef}>
      {/* Search Input Container */}
      <div className="relative w-full">
        <div className="relative flex items-center w-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.1] hover:border-white/[0.25] focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/20 rounded-2xl transition-all duration-200 shadow-sm">
          <div className="pl-3.5 pr-2 flex items-center text-slate-400 pointer-events-none">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            placeholder="Search any city worldwide (e.g., Tokyo, London, New York, Cairo, Mumbai, Paris)..."
            className="w-full py-2.5 sm:py-3 bg-transparent text-white placeholder-slate-400 text-[13px] sm:text-[14px] outline-none"
          />

          <div className="flex items-center gap-1.5 pr-3">
            {isSearching && (
              <span className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></span>
            )}

            {query && !isSearching && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                  setIsOpen(false);
                }}
                className="text-slate-400 hover:text-white hover:scale-110 transition-all cursor-pointer p-0.5"
                title="Clear search"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}

            {/* Keyboard shortcut hint */}
            {!query && (
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-white/[0.04] border border-white/[0.1]">
                /
              </span>
            )}
          </div>
        </div>

        {/* Autocomplete Dropdown */}
        {isOpen && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950/90 border border-white/[0.12] rounded-2xl shadow-2xl z-50 overflow-hidden max-h-72 overflow-y-auto backdrop-blur-2xl">
            <div className="px-3.5 py-2 bg-white/[0.04] border-b border-white/[0.08] text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>LOCATIONS ({results.length})</span>
              <span className="text-sky-400">Real-time Open-Meteo Feed</span>
            </div>
            {results.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleSelect(loc)}
                className="w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-white/[0.08] hover:pl-5 transition-all duration-150 border-b border-white/[0.05] last:border-b-0 cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl group-hover:scale-110 transition-transform">{loc.flag || '🌍'}</span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-[13px] text-white group-hover:text-sky-400 transition-colors">
                      {loc.name}
                      {loc.admin1 ? `, ${loc.admin1}` : ''}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {loc.country}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 shrink-0">
                  {loc.timezone && (
                    <span className="hidden sm:inline text-[10px] text-sky-300 px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                      {loc.timezone.split('/').pop()?.replace(/_/g, ' ')}
                    </span>
                  )}
                  <span>{loc.lat.toFixed(2)}°, {loc.lng.toFixed(2)}°</span>
                  <span className="material-symbols-outlined text-[16px] text-sky-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    arrow_forward
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick World Cities Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] text-slate-400 font-medium shrink-0 mr-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-[15px] text-sky-400">place</span>
          Popular:
        </span>
        {PRESET_WORLD_CITIES.slice(0, 8).map((city) => {
          const isSelected = selectedCityName.toLowerCase().includes(city.name.toLowerCase());
          return (
            <button
              key={city.id}
              type="button"
              onClick={() => handleSelect(city)}
              disabled={isLoading}
              className={`px-3 py-1 rounded-xl text-[12px] font-medium shrink-0 flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition-all duration-200 ${
                isSelected
                  ? 'glass-pill-active'
                  : 'glass-pill'
              }`}
            >
              <span className="group-hover:scale-110 transition-transform">{city.flag}</span>
              <span>{city.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
