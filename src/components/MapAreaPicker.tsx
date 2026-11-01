import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Selection = { lat: number; lng: number };
interface Props {
  lat: number;
  lng: number;
  onConfirm: (point: Selection) => void;
  isLoading?: boolean;
}

export const MapAreaPicker: React.FC<Props> = ({ lat, lng, onConfirm, isLoading = false }) => {
  const host = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.CircleMarker | null>(null);
  const [point, setPoint] = useState<Selection | null>(null);

  useEffect(() => {
    if (!host.current || map.current) return;
    const instance = L.map(host.current, { zoomControl: true }).setView([lat, lng], 11);
    map.current = instance;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(instance);
    instance.on('click', (event: L.LeafletMouseEvent) => {
      setPoint({ lat: Number(event.latlng.lat.toFixed(5)), lng: Number(event.latlng.lng.toFixed(5)) });
    });
    const resize = window.setTimeout(() => instance.invalidateSize(), 100);
    return () => {
      window.clearTimeout(resize);
      instance.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;
    map.current.setView([lat, lng], Math.max(map.current.getZoom(), 9));
    setPoint(null);
  }, [lat, lng]);

  useEffect(() => {
    if (!map.current) return;
    if (marker.current) {
      marker.current.remove();
      marker.current = null;
    }
    if (point) {
      marker.current = L.circleMarker([point.lat, point.lng], {
        radius: 10, color: '#ffffff', weight: 3, fillColor: '#166534', fillOpacity: 1
      }).addTo(map.current);
    }
  }, [point]);

  return (
    <div>
      <div ref={host} className="h-[380px] w-full rounded-2xl sm:h-[490px]" aria-label="Interactive map. Click a location to select coordinates." />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
        <div>
          <p className="text-sm font-semibold text-white">{point ? 'Selected point' : 'Click anywhere on the map'}</p>
          <p className="mt-1 text-xs text-slate-300">
            {point ? `${point.lat.toFixed(5)}°, ${point.lng.toFixed(5)}°` : 'Choose a neighborhood or area, then load its environmental data.'}
          </p>
        </div>
        <button
          type="button"
          disabled={!point || isLoading}
          onClick={() => point && onConfirm(point)}
          className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'Loading data…' : 'Get data for this area'}
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-400">Map tiles © OpenStreetMap. The selected coordinates are used to request Open-Meteo environmental data; results describe the nearby model grid, not an exact street sensor.</p>
    </div>
  );
};
