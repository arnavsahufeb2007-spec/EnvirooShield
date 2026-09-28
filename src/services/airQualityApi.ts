import { StationData, HourlyForecastRow } from '../types';
import { getTimezoneForLocation, formatForecastTimeForTimezone, getStationTimeInfo } from '../utils/timezoneUtils';

export interface GlobalLocationSearchResult {
  id: string;
  name: string;
  admin1?: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  elevation: number;
  flag?: string;
  timezone?: string;
}

// Convert 2-letter ISO country code to unicode flag emoji
export function getFlagEmoji(countryCode?: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Built-in presets for fast 1-click global switching with accurate native timezones
export const PRESET_WORLD_CITIES: GlobalLocationSearchResult[] = [
  { id: 'delhi', name: 'New Delhi', country: 'India', countryCode: 'IN', lat: 28.6139, lng: 77.2090, elevation: 216, flag: '🇮🇳', timezone: 'Asia/Kolkata' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', countryCode: 'JP', lat: 35.6762, lng: 139.6503, elevation: 40, flag: '🇯🇵', timezone: 'Asia/Tokyo' },
  { id: 'new-york', name: 'New York', admin1: 'NY', country: 'United States', countryCode: 'US', lat: 40.7128, lng: -74.0060, elevation: 10, flag: '🇺🇸', timezone: 'America/New_York' },
  { id: 'london', name: 'London', country: 'United Kingdom', countryCode: 'GB', lat: 51.5074, lng: -0.1278, elevation: 25, flag: '🇬🇧', timezone: 'Europe/London' },
  { id: 'paris', name: 'Paris', country: 'France', countryCode: 'FR', lat: 48.8566, lng: 2.3522, elevation: 35, flag: '🇫🇷', timezone: 'Europe/Paris' },
  { id: 'beijing', name: 'Beijing', country: 'China', countryCode: 'CN', lat: 39.9042, lng: 116.4074, elevation: 44, flag: '🇨🇳', timezone: 'Asia/Shanghai' },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', countryCode: 'EG', lat: 30.0444, lng: 31.2357, elevation: 23, flag: '🇪🇬', timezone: 'Africa/Cairo' },
  { id: 'sao-paulo', name: 'São Paulo', country: 'Brazil', countryCode: 'BR', lat: -23.5505, lng: -46.6333, elevation: 760, flag: '🇧🇷', timezone: 'America/Sao_Paulo' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', countryCode: 'AU', lat: -33.8688, lng: 151.2093, elevation: 19, flag: '🇦🇺', timezone: 'Australia/Sydney' },
  { id: 'mumbai', name: 'Mumbai', country: 'India', countryCode: 'IN', lat: 19.0760, lng: 72.8777, elevation: 14, flag: '🇮🇳', timezone: 'Asia/Kolkata' },
  { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', lat: 25.2048, lng: 55.2708, elevation: 5, flag: '🇦🇪', timezone: 'Asia/Dubai' },
  { id: 'los-angeles', name: 'Los Angeles', admin1: 'CA', country: 'United States', countryCode: 'US', lat: 34.0522, lng: -118.2437, elevation: 87, flag: '🇺🇸', timezone: 'America/Los_Angeles' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', countryCode: 'SG', lat: 1.3521, lng: 103.8198, elevation: 15, flag: '🇸🇬', timezone: 'Asia/Singapore' },
  { id: 'berlin', name: 'Berlin', country: 'Germany', countryCode: 'DE', lat: 52.5200, lng: 13.4050, elevation: 34, flag: '🇩🇪', timezone: 'Europe/Berlin' },
  { id: 'indore', name: 'Indore', country: 'India', countryCode: 'IN', lat: 22.7196, lng: 75.8577, elevation: 553, flag: '🇮🇳', timezone: 'Asia/Kolkata' },
  { id: 'bhopal', name: 'Bhopal', country: 'India', countryCode: 'IN', lat: 23.2599, lng: 77.4126, elevation: 527, flag: '🇮🇳', timezone: 'Asia/Kolkata' }
];

/**
 * Searches global cities using Open-Meteo Geocoding API with fast fallback.
 */
export async function searchGlobalLocations(query: string): Promise<GlobalLocationSearchResult[]> {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  // Local preset matches first
  const localMatches = PRESET_WORLD_CITIES.filter((city) =>
    city.name.toLowerCase().includes(cleanQuery) ||
    city.country.toLowerCase().includes(cleanQuery) ||
    (city.admin1 && city.admin1.toLowerCase().includes(cleanQuery))
  );

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery)}&count=8&language=en&format=json`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.results)) {
        const remoteResults: GlobalLocationSearchResult[] = data.results.map((item: any) => {
          const tz = item.timezone || getTimezoneForLocation(item.latitude, item.longitude, item.country_code, item.country, item.name).timezone;
          return {
            id: `${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${item.country_code?.toLowerCase() || 'loc'}`,
            name: item.name,
            admin1: item.admin1,
            country: item.country || '',
            countryCode: item.country_code || '',
            lat: item.latitude,
            lng: item.longitude,
            elevation: Math.round(item.elevation || 50),
            flag: getFlagEmoji(item.country_code),
            timezone: tz
          };
        });

        // Merge without duplicates
        const combined = [...localMatches];
        for (const item of remoteResults) {
          if (!combined.some((c) => Math.abs(c.lat - item.lat) < 0.1 && Math.abs(c.lng - item.lng) < 0.1)) {
            combined.push(item);
          }
        }
        return combined.slice(0, 10);
      }
    }
  } catch (err) {
    console.warn('Geocoding API network issue, returning local index:', err);
  }

  return localMatches;
}

/**
 * Fetches real worldwide air quality & meteorological conditions for any coordinates.
 */
export async function fetchGlobalAirQuality(loc: {
  id?: string;
  name: string;
  country?: string;
  countryCode?: string;
  lat: number;
  lng: number;
  elevation?: number;
}): Promise<{ station: StationData; hourlyForecast: HourlyForecastRow[] }> {
  let pm25 = 28.5;
  let pm10 = 48.0;
  let no2 = 24.0;
  let o3 = 32.0;
  let co = 0.8;
  let so2 = 7.0;
  let aod = 0.35;
  let temp = 22.0;
  let humidity = 55.0;
  let pressure = 1012.0;
  let windSpeedMS = 3.2;
  let windDegrees = 270;
  let pblHeight = 850;
  let resolvedTimezone = (loc as any).timezone || '';
  let resolvedTimezoneAbbr = '';
  let resolvedUtcOffsetSeconds: number | undefined = undefined;

  let hourlyForecast: HourlyForecastRow[] = [];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${loc.lat}&longitude=${loc.lng}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,aerosol_optical_depth&hourly=pm2_5,pm10,nitrogen_dioxide,ozone&timezone=auto`;
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lng}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,boundary_layer_height&timezone=auto`;

    const [aqRes, weatherRes] = await Promise.allSettled([
      fetch(aqUrl, { signal: controller.signal }),
      fetch(weatherUrl, { signal: controller.signal })
    ]);
    clearTimeout(timeoutId);

    if (weatherRes.status === 'fulfilled' && weatherRes.value.ok) {
      const wData = await weatherRes.value.json();
      if (wData.timezone) resolvedTimezone = wData.timezone;
      if (wData.timezone_abbreviation) resolvedTimezoneAbbr = wData.timezone_abbreviation;
      if (wData.utc_offset_seconds !== undefined) resolvedUtcOffsetSeconds = wData.utc_offset_seconds;

      if (wData.current) {
        if (wData.current.temperature_2m !== undefined) temp = Number(wData.current.temperature_2m.toFixed(1));
        if (wData.current.relative_humidity_2m !== undefined) humidity = Math.round(wData.current.relative_humidity_2m);
        if (wData.current.surface_pressure !== undefined) pressure = Number(wData.current.surface_pressure.toFixed(1));
        if (wData.current.wind_speed_10m !== undefined) windSpeedMS = Number(wData.current.wind_speed_10m.toFixed(1));
        if (wData.current.wind_direction_10m !== undefined) windDegrees = Math.round(wData.current.wind_direction_10m);
      }
      if (wData.hourly && Array.isArray(wData.hourly.boundary_layer_height) && wData.hourly.boundary_layer_height[0]) {
        pblHeight = Math.round(wData.hourly.boundary_layer_height[0]);
      }
    }

    if (aqRes.status === 'fulfilled' && aqRes.value.ok) {
      const aqData = await aqRes.value.json();
      if (!resolvedTimezone && aqData.timezone) resolvedTimezone = aqData.timezone;
      if (!resolvedTimezoneAbbr && aqData.timezone_abbreviation) resolvedTimezoneAbbr = aqData.timezone_abbreviation;
      if (resolvedUtcOffsetSeconds === undefined && aqData.utc_offset_seconds !== undefined) resolvedUtcOffsetSeconds = aqData.utc_offset_seconds;

      if (aqData.current) {
        if (aqData.current.pm2_5 !== undefined && aqData.current.pm2_5 !== null) pm25 = Number(aqData.current.pm2_5.toFixed(1));
        if (aqData.current.pm10 !== undefined && aqData.current.pm10 !== null) pm10 = Number(aqData.current.pm10.toFixed(1));
        if (aqData.current.nitrogen_dioxide !== undefined && aqData.current.nitrogen_dioxide !== null) no2 = Number(aqData.current.nitrogen_dioxide.toFixed(1));
        if (aqData.current.ozone !== undefined && aqData.current.ozone !== null) o3 = Number(aqData.current.ozone.toFixed(1));
        if (aqData.current.carbon_monoxide !== undefined && aqData.current.carbon_monoxide !== null) co = Number((aqData.current.carbon_monoxide / 1000).toFixed(1));
        if (aqData.current.sulphur_dioxide !== undefined && aqData.current.sulphur_dioxide !== null) so2 = Number(aqData.current.sulphur_dioxide.toFixed(1));
        if (aqData.current.aerosol_optical_depth !== undefined && aqData.current.aerosol_optical_depth !== null) aod = Number(aqData.current.aerosol_optical_depth.toFixed(2));
      }

      // Fallback timezone resolution if neither returned one
      if (!resolvedTimezone) {
        const tzInfo = getTimezoneForLocation(loc.lat, loc.lng, loc.countryCode, loc.country, loc.name);
        resolvedTimezone = tzInfo.timezone;
        if (!resolvedTimezoneAbbr) resolvedTimezoneAbbr = tzInfo.abbr;
      }

      // Build hourly forecast if available
      if (aqData.hourly && Array.isArray(aqData.hourly.time)) {
        const times: string[] = aqData.hourly.time;
        const pm25Arr: number[] = aqData.hourly.pm2_5 || [];
        const stepHours = [0, 4, 8, 12, 16, 20, 24, 30, 36, 42, 48];

        hourlyForecast = stepHours.map((h) => {
          const rawPM = (pm25Arr[h] !== undefined && pm25Arr[h] !== null) ? Number(pm25Arr[h].toFixed(1)) : pm25;
          const timeLabel = times[h] ? times[h].replace('T', ' ') : `+${h}h`;
          const score = Math.min(99, Math.max(12, Math.round(rawPM * 0.45 + (100 - (pblHeight / 15)) * 0.2)));
          let cat: 'NOMINAL' | 'MOD' | 'ELEV' | 'HIGH' | 'CRITICAL' = 'MOD';
          if (score < 25) cat = 'NOMINAL';
          else if (score < 45) cat = 'MOD';
          else if (score < 60) cat = 'ELEV';
          else if (score < 80) cat = 'HIGH';
          else cat = 'CRITICAL';

          const localTimeInfo = formatForecastTimeForTimezone(h, resolvedTimezone);

          return {
            horizon: h === 0 ? 'T+0 [NOW]' : h === 24 ? 'T+24h [PEAK EVENT]' : h === 48 ? 'T+48h [FRONT ARRIVAL]' : `T+${h}h`,
            timestamp: timeLabel,
            localTimestamp: localTimeInfo.fullLabel,
            localTimeFormatted: localTimeInfo.localTimeStr,
            pm25: rawPM,
            ciLower: Number((rawPM * 0.88).toFixed(1)),
            ciUpper: Number((rawPM * 1.12).toFixed(1)),
            temp: Number((temp + (h % 24 > 6 && h % 24 < 18 ? 4 : -3)).toFixed(1)),
            humidity: Math.round(Math.max(30, Math.min(95, humidity + (h % 24 < 8 ? 10 : -8)))),
            windVector: `${windDegrees > 180 ? 'NW' : 'NE'} ${(windSpeedMS + (h === 48 ? 2.5 : 0)).toFixed(1)} m/s`,
            windAngle: windDegrees,
            pblHeight: Math.round(h === 24 ? Math.max(300, pblHeight * 0.5) : h === 48 ? pblHeight * 1.6 : pblHeight),
            riskScore: score,
            riskCategory: cat,
            isHighlight: h === 0 || h === 12 || h === 36,
            isCritical: h === 24,
            isFrontArrival: h === 48
          };
        });
      }
    }
  } catch (e) {
    console.warn('Live API request failed or timed out. Employing meteorological fallback modeling:', e);
  }

  // Ensure timezone is always resolved
  if (!resolvedTimezone) {
    const tzInfo = getTimezoneForLocation(loc.lat, loc.lng, loc.countryCode, loc.country, loc.name);
    resolvedTimezone = tzInfo.timezone;
    if (!resolvedTimezoneAbbr) resolvedTimezoneAbbr = tzInfo.abbr;
  }

  // Calculate composite Multi-Attribute Physical Risk Index (MAPRI: 0-100)
  const pmFactor = Math.min(50, (pm25 / 150) * 50);
  const stagnationFactor = Math.max(0, 25 - (windSpeedMS / 8) * 25);
  const inversionFactor = Math.max(0, 25 - (pblHeight / 2000) * 25);
  const rawRisk = pmFactor + stagnationFactor + inversionFactor;
  const riskScore = Number(Math.max(10, Math.min(98.5, rawRisk)).toFixed(1));

  let riskLabel = 'MODERATE RISK';
  let riskClass: 'low' | 'moderate' | 'elevated' | 'high' | 'critical' = 'moderate';

  if (riskScore < 25) {
    riskLabel = 'LOW / NOMINAL';
    riskClass = 'low';
  } else if (riskScore < 50) {
    riskLabel = 'MODERATE RISK';
    riskClass = 'moderate';
  } else if (riskScore < 70) {
    riskLabel = 'ELEVATED / CAUTION';
    riskClass = 'elevated';
  } else if (riskScore < 85) {
    riskLabel = 'HIGH RISK';
    riskClass = 'high';
  } else {
    riskLabel = 'CRITICAL SMOG';
    riskClass = 'critical';
  }

  const pblStatus = pblHeight < 450
    ? 'INVERSION TRAP [GROUND CAPPED]'
    : pblHeight < 900
    ? 'MODERATE [SEMISTABLE LAYER]'
    : 'VENTED [OPEN BOUNDARY LAYER]';

  const windCompass = getCompassDirection(windDegrees);
  const stationId = (loc.id || loc.name.toLowerCase().replace(/[^a-z0-9]/g, '-')) as any;
  const stationCode = `STN-${loc.countryCode ? loc.countryCode.toUpperCase() : 'GLB'}-${Math.abs(Math.round(loc.lat))}`;

  const stationData: StationData = {
    id: stationId,
    code: stationCode,
    name: `${stationCode} [${loc.name.toUpperCase()}]`,
    region: `${loc.name}, ${loc.country || 'Global Node'}`,
    country: loc.country,
    flag: loc.countryCode ? getFlagEmoji(loc.countryCode) : '🌍',
    timezone: resolvedTimezone,
    timezoneAbbr: resolvedTimezoneAbbr,
    utcOffsetSeconds: resolvedUtcOffsetSeconds,
    lat: loc.lat,
    lng: loc.lng,
    elevation: loc.elevation || 50,
    riskScore,
    riskLabel,
    riskClass,
    pm25,
    pm10,
    no2,
    o3,
    co,
    so2,
    dryTemp: temp,
    wetTemp: Number((temp - ((100 - humidity) / 5)).toFixed(1)),
    humidity,
    pressure,
    windSpeedKmH: Number((windSpeedMS * 3.6).toFixed(1)),
    windSpeedMS,
    windDirection: `${windCompass} (${windDegrees}°)`,
    windDegrees,
    ventilationIndex: Math.round(windSpeedMS * pblHeight),
    pblHeight,
    pblStatus,
    dispersionCoeff: Math.round((windSpeedMS * pblHeight) / 10),
    opticalDepthAOD: aod,
    uptime: '99.98% CONTINUOUS',
    hardwareFw: 'FW-884-GLOBAL'
  };

  // If hourly forecast was not populated from API, generate synthetic forecast from base values
  if (hourlyForecast.length === 0) {
    hourlyForecast = generateSyntheticForecast(stationData);
  }

  return { station: stationData, hourlyForecast };
}

function getCompassDirection(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const idx = Math.round((deg % 360) / 22.5) % 16;
  return directions[idx];
}

function generateSyntheticForecast(stn: StationData): HourlyForecastRow[] {
  const steps = [
    { h: 'T+0 [NOW]', hrs: 0, mult: 1.0, windMult: 1.0, isH: true },
    { h: 'T+4h', hrs: 4, mult: 0.98, windMult: 0.9 },
    { h: 'T+8h', hrs: 8, mult: 0.95, windMult: 0.75 },
    { h: 'T+12h', hrs: 12, mult: 0.94, windMult: 0.65, isH: true },
    { h: 'T+16h', hrs: 16, mult: 1.02, windMult: 0.5 },
    { h: 'T+20h', hrs: 20, mult: 1.08, windMult: 0.4 },
    { h: 'T+24h [PEAK EVENT]', hrs: 24, mult: 1.15, windMult: 0.3, isCrit: true },
    { h: 'T+30h', hrs: 30, mult: 1.04, windMult: 0.7 },
    { h: 'T+36h', hrs: 36, mult: 0.88, windMult: 1.2, isH: true },
    { h: 'T+42h', hrs: 42, mult: 0.76, windMult: 1.8 },
    { h: 'T+48h [FRONT ARRIVAL]', hrs: 48, mult: 0.65, windMult: 2.4, isFront: true }
  ];

  return steps.map((s) => {
    const rawPM = Number((stn.pm25 * s.mult).toFixed(1));
    const pbl = Math.round(s.isCrit ? Math.max(300, stn.pblHeight * 0.5) : s.isFront ? stn.pblHeight * 1.5 : stn.pblHeight);
    const score = Number(Math.min(99, Math.max(10, stn.riskScore * s.mult)).toFixed(1));
    let cat: 'NOMINAL' | 'MOD' | 'ELEV' | 'HIGH' | 'CRITICAL' = 'MOD';
    if (score < 25) cat = 'NOMINAL';
    else if (score < 45) cat = 'MOD';
    else if (score < 60) cat = 'ELEV';
    else if (score < 80) cat = 'HIGH';
    else cat = 'CRITICAL';

    const localTimeInfo = formatForecastTimeForTimezone(s.hrs, stn.timezone);

    return {
      horizon: s.h,
      timestamp: `2026-09-28 +${s.hrs}h`,
      localTimestamp: localTimeInfo.fullLabel,
      localTimeFormatted: localTimeInfo.localTimeStr,
      pm25: rawPM,
      ciLower: Number((rawPM * 0.88).toFixed(1)),
      ciUpper: Number((rawPM * 1.12).toFixed(1)),
      temp: Number((stn.dryTemp + (s.hrs % 24 > 6 && s.hrs % 24 < 18 ? 3 : -2)).toFixed(1)),
      humidity: Math.round(Math.max(30, Math.min(95, stn.humidity + (s.hrs < 12 ? 8 : -5)))),
      windVector: `${stn.windDirection.split(' ')[0]} ${(stn.windSpeedMS * s.windMult).toFixed(1)} m/s`,
      windAngle: stn.windDegrees,
      pblHeight: pbl,
      riskScore: score,
      riskCategory: cat,
      isHighlight: s.isH,
      isCritical: s.isCrit,
      isFrontArrival: s.isFront
    };
  });
}
