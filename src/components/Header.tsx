import React, { useState } from 'react';
import { NavTab, StationData, UnitSystem } from '../types';
import { useStationTime } from '../utils/timezoneUtils';
import { calculateAQI, getAQICategory } from '../utils/aqiUtils';
import { UnitToggle } from './ui/UnitToggle';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedStation: StationData;
  unitSystem: UnitSystem;
  setUnitSystem: (val: UnitSystem) => void;
  onOpenExport: () => void;
  onOpenGuide: () => void;
  onOpenCompare?: () => void;
  onOpenScenarios?: () => void;
  onQuickSearchClick?: () => void;
  simpleMode?: boolean;
  setSimpleMode?: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedStation,
  unitSystem,
  setUnitSystem,
  onOpenExport,
  onOpenGuide,
  onOpenCompare,
  onOpenScenarios,
  onQuickSearchClick
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const stationTime = useStationTime(selectedStation);

  const aqi = calculateAQI(selectedStation.pm25);
  const category = getAQICategory(aqi);

  const navItems: { id: NavTab; label: string; icon: string }[] = [
    { id: 'overview-intelligence', label: 'Live Overview', icon: 'dashboard' },
    { id: 'forecast-engine', label: '48h Forecast', icon: 'timeline' },
    { id: 'geospatial-grid-stations', label: 'World Map', icon: 'public' },
    { id: 'explainable-risk-provenance', label: 'Science & Transparency', icon: 'verified' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#07090e]/75 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.36)] transition-all">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-3">
          
          {/* Brand Logo & Active City Tag */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={() => setActiveTab('overview-intelligence')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400/25 via-teal-400/15 to-transparent border border-sky-400/35 flex items-center justify-center text-sky-400 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all duration-300 shadow-xs">
                <span className="material-symbols-outlined text-[20px]">air</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[16px] tracking-tight text-white group-hover:text-sky-300 transition-colors">
                    EnviroShield
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/[0.06] text-slate-300 font-medium border border-white/[0.08]">
                    v4.8
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 hidden xs:inline">
                  Atmospheric Intelligence
                </span>
              </div>
            </button>

            {/* Selected Station Live Pill */}
            <div
              onClick={onQuickSearchClick}
              className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/[0.08] text-[12px] cursor-pointer hover:border-sky-400/40 hover:bg-white/[0.08] hover:shadow-[0_4px_14px_rgba(56,189,248,0.2)] hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-200 shadow-xs"
              title="Click to search another location"
            >
              <span className="text-base">{selectedStation.flag || '🌍'}</span>
              <span className="font-medium text-slate-200">
                {selectedStation.region.split('-')[0].trim()}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-sm ${category.bgColor} ${category.textColor} ${category.borderColor}`}
              >
                AQI {aqi} • {category.label}
              </span>
            </div>
          </div>

          {/* Center Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1.5 bg-white/[0.03] backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-inner">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-[13px] font-medium rounded-xl transition-all duration-200 cursor-pointer border group ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-400 to-sky-500 text-slate-950 font-bold border-sky-400/80 shadow-[0_4px_18px_rgba(56,189,248,0.45)] scale-[1.03] -translate-y-0.5'
                      : 'text-slate-300 border-transparent hover:text-white hover:bg-white/[0.09] hover:border-white/[0.18] hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] hover:-translate-y-0.5 hover:scale-[1.03]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px] transition-transform duration-200 group-hover:scale-115">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Unit System Toggle (Standard AQI vs CGS) */}
            <div className="hidden sm:block">
              <UnitToggle unitSystem={unitSystem} onToggle={setUnitSystem} />
            </div>

            {/* Local Time Indicator */}
            <div
              className="hidden xl:flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.04] backdrop-blur-md border border-white/[0.08] text-slate-300 shadow-xs"
              title={`Local time in ${selectedStation.region} (${stationTime.timezone})`}
            >
              <span>{stationTime.isNight ? '🌙' : '☀️'}</span>
              <span className="text-white font-semibold">{stationTime.time24}</span>
              <span className="text-slate-400 text-[10px]">
                {stationTime.timezoneAbbr || stationTime.utcOffsetStr}
              </span>
            </div>

            {/* Compare Trigger */}
            {onOpenCompare && (
              <button
                type="button"
                onClick={onOpenCompare}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-teal-400/40 text-slate-200 text-[12px] font-medium transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_4px_12px_rgba(68,226,205,0.2)] cursor-pointer backdrop-blur-md shadow-xs"
                title="Compare air quality side-by-side with another city"
              >
                <span className="material-symbols-outlined text-[16px] text-teal-400">compare_arrows</span>
                <span className="hidden lg:inline">Compare</span>
              </button>
            )}

            {/* Demo Scenarios Trigger */}
            {onOpenScenarios && (
              <button
                type="button"
                onClick={onOpenScenarios}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-amber-400/40 text-slate-200 text-[12px] font-medium transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_4px_12px_rgba(251,191,36,0.2)] cursor-pointer backdrop-blur-md shadow-xs"
                title="Explore preset atmospheric scenarios"
              >
                <span className="material-symbols-outlined text-[16px] text-amber-400">science</span>
                <span>Scenarios</span>
              </button>
            )}

            {/* Guide Button */}
            <button
              type="button"
              onClick={onOpenGuide}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-sky-400/40 text-slate-300 hover:text-white text-[12px] font-medium transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_4px_12px_rgba(56,189,248,0.2)] cursor-pointer flex items-center gap-1 backdrop-blur-md shadow-xs"
              title="How this platform works"
            >
              <span className="material-symbols-outlined text-[17px] text-sky-400">help_outline</span>
              <span className="hidden sm:inline">Guide</span>
            </button>

            {/* Export Trigger */}
            <button
              type="button"
              onClick={onOpenExport}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.22] text-slate-300 hover:text-white text-[12px] font-medium transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_4px_12px_rgba(255,255,255,0.06)] cursor-pointer flex items-center gap-1 backdrop-blur-md shadow-xs"
              title="Export data (JSON / CSV)"
            >
              <span className="material-symbols-outlined text-[17px]">download</span>
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-[#121620] border border-[#222a3d] text-slate-200 hover:text-white cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <span className="material-symbols-outlined text-[20px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 px-2.5 bg-slate-950/90 backdrop-blur-2xl rounded-2xl border border-white/[0.1] mb-3 flex flex-col gap-2 shadow-2xl">
            <div className="flex items-center justify-between px-2 pb-2.5 border-b border-white/[0.08]">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                Navigation Menu
              </span>
              <UnitToggle unitSystem={unitSystem} onToggle={setUnitSystem} />
            </div>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3.5 py-2.5 text-[13px] rounded-xl transition-all duration-200 flex items-center gap-2.5 font-medium border cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-400 to-sky-500 text-slate-950 font-bold border-sky-400 shadow-[0_2px_12px_rgba(56,189,248,0.4)] scale-[1.01]'
                      : 'text-slate-300 border-transparent hover:border-white/[0.12] hover:bg-white/[0.08] hover:text-white hover:pl-5 hover:scale-[1.01]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-2 border-t border-white/[0.08] grid grid-cols-2 gap-2">
              {onOpenCompare && (
                <button
                  onClick={() => {
                    onOpenCompare();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-teal-400/40 text-slate-200 text-[12px] font-medium flex items-center gap-1.5 justify-center transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-teal-400">compare_arrows</span>
                  <span>Compare Cities</span>
                </button>
              )}
              {onOpenScenarios && (
                <button
                  onClick={() => {
                    onOpenScenarios();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-amber-400/40 text-slate-200 text-[12px] font-medium flex items-center gap-1.5 justify-center transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-amber-400">science</span>
                  <span>Demo Scenarios</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
