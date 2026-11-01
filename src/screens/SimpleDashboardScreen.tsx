import React from 'react';
import { ArrowRight, ArrowUpRight, CloudSun, Compass, Gauge, HeartPulse, MapPin, Wind } from 'lucide-react';
import { NavTab, StationData, HourlyForecastRow } from '../types';
import { GlobalSearchBar } from '../components/GlobalSearchBar';
import { GlobalLocationSearchResult } from '../services/airQualityApi';
import { calculateAQI, getAQICategory } from '../utils/aqiUtils';

interface Props {
  station: StationData;
  forecast: HourlyForecastRow[];
  onNavigate: (tab: NavTab) => void;
  onSelectLocation: (location: GlobalLocationSearchResult) => void;
  onCompare: () => void;
  isLoading: boolean;
}

const qualityMessage = (aqi: number) => {
  if (aqi <= 50) return { heading: 'A good day to be outside', detail: 'Air quality is generally satisfactory. Enjoy outdoor activities.', tone: 'text-emerald-700', bg: 'bg-emerald-50' };
  if (aqi <= 100) return { heading: 'Enjoy outdoors with awareness', detail: 'People unusually sensitive to air pollution may consider reducing prolonged outdoor exertion.', tone: 'text-amber-800', bg: 'bg-amber-50' };
  if (aqi <= 150) return { heading: 'Take extra care outdoors', detail: 'Sensitive groups should consider limiting prolonged or heavy outdoor exertion.', tone: 'text-orange-800', bg: 'bg-orange-50' };
  if (aqi <= 200) return { heading: 'Consider indoor activities', detail: 'Everyone may experience effects; sensitive groups should avoid prolonged outdoor exertion.', tone: 'text-red-800', bg: 'bg-red-50' };
  return { heading: 'Reduce outdoor exposure', detail: 'Consider limiting outdoor exertion and follow official local air-quality advisories.', tone: 'text-purple-800', bg: 'bg-purple-50' };
};

export const SimpleDashboardScreen: React.FC<Props> = ({ station, forecast, onNavigate, onSelectLocation, onCompare, isLoading }) => {
  const aqi = calculateAQI(station.pm25);
  const category = getAQICategory(aqi);
  const guidance = qualityMessage(aqi);
  const values = forecast.slice(0, 12);
  const maxPm = Math.max(1, ...values.map(row => row.pm25));
  const metricCards = [
    { label: 'PM2.5', value: station.pm25.toFixed(1), unit: 'µg/m³', icon: Wind, hint: 'Fine particles' },
    { label: 'PM10', value: station.pm10.toFixed(1), unit: 'µg/m³', icon: Compass, hint: 'Coarse particles' },
    { label: 'Temperature', value: station.dryTemp.toFixed(1), unit: '°C', icon: CloudSun, hint: 'Ambient air' },
    { label: 'Humidity', value: station.humidity.toFixed(0), unit: '%', icon: Gauge, hint: 'Relative humidity' }
  ];

  return (
    <div className="min-h-screen bg-[#f6f8f5] text-[#18342b]">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#e7f0e8] px-3 py-1 text-xs font-semibold text-[#3b7053]">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Environmental overview
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#17372b] sm:text-4xl">Your air, made simple.</h1>
            <p className="mt-2 max-w-xl text-sm text-[#64786d]">Understand your environment at a glance, without the scientific clutter.</p>
          </div>
          <button onClick={onCompare} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d8e3da] bg-white px-4 py-3 text-sm font-semibold text-[#244b38] shadow-sm transition hover:bg-[#edf5ee]">
            Compare cities <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="mb-6 rounded-2xl border border-[#e0e8df] bg-white p-4 shadow-sm sm:p-5">
          <GlobalSearchBar onSelectLocation={onSelectLocation} selectedCityName={station.name} isLoading={isLoading} />
          <div className="mt-3 flex items-center gap-2 text-sm text-[#687c70]">
            <MapPin size={15} /> <span>{station.region}</span>
            <span className="ml-auto rounded-full bg-[#edf5ee] px-2.5 py-1 text-xs font-medium text-[#3e7653]">{isLoading ? 'Updating…' : 'Selected location'}</span>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          <section className="relative overflow-hidden rounded-3xl bg-[#1c4939] p-6 text-white shadow-[0_18px_40px_rgba(24,67,47,0.12)] sm:p-8">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#8bc3a3]/20" aria-hidden="true" />
            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-[#d0e5d7]">Current air quality</span>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">{category.label}</span>
              </div>
              <div className="mt-9 flex items-end gap-4">
                <span className="text-[clamp(5rem,12vw,8rem)] font-bold leading-none tracking-tighter">{aqi}</span>
                <div className="pb-3"><div className="text-sm font-semibold">US AQI</div><div className="mt-1 text-xs text-[#c5ddce]">Based on PM2.5</div></div>
              </div>
              <div className="mt-8 flex h-3 overflow-hidden rounded-full" aria-label="AQI scale from good to hazardous">
                <span className="w-[16.67%] bg-[#58b98b]" /><span className="w-[16.67%] bg-[#e9c65a]" /><span className="w-[16.67%] bg-[#ed9b55]" /><span className="w-[16.67%] bg-[#dc7475]" /><span className="w-[16.67%] bg-[#9d80c7]" /><span className="w-[16.67%] bg-[#9b4b66]" />
              </div>
              <div className="mt-3 flex justify-between text-xs text-[#d0e5d7]"><span>Good</span><span>Hazardous</span></div>
              <p className="mt-7 text-xs text-[#bdd7c6]">Indicative AQI from available station data. Not an official alert.</p>
            </div>
          </section>

          <section className={`flex flex-col justify-between rounded-3xl border border-[#e0e8df] p-6 shadow-sm sm:p-8 ${guidance.bg}`}>
            <div>
              <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 ${guidance.tone}`}><HeartPulse size={24} /></div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#66776b]">What this means for you</p>
              <h2 className={`mt-3 text-2xl font-bold leading-tight ${guidance.tone}`}>{guidance.heading}</h2>
              <p className="mt-4 text-sm leading-7 text-[#586c60]">{guidance.detail}</p>
            </div>
            <button onClick={() => onNavigate('explainable-risk-provenance')} className="mt-8 inline-flex items-center gap-2 self-start text-sm font-semibold text-[#244b38] hover:underline">
              Understand the risk <ArrowRight size={16} />
            </button>
          </section>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metricCards.map(({ label, value, unit, icon: Icon, hint }) => (
            <div key={label} className="rounded-2xl border border-[#e0e8df] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-[#6d8175]"><span className="text-sm font-medium">{label}</span><Icon size={19} /></div>
              <div className="mt-5 text-3xl font-bold tracking-tight text-[#1d4232]">{value} <span className="text-sm font-medium text-[#7b8b80]">{unit}</span></div>
              <p className="mt-2 text-xs text-[#84948a]">{hint}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-3xl border border-[#e0e8df] bg-white p-6 shadow-sm sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h2 className="text-lg font-bold">Air quality outlook</h2><p className="mt-1 text-sm text-[#7a8b80]">PM2.5 forecast · next available hours</p></div>
              <button onClick={() => onNavigate('forecast-engine')} className="inline-flex items-center gap-1 text-sm font-semibold text-[#347351] hover:underline">Full forecast <ArrowRight size={16} /></button>
            </div>
            {values.length ? (
              <div className="mt-7 flex h-40 items-end gap-2" role="img" aria-label="PM2.5 forecast bar chart">
                {values.map((row, index) => (
                  <div key={index} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2" title={`${row.horizon}: ${row.pm25.toFixed(1)} µg/m³`}>
                    <div className="w-full max-w-10 rounded-t-md bg-[#88b99a] transition-colors group-hover:bg-[#347351]" style={{ height: `${Math.max(6, row.pm25 / maxPm * 100)}%` }} />
                    <span className="max-w-full truncate text-[10px] text-[#819287]">{row.horizon}</span>
                  </div>
                ))}
              </div>
            ) : <p className="mt-7 text-sm text-[#819287]">Forecast data is currently unavailable.</p>}
          </section>
          <section className="rounded-3xl border border-[#e0e8df] bg-white p-6 shadow-sm sm:p-7">
            <h2 className="text-lg font-bold">Explore more</h2><p className="mt-1 text-sm text-[#7a8b80]">Advanced tools, only when you need them.</p>
            <div className="mt-5 space-y-3">
              {([
                ['forecast-engine', '48-hour forecast', 'Explore changes over time'],
                ['geospatial-grid-stations', 'World map', 'Explore monitoring locations'],
                ['explainable-risk-provenance', 'Science & transparency', 'See how risk is explained']
              ] as const).map(([tab, title, subtitle]) => (
                <button key={tab} onClick={() => onNavigate(tab)} className="flex w-full items-center justify-between rounded-xl border border-[#e7ede7] p-4 text-left transition hover:bg-[#f4f8f4]">
                  <span><span className="block text-sm font-semibold text-[#284b38]">{title}</span><span className="mt-1 block text-xs text-[#829187]">{subtitle}</span></span><ArrowRight size={17} className="text-[#64846e]" />
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
