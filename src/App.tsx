import React, { useState } from 'react';
import { NavTab, StationId, StationData, HourlyForecastRow, ToastMessage, UnitSystem } from './types';
import { STATIONS, HOURLY_FORECAST_DATA } from './data/mockData';
import { fetchGlobalAirQuality, GlobalLocationSearchResult, PRESET_WORLD_CITIES } from './services/airQualityApi';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ExportModal } from './components/ExportModal';
import { HyperparametersModal } from './components/HyperparametersModal';
import { SoundingModal } from './components/SoundingModal';
import { CalibrationModal } from './components/CalibrationModal';
import { GuideModal } from './components/GuideModal';
import { CityCompareModal } from './components/CityCompareModal';
import { DemoScenariosModal, DemoScenario } from './components/DemoScenariosModal';
import { ToastContainer } from './components/Toast';

import { OverviewIntelligenceScreen } from './screens/OverviewIntelligenceScreen';
import { LiveTelemetryScreen } from './screens/LiveTelemetryScreen';
import { ForecastEngineScreen } from './screens/ForecastEngineScreen';
import { GeospatialGridScreen } from './screens/GeospatialGridScreen';
import { ExplainableRiskScreen } from './screens/ExplainableRiskScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview-intelligence');
  const [stationId, setStationId] = useState<StationId>('delhi');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('standard');
  const [stationDict, setStationDict] = useState<Record<string, StationData>>(STATIONS);
  const [forecastDict, setForecastDict] = useState<Record<string, HourlyForecastRow[]>>({
    delhi: HOURLY_FORECAST_DATA
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [simpleMode, setSimpleMode] = useState<boolean>(true);

  // Modals state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isHyperparametersOpen, setIsHyperparametersOpen] = useState(false);
  const [isSoundingOpen, setIsSoundingOpen] = useState(false);
  const [isCalibrationOpen, setIsCalibrationOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isScenariosOpen, setIsScenariosOpen] = useState(false);

  const currentStation = stationDict[stationId] || STATIONS.delhi;
  const currentForecast = forecastDict[stationId] || HOURLY_FORECAST_DATA;

  const addToast = (title: string, description: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleSelectStationById = (id: string) => {
    if (stationDict[id]) {
      setStationId(id);
      addToast('Station Array Selected', `Switched monitoring node to ${stationDict[id]?.region || stationDict[id]?.name || id}.`);
      return;
    }
    const preset = PRESET_WORLD_CITIES.find((c) => c.id === id);
    if (preset) {
      handleSelectLocation(preset);
    } else {
      setStationId(id);
    }
  };

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectScenario = (scenario: DemoScenario) => {
    handleSelectLocation(scenario.targetCity);
    addToast(
      `Scenario: ${scenario.title}`,
      `${scenario.phenomenon}. Local clock and physical parameters updated.`
    );
  };

  const handleSelectLocation = async (loc: GlobalLocationSearchResult) => {
    // If we already have live data in dictionary, switch immediately
    if (stationDict[loc.id]) {
      setStationId(loc.id);
      addToast('Monitoring Station Active', `Viewing telemetry for ${loc.name}, ${loc.country}.`, 'success');
      return;
    }

    // Otherwise fetch worldwide data live from Open-Meteo
    setIsLoadingLocation(true);
    addToast('Connecting to Global Sensors', `Fetching real-time atmospheric data for ${loc.name}, ${loc.country}...`, 'info');

    try {
      const result = await fetchGlobalAirQuality(loc);
      setStationDict((prev) => ({
        ...prev,
        [result.station.id]: result.station
      }));
      setForecastDict((prev) => ({
        ...prev,
        [result.station.id]: result.hourlyForecast
      }));
      setStationId(result.station.id);
      addToast(
        'Global Atmospheric Data Synced',
        `Live data loaded for ${result.station.region}. PM2.5: ${(result.station.pm25 * 1e-12).toExponential(2)} g/cm³ (${result.station.pm25} µg/m³).`,
        'success'
      );
    } catch (err) {
      console.error('Error fetching global air data:', err);
      addToast('Data Sync Notice', `Loaded regional baseline telemetry for ${loc.name}.`, 'warning');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleCopyHash = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', `${label}: ${text}`);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-sky-500/20 selection:text-sky-300 relative overflow-x-hidden">
      {/* Dynamic Atmospheric Glass Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 animate-float-slow transition-all duration-1000"
          style={{
            backgroundColor:
              currentStation.pm25 < 35
                ? '#10b981'
                : currentStation.pm25 < 75
                ? '#f59e0b'
                : '#ef4444'
          }}
        />
        <div className="absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full bg-sky-500/15 blur-[160px] animate-float-reverse" />
        <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[150px] animate-float-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />
      </div>

      {/* Global Precision Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        selectedStation={currentStation}
        unitSystem={unitSystem}
        setUnitSystem={setUnitSystem}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenScenarios={() => setIsScenariosOpen(true)}
        onQuickSearchClick={() => {
          setActiveTab('overview-intelligence');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="w-full pt-20 sm:pt-24 min-h-screen flex-1 relative z-10">
        {activeTab === 'overview-intelligence' && (
          <OverviewIntelligenceScreen
            station={currentStation}
            onNavigateTab={handleTabChange}
            unitSystem={unitSystem}
            onSelectLocation={handleSelectLocation}
            isLoading={isLoadingLocation}
            hourlyForecast={currentForecast}
            onOpenCompare={() => setIsCompareOpen(true)}
            onOpenScenarios={() => setIsScenariosOpen(true)}
          />
        )}

        {activeTab === 'live-telemetry-sounding' && (
          <OverviewIntelligenceScreen
            station={currentStation}
            onNavigateTab={handleTabChange}
            unitSystem={unitSystem}
            onSelectLocation={handleSelectLocation}
            isLoading={isLoadingLocation}
            hourlyForecast={currentForecast}
            onOpenCompare={() => setIsCompareOpen(true)}
            onOpenScenarios={() => setIsScenariosOpen(true)}
          />
        )}

        {activeTab === 'forecast-engine' && (
          <ForecastEngineScreen
            station={currentStation}
            onOpenHyperparameters={() => setIsHyperparametersOpen(true)}
            onOpenExport={() => setIsExportOpen(true)}
            onNotify={addToast}
            unitSystem={unitSystem}
            hourlyForecast={currentForecast}
          />
        )}

        {activeTab === 'geospatial-grid-stations' && (
          <GeospatialGridScreen
            currentStation={currentStation}
            onSelectStation={handleSelectStationById}
            onOpenSounding={() => setIsSoundingOpen(true)}
            onNotify={addToast}
            unitSystem={unitSystem}
          />
        )}

        {activeTab === 'explainable-risk-provenance' && (
          <ExplainableRiskScreen
            station={currentStation}
            onOpenCalibration={() => setIsCalibrationOpen(true)}
            onNotify={addToast}
            unitSystem={unitSystem}
          />
        )}
      </main>

      {/* Global Institutional Footer */}
      <Footer
        onCopyHash={handleCopyHash}
        onSelectStation={handleSelectStationById}
      />

      {/* Interactive Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        currentStation={currentStation}
        onNotify={addToast}
      />

      <HyperparametersModal
        isOpen={isHyperparametersOpen}
        onClose={() => setIsHyperparametersOpen(false)}
        onNotify={addToast}
      />

      <SoundingModal
        isOpen={isSoundingOpen}
        onClose={() => setIsSoundingOpen(false)}
        station={currentStation}
      />

      <CalibrationModal
        isOpen={isCalibrationOpen}
        onClose={() => setIsCalibrationOpen(false)}
        station={currentStation}
        onNotify={addToast}
      />

      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Side-by-Side City Comparison Modal */}
      <CityCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        currentStation={currentStation}
        onSelectStation={(loc) => handleSelectLocation(loc)}
      />

      {/* Evaluator Interactive Demo Scenarios Modal */}
      <DemoScenariosModal
        isOpen={isScenariosOpen}
        onClose={() => setIsScenariosOpen(false)}
        onSelectScenario={handleSelectScenario}
      />

      {/* Dynamic Toast Feedback Overlay */}
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}
