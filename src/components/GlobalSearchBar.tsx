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
    }, 280);

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
    <div className="w-full flex flex-col gap-2.5" ref={containerRef}>
      {/* Search Input Container */}
      <div className="relative w-full">
        <div className="relative flex items-center w-full bg-[#151922] border border-[#2d3440] hover:border-[#38bdf8]/60 focus-within:border-[#38bdf8] focus-within:ring-2 focus-within:ring-[#38bdf8]/20 rounded-xl transition-all shadow-md overflow-hidden">
          <div className="pl-3.5 pr-2 flex items-center text-[#8ed5ff] pointer-events-none">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            placeholder="Search any city or country worldwide (e.g., Tokyo, London, New York, Cairo, Paris)..."
            className="w-full py-2.5 sm:py-3 bg-transparent text-white placeholder-[#87929a] font-sans text-[13px] sm:text-[14px] outline-none"
          />

          {isSearching && (
            <div className="pr-3 flex items-center">
              <span className="w-4 h-4 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin"></span>
            </div>
          )}

          {query && !isSearching && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsOpen(false);
              }}
              className="pr-3 text-[#87929a] hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}

          <div className="hidden sm:flex items-center px-3 py-1 mr-2 text-[11px] font-mono text-[#44e2cd] bg-[#44e2cd]/10 rounded border border-[#44e2cd]/25 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#44e2cd] mr-1.5 animate-pulse"></span>
            <span>WORLDWIDE LIVE FEED</span>
          </div>
        </div>

        {/* Autocomplete Dropdown */}
        {isOpen && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#151922] border border-[#2d3440] rounded-xl shadow-2xl z-50 overflow-hidden max-h-72 overflow-y-auto backdrop-blur-md">
            <div className="px-3 py-1.5 bg-[#1a202c] border-b border-[#2d3440] text-[11px] font-mono text-[#87929a] flex items-center justify-between">
              <span>GLOBAL LOCATIONS FOUND ({results.length})</span>
              <span className="text-[#38bdf8]">Click to load real-time atmosphere data</span>
            </div>
            {results.map((loc) => (
              <button
                key={loc.id}
                onClick={() => handleSelect(loc)}
                className="w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-[#1f2633] transition-colors border-b border-[#272a30]/50 last:border-b-0 cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{loc.flag || '🌍'}</span>
                  <div className="flex flex-col">
                    <span className="font-sans font-semibold text-[13px] text-white group-hover:text-[#38bdf8] transition-colors">
                      {loc.name}
                      {loc.admin1 ? `, ${loc.admin1}` : ''}
                    </span>
                    <span className="font-sans text-[11px] text-[#87929a]">
                      {loc.country}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-[#87929a] shrink-0">
                  {loc.timezone && (
                    <span className="hidden sm:inline text-[10px] text-[#8ed5ff] px-1.5 py-0.5 rounded bg-[#38bdf8]/15 border border-[#38bdf8]/30">
                      {loc.timezone.split('/').pop()?.replace(/_/g, ' ')}
                    </span>
                  )}
                  <span>{loc.lat.toFixed(2)}°, {loc.lng.toFixed(2)}°</span>
                  <span className="text-[#38bdf8] opacity-0 group-hover:opacity-100 transition-opacity">Select →</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick World Cities Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        <span className="font-mono text-[10px] text-[#87929a] font-bold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px] text-[#38bdf8]">public</span>
          Quick Cities:
        </span>
        {PRESET_WORLD_CITIES.slice(0, 8).map((city) => {
          const isSelected = selectedCityName.toLowerCase().includes(city.name.toLowerCase());
          return (
            <button
              key={city.id}
              onClick={() => handleSelect(city)}
              disabled={isLoading}
              className={`px-2.5 py-1 rounded-lg font-sans text-[11px] font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-[#38bdf8] text-[#00354a] font-bold shadow-sm'
                  : 'bg-[#191c24] text-[#cbd5e1] hover:bg-[#252b36] hover:text-white border border-[#272a30]'
              }`}
            >
              <span>{city.flag}</span>
              <span>{city.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
