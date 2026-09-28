import React, { useState } from 'react';
import { StationData, StationId } from '../types';
import { STATIONS } from '../data/mockData';
import { useStationTime } from '../utils/timezoneUtils';

interface GeospatialGridScreenProps {
  currentStation: StationData;
  onSelectStation: (id: StationId) => void;
  onOpenSounding: () => void;
  onNotify: (title: string, description: string) => void;
  simpleMode?: boolean;
}

export const GeospatialGridScreen: React.FC<GeospatialGridScreenProps> = ({
  currentStation,
  onSelectStation,
  onOpenSounding,
  onNotify,
  simpleMode = true
}) => {
  // Layer toggles
  const [showPlume, setShowPlume] = useState(true);
  const [showWind, setShowWind] = useState(true);
  const [showInversion, setShowInversion] = useState(true);
  const [showStations, setShowStations] = useState(true);
  const [showTerrain, setShowTerrain] = useState(true);

  // Satellite overpass scrubber
  const [overpassProgress, setOverpassProgress] = useState(65);
  const [zoomLevel, setZoomLevel] = useState(1);
  const stationTime = useStationTime(currentStation);

  const handleStationClick = (id: StationId) => {
    onSelectStation(id);
    const stationName = STATIONS[id]?.name || currentStation.name || id;
    onNotify('Station Node Focused', `Cartographic reticle and inspector centered on ${stationName}.`);
  };

  const worldQuickPins: { id: StationId; label: string; flag: string }[] = [
    { id: 'delhi', label: 'Delhi', flag: '🇮🇳' },
    { id: 'tokyo', label: 'Tokyo', flag: '🇯🇵' },
    { id: 'new-york', label: 'New York', flag: '🇺🇸' },
    { id: 'london', label: 'London', flag: '🇬🇧' },
    { id: 'paris', label: 'Paris', flag: '🇫🇷' },
    { id: 'cairo', label: 'Cairo', flag: '🇪🇬' },
    { id: 'mumbai', label: 'Mumbai', flag: '🇮🇳' },
    { id: 'sao-paulo', label: 'São Paulo', flag: '🇧🇷' }
  ];

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8 pb-8">
      {/* Plain-English Map Guide when Simple Mode is enabled */}
      {simpleMode && (
        <div className="bg-[#151c28] border border-[#38bdf8]/40 rounded-xl p-4 sm:p-5 shadow-lg mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/20 border border-[#38bdf8]/40 flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[#38bdf8] text-[20px]">public</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-white text-[14px]">
                  Interactive Worldwide Air Quality Map
                </span>
                <span className="font-mono text-[10px] bg-[#44e2cd]/20 text-[#44e2cd] border border-[#44e2cd]/30 px-2 py-0.5 rounded font-bold">
                  GLOBAL STATIONS
                </span>
              </div>
              <p className="font-sans text-[12px] text-[#cbd5e1] leading-relaxed">
                Click any global city pin below to instantly focus the cartographic reticle and display that city's live CGS atmospheric readings.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap shrink-0 self-end md:self-center">
            {worldQuickPins.map((item) => (
              <button
                key={item.id}
                onClick={() => handleStationClick(item.id)}
                className={`px-2.5 py-1 rounded-lg font-sans text-[11px] font-bold transition-colors cursor-pointer border flex items-center gap-1 ${
                  currentStation.id === item.id
                    ? 'bg-[#38bdf8] text-[#00354a] border-[#38bdf8]'
                    : 'bg-[#191c21] text-[#cbd5e1] border-[#272a30] hover:text-white'
                }`}
              >
                <span>{item.flag}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Operational Header & Synoptic Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 py-2.5 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-[#38bdf8] rounded-full" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-semibold text-[#bdc8d1] uppercase tracking-widest">
                SYNOPTIC DOMAIN // REGION_04
              </span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#272a30] text-[#44e2cd] border border-[#272a30]">
                46 TIER-1 PODS ONLINE
              </span>
            </div>
            <div className="font-sans text-[20px] font-bold text-white tracking-tight">
              Geospatial Grid & Regional Surveillance
            </div>
          </div>
        </div>

        {/* Geo Target & Sync Metainfo */}
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px]">
          <div className="bg-[#191c21] px-3 py-1.5 rounded border border-[#272a30] flex items-center gap-1.5">
            <span className="text-[#87929a]">BOUNDING_BOX:</span>
            <span className="text-white">[15.0°N–33.0°N, 68.0°E–90.0°E]</span>
          </div>
          <div className="bg-[#191c21] px-3 py-1.5 rounded border border-[#272a30] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#8ed5ff] text-[15px]">satellite_alt</span>
            <span className="text-[#87929a]">SWATH:</span>
            <span className="text-[#8ed5ff]">SENTINEL-5P / INSAT-3DR L2</span>
          </div>
          <div className="bg-[#272a30] px-3 py-1.5 rounded border border-[#272a30] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#44e2cd] animate-ping" />
            <span className="text-[#44e2cd] font-semibold">REAL-TIME INGESTION</span>
          </div>
        </div>
      </div>

      {/* Synoptic Warnings Ticker / Early Warning Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Advisory 1 */}
        <div className="bg-[#191c21] p-4 rounded border border-[#272a30] flex items-start justify-between shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-[#ffb4ab]/15 text-[#ffb4ab] border border-[#ffb4ab]/30 flex items-center justify-center mt-0.5">
              <span className="material-symbols-outlined text-[18px]">warning</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#ffb4ab] uppercase font-bold">
                  CRITICAL EARLY WARNING // 36H ADVISORY
                </span>
                <span className="font-mono text-[11px] text-[#87929a]">STG-INDO-904</span>
              </div>
              <span className="font-sans text-[15px] font-bold text-white mt-0.5">
                Indo-Gangetic Basin Stagnation Corridor
              </span>
              <p className="font-sans text-[12px] text-[#bdc8d1] mt-1 leading-relaxed">
                Strong planetary boundary layer subsidence trap below 700m ASL. Atmospheric ventilation index dropped by 44%. Extreme particulate accumulation predicted over NCR and Punjab plains.
              </p>
            </div>
          </div>
          <div className="text-right flex flex-col shrink-0 ml-3">
            <span className="font-mono text-[16px] text-[#ffb4ab] font-bold">CAP &lt;620m</span>
            <span className="font-mono text-[10px] text-[#87929a] uppercase">INVERSION HEIGHT</span>
          </div>
        </div>

        {/* Advisory 2 */}
        <div className="bg-[#191c21] p-4 rounded border border-[#272a30] flex items-start justify-between shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-[#44e2cd]/15 text-[#44e2cd] border border-[#44e2cd]/30 flex items-center justify-center mt-0.5">
              <span className="material-symbols-outlined text-[18px]">airwave</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#44e2cd] uppercase font-bold">
                  SURVEILLANCE WATCH // COASTAL INFLUX
                </span>
                <span className="font-mono text-[11px] text-[#87929a]">HYG-WEST-410</span>
              </div>
              <span className="font-sans text-[15px] font-bold text-white mt-0.5">
                Arabian Sea Moisture Influx & Particle Deliquescence
              </span>
              <p className="font-sans text-[12px] text-[#bdc8d1] mt-1 leading-relaxed">
                Rel. Humidity elevated at 81-88% throughout Konkan maritime vector. High aerosol hygroscopic growth amplifying optical depth (AOD &gt; 0.68). Primary impact: Mumbai Coastal Node.
              </p>
            </div>
          </div>
          <div className="text-right flex flex-col shrink-0 ml-3">
            <span className="font-mono text-[16px] text-[#44e2cd] font-bold">RH 81.4%</span>
            <span className="font-mono text-[10px] text-[#87929a] uppercase">SURFACE SATURATION</span>
          </div>
        </div>
      </div>

      {/* Primary Cartographic & Telemetry Workspace (3-Column Layout) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* LEFT PANEL: Layer Manager & Spatial Controls (3 Columns) */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          {/* Active Layers Box */}
          <div className="bg-[#191c21] p-4 rounded border border-[#272a30] shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#272a30]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8ed5ff] text-[18px]">layers</span>
                <span className="font-sans text-[15px] font-bold text-white">Cartographic Layers</span>
              </div>
              <span className="font-mono text-[10px] text-[#8ed5ff] bg-[#38bdf8]/15 border border-[#38bdf8]/30 px-2 py-0.5 rounded font-semibold">
                {[showPlume, showWind, showInversion, showStations, showTerrain].filter(Boolean).length} ACTIVE
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              {/* Layer 1 */}
              <label className="flex items-center justify-between p-2.5 rounded bg-[#1d2025] hover:bg-[#272a30] border border-[#272a30] transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#a1d2ff] text-[18px]">grain</span>
                  <div className="flex flex-col">
                    <span className="font-sans text-[13px] text-white font-medium">PM2.5 Plume Dispersion</span>
                    <span className="font-mono text-[10px] text-[#87929a]">CAMS-NRT Gaussian Advection</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={showPlume}
                  onChange={(e) => setShowPlume(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0b0e13] border-[#272a30] accent-[#38bdf8] cursor-pointer"
                />
              </label>

              {/* Layer 2 */}
              <label className="flex items-center justify-between p-2.5 rounded bg-[#1d2025] hover:bg-[#272a30] border border-[#272a30] transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#44e2cd] text-[18px]">cyclone</span>
                  <div className="flex flex-col">
                    <span className="font-sans text-[13px] text-white font-medium">Wind Vector Graticule</span>
                    <span className="font-mono text-[10px] text-[#87929a]">ECMWF 10m Streamlines (NW Flow)</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={showWind}
                  onChange={(e) => setShowWind(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0b0e13] border-[#272a30] accent-[#44e2cd] cursor-pointer"
                />
              </label>

              {/* Layer 3 */}
              <label className="flex items-center justify-between p-2.5 rounded bg-[#1d2025] hover:bg-[#272a30] border border-[#272a30] transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#ffb4ab] text-[18px]">vertical_align_bottom</span>
                  <div className="flex flex-col">
                    <span className="font-sans text-[13px] text-white font-medium">Thermal Inversion Caps</span>
                    <span className="font-mono text-[10px] text-[#87929a]">INSAT-3DR Sounding Lapse Rate</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={showInversion}
                  onChange={(e) => setShowInversion(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0b0e13] border-[#272a30] accent-[#ffb4ab] cursor-pointer"
                />
              </label>

              {/* Layer 4 */}
              <label className="flex items-center justify-between p-2.5 rounded bg-[#1d2025] hover:bg-[#272a30] border border-[#272a30] transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#8ed5ff] text-[18px]">sensors</span>
                  <div className="flex flex-col">
                    <span className="font-sans text-[13px] text-white font-medium">Tier-1 Monitoring Array</span>
                    <span className="font-mono text-[10px] text-[#87929a]">46 Calibrated Spectrometric Pods</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={showStations}
                  onChange={(e) => setShowStations(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0b0e13] border-[#272a30] accent-[#38bdf8] cursor-pointer"
                />
              </label>

              {/* Layer 5 */}
              <label className="flex items-center justify-between p-2.5 rounded bg-[#1d2025] hover:bg-[#272a30] border border-[#272a30] transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#87929a] text-[18px]">landscape</span>
                  <div className="flex flex-col">
                    <span className="font-sans text-[13px] text-white font-medium">Terrain Orographic Traps</span>
                    <span className="font-mono text-[10px] text-[#87929a]">SRTM 30m Digital Elevation</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={showTerrain}
                  onChange={(e) => setShowTerrain(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0b0e13] border-[#272a30] accent-[#38bdf8] cursor-pointer"
                />
              </label>
            </div>

            {/* Density scale legend */}
            <div className="pt-2 flex flex-col gap-1 border-t border-[#272a30]">
              <span className="font-mono text-[10px] text-[#87929a] uppercase tracking-wider font-semibold">
                Aerosol Loading Density (µg/m³)
              </span>
              <div className="grid grid-cols-4 gap-1 text-center font-mono text-[10px] font-bold">
                <div className="bg-[#44e2cd]/20 text-[#44e2cd] py-1 rounded border border-[#44e2cd]/30">0 - 30</div>
                <div className="bg-[#38bdf8]/20 text-[#8ed5ff] py-1 rounded border border-[#38bdf8]/30">30 - 60</div>
                <div className="bg-[#5cb9ff]/20 text-[#c4e7ff] py-1 rounded border border-[#5cb9ff]/30">60 - 90</div>
                <div className="bg-[#93000a]/40 text-[#ffb4ab] py-1 rounded border border-[#ffb4ab]/30">&gt; 90</div>
              </div>
              <div className="flex justify-between font-mono text-[8px] text-[#87929a] mt-0.5 uppercase">
                <span>CLEAN MARITIME</span>
                <span>MODERATE</span>
                <span>ACCUMULATIVE</span>
                <span>SEVERE TRAP</span>
              </div>
            </div>
          </div>

          {/* Key Monitoring Nodes Selector */}
          <div className="bg-[#191c21] p-4 rounded border border-[#272a30] shadow-sm flex flex-col gap-2.5">
            <div className="flex items-center justify-between pb-1">
              <span className="font-sans text-[14px] font-bold text-white">Key Monitoring Nodes</span>
              <span className="font-mono text-[10px] text-[#87929a]">SELECT TO PIN</span>
            </div>
            <div className="flex flex-col gap-1.5 font-mono">
              {Object.values(STATIONS).map((st) => {
                const isSelected = st.id === currentStation.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleStationClick(st.id)}
                    className={`text-left p-2.5 rounded border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#272a30] border-[#38bdf8]'
                        : 'bg-[#1d2025] border-[#272a30] hover:bg-[#272a30]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${st.id === 'delhi' ? 'bg-[#ffb4ab]' : (st.id === 'mumbai' ? 'bg-[#44e2cd]' : 'bg-[#38bdf8]')}`} />
                      <div className="flex flex-col">
                        <span className="font-sans text-[13px] font-semibold text-white">{st.code}</span>
                        <span className="text-[10px] text-[#87929a]">
                          {st.lat.toFixed(4)}°N, {st.lng.toFixed(4)}°E
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[14px] font-bold ${st.pm25 > 50 ? 'text-[#ffb4ab]' : 'text-[#44e2cd]'}`}>
                        {st.pm25.toFixed(1)}
                      </span>
                      <span className="text-[9px] text-[#87929a] block">µg/m³</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Orographic Basin Diagnostic Snippet */}
          <div className="bg-[#0b0e13] p-3 rounded border border-[#272a30] shadow-sm flex flex-col gap-1">
            <span className="font-mono text-[10px] text-[#87929a] uppercase tracking-wider font-semibold">
              Topographic Cross-Section
            </span>
            <div className="h-20 w-full relative flex items-end">
              <svg className="w-full h-full text-[#272a30]" viewBox="0 0 200 60" fill="none" preserveAspectRatio="none">
                <path d="M0,55 Q30,52 60,40 T120,25 T160,10 T200,45 L200,60 L0,60 Z" fill="currentColor" opacity="0.8" />
                <path d="M0,58 Q40,55 80,48 T140,32 T180,20 T200,50" stroke="#87929a" strokeWidth="1" strokeDasharray="2,2" />
                {/* Thermal Inversion boundary line */}
                <line x1="30" y1="28" x2="160" y2="28" stroke="#ffb4ab" strokeWidth="1.5" strokeDasharray="4,2" />
                <text x="35" y="24" fill="#ffb4ab" className="font-mono text-[7px] font-bold">INVERSION CAP 620m</text>
              </svg>
            </div>
            <div className="flex justify-between font-mono text-[10px] text-[#bdc8d1] pt-1 border-t border-[#272a30]">
              <span>THAR/PLAINS</span>
              <span className="text-[#ffb4ab] font-bold">BASIN TRAP</span>
              <span>HIMALAYAN FOOTHILLS</span>
            </div>
          </div>
        </div>

        {/* CENTER PANEL: Primary Interactive Cartographic Canvas (6 Columns) */}
        <div className="xl:col-span-6 flex flex-col gap-4">
          <div className="relative w-full h-[580px] bg-[#0b0e13] rounded border border-[#272a30] overflow-hidden shadow-2xl flex flex-col justify-between p-3">
            {/* Vector Background Graticule */}
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full opacity-40">
                <defs>
                  <pattern id="cartoGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#273244" strokeWidth="0.75" />
                    <circle cx="0" cy="0" r="1" fill="#8ed5ff" opacity="0.4" />
                  </pattern>
                  <radialGradient id="delhiPlume" cx="50%" cy="30%" r="50%">
                    <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.4" />
                    <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#111319" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="gangeticBelt" cx="55%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#5cb9ff" stopOpacity="0.3" />
                    <stop offset="70%" stopColor="#44e2cd" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#111319" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <rect width="100%" height="100%" fill="url(#cartoGrid)" />

                {/* Plume layers if enabled */}
                {showPlume && (
                  <>
                    <ellipse cx="60%" cy="32%" rx="180" ry="60" fill="url(#gangeticBelt)" transform="rotate(-12, 340, 180)" />
                    <circle cx="56%" cy="30%" r="65" fill="url(#delhiPlume)" />
                  </>
                )}

                {/* Wind streamlines if enabled */}
                {showWind && (
                  <g stroke="#8ed5ff" strokeWidth="1.2" strokeDasharray="8,6" opacity="0.5">
                    <path d="M 80 40 Q 180 80 280 140 T 450 200" />
                    <path d="M 120 70 Q 220 110 320 170 T 490 230" />
                    <path d="M 60 120 Q 160 160 260 220 T 430 280" />
                    <path d="M 140 180 Q 220 230 300 290 T 470 350" />
                    <path d="M 100 240 Q 180 290 260 360 T 410 430" />
                  </g>
                )}

                {/* Graticule labels */}
                <text x="12" y="24" fill="#87929a" className="font-mono text-[10px]">32.0°N</text>
                <text x="12" y="150" fill="#87929a" className="font-mono text-[10px]">28.0°N</text>
                <text x="12" y="280" fill="#87929a" className="font-mono text-[10px]">24.0°N</text>
                <text x="12" y="420" fill="#87929a" className="font-mono text-[10px]">20.0°N</text>
                <text x="12" y="540" fill="#87929a" className="font-mono text-[10px]">16.0°N</text>
                <text x="120" y="565" fill="#87929a" className="font-mono text-[10px]">72.0°E</text>
                <text x="280" y="565" fill="#87929a" className="font-mono text-[10px]">76.0°E</text>
                <text x="440" y="565" fill="#87929a" className="font-mono text-[10px]">80.0°E</text>
                <text x="560" y="565" fill="#87929a" className="font-mono text-[10px]">84.0°E</text>
              </svg>
            </div>

            {/* Top Canvas HUD */}
            <div className="relative z-10 flex items-center justify-between bg-[#191c21]/90 backdrop-blur-md px-3 py-1.5 rounded border border-[#272a30]">
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="text-[#8ed5ff] font-semibold">EPSG:4326 // WGS 84</span>
                <span className="text-[#87929a]">RES: 0.05° x 0.05°</span>
                <span className="text-[#44e2cd]">WIND: NW @ 3.8 m/s</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setZoomLevel(Math.min(1.5, zoomLevel + 0.1))}
                  className="p-1 rounded bg-[#272a30] hover:bg-[#32353b] text-white border border-[#272a30]"
                >
                  <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(Math.max(0.8, zoomLevel - 0.1))}
                  className="p-1 rounded bg-[#272a30] hover:bg-[#32353b] text-white border border-[#272a30]"
                >
                  <span className="material-symbols-outlined text-[16px]">zoom_out</span>
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="p-1 rounded bg-[#272a30] hover:bg-[#32353b] text-white border border-[#272a30]"
                >
                  <span className="material-symbols-outlined text-[16px]">center_focus_strong</span>
                </button>
              </div>
            </div>

            {/* Interactive Station Nodes */}
            {showStations && (
              <div
                className="relative z-10 w-full h-full pointer-events-none transition-transform duration-300"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {/* Station 1: New Delhi */}
                <div
                  className="absolute top-[28%] left-[55%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                  onClick={() => handleStationClick('delhi')}
                >
                  <div className="relative flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#ffb4ab]/25 animate-ping absolute" />
                    <div className="w-5 h-5 rounded-full bg-[#0b0e13] flex items-center justify-center shadow-lg border border-[#ffb4ab]">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab]" />
                    </div>
                  </div>
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-[#1d2025]/95 backdrop-blur-md px-2.5 py-1 rounded border border-[#ffb4ab]/40 shadow-xl whitespace-nowrap group-hover:scale-105 transition-transform">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] font-bold text-[#ffb4ab]">ND-CENTRAL-04</span>
                      <span className="font-mono text-[9px] bg-[#93000a] text-[#ffdad6] px-1 rounded font-bold">TRAP</span>
                    </div>
                    <div className="font-mono text-[11px] text-white">
                      PM2.5: <span className="font-bold text-[#ffb4ab]">86.4</span> µg/m³
                    </div>
                  </div>
                </div>

                {/* Station 2: Mumbai */}
                <div
                  className="absolute top-[68%] left-[34%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                  onClick={() => handleStationClick('mumbai')}
                >
                  <div className="relative flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#44e2cd]/20 animate-pulse absolute" />
                    <div className="w-4 h-4 rounded-full bg-[#0b0e13] flex items-center justify-center shadow-lg border border-[#44e2cd]">
                      <div className="w-2 h-2 rounded-full bg-[#44e2cd]" />
                    </div>
                  </div>
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 bg-[#1d2025]/95 backdrop-blur-md px-2.5 py-1 rounded border border-[#44e2cd]/40 shadow-xl whitespace-nowrap group-hover:scale-105 transition-transform">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] font-bold text-[#44e2cd]">MUM-COAST-01</span>
                      <span className="font-mono text-[9px] bg-[#44e2cd]/20 text-[#44e2cd] px-1 rounded font-bold">MARITIME</span>
                    </div>
                    <div className="font-mono text-[11px] text-white">
                      PM2.5: <span className="font-bold text-[#44e2cd]">34.0</span> µg/m³
                    </div>
                  </div>
                </div>

                {/* Station 3: Indore */}
                <div
                  className="absolute top-[52%] left-[45%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                  onClick={() => handleStationClick('indore')}
                >
                  <div className="relative flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-[#38bdf8]/20 animate-pulse absolute" />
                    <div className="w-4 h-4 rounded-full bg-[#0b0e13] flex items-center justify-center shadow-lg border border-[#38bdf8]">
                      <div className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                    </div>
                  </div>
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 bg-[#1d2025]/95 backdrop-blur-md px-2.5 py-1 rounded border border-[#38bdf8]/40 shadow-xl whitespace-nowrap group-hover:scale-105 transition-transform">
                    <span className="font-mono text-[11px] font-bold text-[#8ed5ff]">IND-PLATEAU-03</span>
                    <div className="font-mono text-[11px] text-white">
                      PM2.5: <span className="font-bold text-[#8ed5ff]">44.0</span> µg/m³
                    </div>
                  </div>
                </div>

                {/* Station 4: Bhopal */}
                <div
                  className="absolute top-[49%] left-[54%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                  onClick={() => handleStationClick('bhopal')}
                >
                  <div className="relative flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-[#0b0e13] flex items-center justify-center shadow-lg border border-[#62fae3]">
                      <div className="w-2 h-2 rounded-full bg-[#62fae3]" />
                    </div>
                  </div>
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 bg-[#1d2025]/95 backdrop-blur-md px-2.5 py-1 rounded border border-[#62fae3]/40 shadow-xl whitespace-nowrap group-hover:scale-105 transition-transform">
                    <span className="font-mono text-[11px] font-bold text-[#62fae3]">BHO-BASIN-02</span>
                    <div className="font-mono text-[11px] text-white">
                      PM2.5: <span className="font-bold text-[#62fae3]">29.0</span> µg/m³
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Canvas Reticle */}
            <div className="relative z-10 flex items-center justify-between text-[#bdc8d1] font-mono text-[11px]">
              <div className="flex items-center gap-2 bg-[#111319]/80 px-2 py-0.5 rounded border border-[#272a30]">
                <span className="text-[#87929a]">RETICLE:</span>
                <span>23°30'N, 77°12'E</span>
              </div>
              <div className="flex items-center gap-2 bg-[#111319]/80 px-2 py-0.5 rounded border border-[#272a30]">
                <span>SCALE 1:2,500,000</span>
              </div>
            </div>
          </div>

          {/* Satellite Overpass Synchronization Scrubber */}
          <div className="bg-[#191c21] p-4 rounded border border-[#272a30] shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#44e2cd] text-[16px]">schedule</span>
                <span className="font-sans text-[14px] font-semibold text-white">
                  Satellite Overpass Synchronization Scrubber
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <span className="text-[#87929a]">COPERNICUS PASS:</span>
                <span className="text-[#8ed5ff] font-bold">T+02:14:00 (NRT)</span>
              </div>
            </div>

            <div className="relative w-full py-1 flex flex-col gap-1">
              <input
                type="range"
                min="0"
                max="100"
                value={overpassProgress}
                onChange={(e) => setOverpassProgress(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-[#272a30] rounded-lg appearance-none cursor-pointer accent-[#38bdf8]"
              />
              <div className="flex justify-between font-mono text-[10px] text-[#87929a] mt-1">
                <span>06:00 UTC (TERRA)</span>
                <span>09:30 UTC (INSAT-3DR)</span>
                <span className="text-[#8ed5ff] font-bold">13:45 UTC (SENTINEL-5P)</span>
                <span>18:00 UTC (PROJ)</span>
                <span>22:00 UTC (NIGHT SOUNDING)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Focused Station Inspector Drawer (3 Columns) */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          <div className="bg-[#191c21] p-4 rounded border border-[#272a30] shadow-sm flex flex-col gap-4">
            {/* Inspector Header */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${currentStation.riskScore > 40 ? 'bg-[#ffb4ab]' : 'bg-[#44e2cd]'}`} />
                  <span className="font-mono text-[10px] font-semibold text-[#bdc8d1] uppercase tracking-wider">
                    STATION TELEMETRY POD
                  </span>
                </div>
                <span className="font-sans text-[18px] font-bold text-white mt-0.5">
                  {currentStation.code}
                </span>
                <span className="font-mono text-[11px] text-[#8ed5ff]">
                  {currentStation.lat.toFixed(4)}°N, {currentStation.lng.toFixed(4)}°E // ELEV {(currentStation.elevation * 100).toLocaleString()} cm ({currentStation.elevation}m)
                </span>
              </div>
              <div className={`px-2 py-1 rounded font-mono text-[11px] font-bold ${currentStation.riskScore > 40 ? 'bg-[#93000a]/20 text-[#ffb4ab] border border-[#ffb4ab]/40' : 'bg-[#44e2cd]/20 text-[#44e2cd] border border-[#44e2cd]/40'}`}>
                RISK {currentStation.riskScore}
              </div>
            </div>

            {/* Station Local Time Ribbon */}
            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#16202c] border border-[#38bdf8]/40">
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <span className="text-[13px]">{stationTime.isNight ? '🌙' : '☀️'}</span>
                <span className="text-[#8ed5ff] font-bold">LOCAL TIME:</span>
                <span className="text-white font-bold">{stationTime.time12}</span>
              </div>
              <span className="font-mono text-[10px] text-[#44e2cd] font-semibold">
                {stationTime.timezoneAbbr || stationTime.utcOffsetStr}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#1d2025] p-2.5 rounded border border-[#272a30]">
                <span className="font-mono text-[10px] text-[#87929a] uppercase block font-semibold">PM2.5 (CGS)</span>
                <div className="flex flex-col mt-0.5">
                  <span className="font-mono text-[15px] font-bold text-[#ffb4ab]">{(currentStation.pm25 * 1e-12).toExponential(2)}</span>
                  <span className="font-mono text-[10px] text-[#87929a]">g/cm³ ({currentStation.pm25} µg/m³)</span>
                </div>
                <span className="font-mono text-[9px] text-[#ffb4ab] block mt-1 font-semibold">WHO: 1.50×10⁻¹¹ g/cm³</span>
              </div>

              <div className="bg-[#1d2025] p-2.5 rounded border border-[#272a30]">
                <span className="font-mono text-[10px] text-[#87929a] uppercase block font-semibold">INVERSION CAP (CGS)</span>
                <div className="flex flex-col mt-0.5">
                  <span className="font-mono text-[15px] font-bold text-white">{(currentStation.pblHeight * 100).toLocaleString()}</span>
                  <span className="font-mono text-[10px] text-[#87929a]">cm ({currentStation.pblHeight} m)</span>
                </div>
                <span className={`font-mono text-[9px] block mt-1 font-semibold ${currentStation.pblHeight < 700 ? 'text-[#ffb4ab]' : 'text-[#44e2cd]'}`}>
                  {currentStation.pblHeight < 700 ? 'INVERSION TRAP' : 'OPEN LAYER'}
                </span>
              </div>

              <div className="bg-[#1d2025] p-2.5 rounded border border-[#272a30]">
                <span className="font-mono text-[10px] text-[#87929a] uppercase block font-semibold">HUMIDITY (RH)</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-mono text-[22px] font-bold text-white">{currentStation.humidity}</span>
                  <span className="font-mono text-[11px] text-[#87929a]">%</span>
                </div>
                <span className="font-mono text-[10px] text-[#87929a] block mt-0.5">Opt. Deliquescence</span>
              </div>

              <div className="bg-[#1d2025] p-2.5 rounded border border-[#272a30]">
                <span className="font-mono text-[10px] text-[#87929a] uppercase block font-semibold">DISPERSION COEFF (Kz)</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-mono text-[22px] font-bold text-[#44e2cd]">{currentStation.dispersionCoeff}</span>
                  <span className="font-mono text-[11px] text-[#87929a]">m²/s</span>
                </div>
                <span className="font-mono text-[10px] text-[#bdc8d1] block mt-0.5">
                  {currentStation.dispersionCoeff < 300 ? 'Suppressed Turb.' : 'Active Mixing'}
                </span>
              </div>
            </div>

            {/* Vertical Temperature Lapse Profile Sparkline */}
            <div className="bg-[#1d2025] p-3 rounded border border-[#272a30] flex flex-col gap-1.5">
              <div className="flex justify-between items-center font-mono">
                <span className="text-[10px] text-[#87929a] uppercase font-semibold">Vertical Temperature Profile</span>
                <span className="text-[10px] text-[#8ed5ff]">0-3000m RADIOMETER</span>
              </div>
              <div className="h-20 w-full flex items-center justify-center pt-1">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 160 50">
                  <path d="M 0,45 Q 30,40 50,30 T 70,12 T 90,22 T 120,38 T 160,42" fill="none" stroke="#8ed5ff" strokeWidth="2" />
                  <circle cx="70" cy="12" r="3.5" fill="#ffb4ab" />
                  <line x1="70" y1="0" x2="70" y2="48" stroke="#ffb4ab" strokeWidth="1" strokeDasharray="2,2" />
                  <text x="76" y="10" fill="#ffb4ab" className="font-mono text-[7px] font-bold">dT/dz &gt; 0 ({currentStation.pblHeight}m)</text>
                </svg>
              </div>
              <div className="flex justify-between font-mono text-[9px] text-[#87929a]">
                <span>SURFACE ({currentStation.elevation}m)</span>
                <span>STAGNATION CORE</span>
                <span>FREE TROP (3km)</span>
              </div>
            </div>

            {/* Localized Pod Sub-Assemblies */}
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[10px] text-[#87929a] uppercase tracking-wider font-semibold">
                Localized Pod Sub-Assemblies
              </span>
              <div className="bg-[#0b0e13] rounded border border-[#272a30] p-1.5 flex flex-col gap-1 font-mono text-[10px]">
                <div className="flex items-center justify-between py-1 px-2 rounded bg-[#1d2025]/50">
                  <span className="text-[#bdc8d1]">LASER SPECTROMETER OPC-N3</span>
                  <span className="text-[#44e2cd] font-bold">99.8% FIDELITY</span>
                </div>
                <div className="flex items-center justify-between py-1 px-2 rounded bg-[#1d2025]/50">
                  <span className="text-[#bdc8d1]">ULTRASONIC ANEMOMETER</span>
                  <span className="text-[#44e2cd] font-bold">CALIBRATED</span>
                </div>
                <div className="flex items-center justify-between py-1 px-2 rounded bg-[#1d2025]/50">
                  <span className="text-[#bdc8d1]">RADIOMETER T/RH SOUNDER</span>
                  <span className="text-[#8ed5ff] font-bold">ACTIVE PING</span>
                </div>
                <div className="flex items-center justify-between py-1 px-2 rounded bg-[#1d2025]/50">
                  <span className="text-[#bdc8d1]">NBIoT DUAL TELEMETRY LINK</span>
                  <span className="text-[#44e2cd] font-bold">-72 dBm (EXCELLENT)</span>
                </div>
              </div>
            </div>

            {/* Drilldown Button */}
            <button
              onClick={onOpenSounding}
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2 bg-[#38bdf8] hover:bg-[#8ed5ff] text-[#004965] font-sans text-[13px] font-bold rounded shadow-sm transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">query_stats</span>
              <span>Full Vertical Atmospheric Sounding</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
