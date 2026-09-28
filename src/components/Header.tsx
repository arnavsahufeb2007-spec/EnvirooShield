import React, { useState } from 'react';
import { NavTab, StationData } from '../types';
import { formatPM_CGS } from '../utils/cgsUtils';
import { useStationTime } from '../utils/timezoneUtils';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedStation: StationData;
  onOpenExport: () => void;
  simpleMode: boolean;
  setSimpleMode: (val: boolean) => void;
  onOpenGuide: () => void;
  onQuickSearchClick?: () => void;
  onOpenCompare?: () => void;
  onOpenScenarios?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedStation,
  onOpenExport,
  simpleMode,
  setSimpleMode,
  onOpenGuide,
  onQuickSearchClick,
  onOpenCompare,
  onOpenScenarios
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const stationTime = useStationTime(selectedStation);

  const pm25CGS = formatPM_CGS(selectedStation.pm25, 'PM2.5');

  const navItems: { id: NavTab; label: string; simpleLabel: string; icon: string }[] = [
    { id: 'overview-intelligence', label: 'Overview / Intelligence', simpleLabel: 'Overview', icon: 'dashboard' },
    { id: 'live-telemetry-sounding', label: 'Live Telemetry & Sounding', simpleLabel: 'Live Sensors', icon: 'sensors' },
    { id: 'forecast-engine', label: 'Forecast Engine', simpleLabel: '48h Forecast', icon: 'timeline' },
    { id: 'geospatial-grid-stations', label: 'Geospatial Grid & Stations', simpleLabel: 'City Map', icon: 'public' },
    { id: 'explainable-risk-provenance', label: 'Explainable Risk & Provenance', simpleLabel: 'Why Trust Us', icon: 'verified_user' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f1218]/95 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.7)] border-b border-[#272a30]">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Top Status Bar: High Contrast & Clean */}
        <div className="h-9 sm:h-10 flex items-center justify-between bg-[#080a0f] px-3 my-1 rounded border border-[#272a30]">
          <div className="flex items-center gap-3 sm:gap-5 overflow-hidden">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#44e2cd] animate-pulse"></span>
              <span className="font-mono text-[10px] font-bold text-[#e1e2ea] tracking-wider">LIVE STATUS:</span>
              <span className="font-mono text-[11px] text-[#44e2cd] font-semibold">SYNCHRONIZED</span>
            </div>
            
            <div className="hidden lg:flex items-center gap-1.5 shrink-0 text-[11px]">
              <span className="font-mono text-[10px] text-[#87929a] font-bold">STATION:</span>
              <span className="font-mono text-[#8ed5ff] font-semibold flex items-center gap-1">
                <span>{selectedStation.flag || '🌍'}</span>
                <span>{selectedStation.code} ({selectedStation.name.split(' ')[1] || selectedStation.id.toUpperCase()})</span>
              </span>
            </div>

            <div className="hidden xl:flex items-center gap-1 text-[11px] text-[#bdc8d1]">
              <span className="font-mono text-[10px] text-[#87929a] font-bold">AIR QUALITY (CGS):</span>
              <span className="font-mono text-[#fbbf24] font-semibold">
                PM2.5: {pm25CGS.cgsFormatted} [{selectedStation.riskLabel}]
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Guide Button */}
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 text-[#8ed5ff] border border-[#38bdf8]/40 transition-colors font-sans text-[11px] font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">help_outline</span>
              <span>How It Works</span>
            </button>

            {/* Simple / Plain English Toggle */}
            <button
              onClick={() => setSimpleMode(!simpleMode)}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded border transition-colors font-sans text-[11px] font-bold cursor-pointer ${
                simpleMode
                  ? 'bg-[#44e2cd]/20 text-[#44e2cd] border-[#44e2cd]/50 shadow-sm'
                  : 'bg-[#272a30] text-[#bdc8d1] border-[#3e484f] hover:text-white'
              }`}
              title="Toggle between friendly plain English explanations and deep scientific terminology"
            >
              <span className="material-symbols-outlined text-[14px]">
                {simpleMode ? 'check_circle' : 'visibility'}
              </span>
              <span>{simpleMode ? 'Plain English: ON' : 'Plain English: OFF'}</span>
            </button>

            {/* Local Time according to searched city and timezone */}
            <div className="flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-0.5 rounded bg-[#16202c] border border-[#38bdf8]/40 shadow-xs" title={`Local time for ${selectedStation.region} (${stationTime.timezone})`}>
              <span className="text-[13px]">{stationTime.isNight ? '🌙' : '☀️'}</span>
              <span className="text-[10px] text-[#8ed5ff] font-bold uppercase tracking-wider hidden xs:inline">
                {selectedStation.flag || '📍'} TIME:
              </span>
              <span className="text-white font-bold tracking-tight">
                {stationTime.time24}
              </span>
              <span className="text-[#38bdf8] text-[10px] font-semibold">
                {stationTime.timezoneAbbr || stationTime.utcOffsetStr}
              </span>
            </div>

            {/* UTC reference */}
            <div className="hidden md:flex items-center gap-1 font-mono text-[10px] text-[#87929a]">
              <span>UTC:</span>
              <span className="text-[#cbd5e1] font-medium">{stationTime.utcTime.replace(' UTC', '')}</span>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 xl:gap-8">
            {/* Logo */}
            <button 
              onClick={() => setActiveTab('overview-intelligence')}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-[#191c21] flex items-center justify-center border border-[#38bdf8]/50 shadow-md group-hover:scale-105 transition-all">
                <span className="material-symbols-outlined text-[#38bdf8] text-[22px]">shield_with_house</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-[18px] font-extrabold tracking-tight text-white group-hover:text-[#38bdf8] transition-colors">
                    ENVIROSHIELD
                  </span>
                  <span className="font-mono text-[10px] text-[#38bdf8] px-1.5 py-0.5 rounded bg-[#1d2025] border border-[#38bdf8]/40 font-bold">
                    v4.8
                  </span>
                </div>
                <span className="font-sans text-[11px] font-medium text-[#bdc8d1]">
                  Atmospheric Risk & Smog Prediction
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-1 p-1 bg-[#151820] rounded-lg border border-[#272a30]">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 font-sans text-[13px] rounded-md transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#38bdf8] text-[#00354a] font-bold shadow-md'
                        : 'text-[#cbd5e1] hover:bg-[#272a30] hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                    <span>{simpleMode ? item.simpleLabel : item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {onOpenScenarios && (
              <button
                onClick={onOpenScenarios}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#191c28] hover:bg-[#252b3a] text-[#8ed5ff] hover:text-white border border-[#38bdf8]/40 transition-colors rounded-lg font-sans text-[12px] sm:text-[13px] font-bold shadow cursor-pointer"
                title="Launch preset atmospheric demo scenarios (Zurich clean, Delhi inversion, Tokyo sea breeze)"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-[#38bdf8]">science</span>
                <span className="hidden md:inline">Demo Scenarios</span>
                <span className="md:hidden">Demos</span>
              </button>
            )}

            {onOpenCompare && (
              <button
                onClick={onOpenCompare}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#191c28] hover:bg-[#252b3a] text-[#44e2cd] hover:text-white border border-[#44e2cd]/40 transition-colors rounded-lg font-sans text-[12px] sm:text-[13px] font-bold shadow cursor-pointer"
                title="Compare live air quality, local timezones, and physics side-by-side with another city"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
                <span className="hidden md:inline">Compare</span>
                <span className="md:hidden">Vs</span>
              </button>
            )}

            <button
              onClick={() => {
                setActiveTab('overview-intelligence');
                if (onQuickSearchClick) onQuickSearchClick();
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#151922] hover:bg-[#1f2633] text-[#44e2cd] hover:text-white border border-[#44e2cd]/40 transition-colors rounded-lg font-sans text-[12px] sm:text-[13px] font-bold shadow cursor-pointer"
              title="Search and load live air quality for any city in the world"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">public</span>
              <span className="hidden lg:inline">Search World</span>
            </button>

            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#191c21] hover:bg-[#272a30] text-[#38bdf8] hover:text-white border border-[#38bdf8]/40 transition-colors rounded-lg font-sans text-[12px] sm:text-[13px] font-bold shadow cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">sim_card_download</span>
              <span className="hidden lg:inline">Export</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg bg-[#191c21] hover:bg-[#272a30] text-white border border-[#272a30] cursor-pointer"
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
          <div className="xl:hidden py-3 px-2 bg-[#151820] rounded-b-lg border-t border-[#272a30] mb-2 flex flex-col gap-1 shadow-2xl">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 text-[13px] rounded-md transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#38bdf8] text-[#00354a] font-bold'
                      : 'text-[#cbd5e1] hover:bg-[#272a30] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-2 border-t border-[#272a30] mt-1 flex flex-col gap-1">
              {onOpenScenarios && (
                <button
                  onClick={() => {
                    onOpenScenarios();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-[13px] text-[#8ed5ff] hover:bg-[#272a30] rounded-md flex items-center gap-2 font-bold"
                >
                  <span className="material-symbols-outlined text-[18px]">science</span>
                  <span>Interactive Demo Scenarios</span>
                </button>
              )}
              {onOpenCompare && (
                <button
                  onClick={() => {
                    onOpenCompare();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-[13px] text-[#44e2cd] hover:bg-[#272a30] rounded-md flex items-center gap-2 font-bold"
                >
                  <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
                  <span>Side-by-Side City Comparison</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
