export type NavTab = 
  | 'overview-intelligence'
  | 'live-telemetry-sounding'
  | 'forecast-engine'
  | 'geospatial-grid-stations'
  | 'explainable-risk-provenance';

export type StationId = string;

export interface StationData {
  id: StationId;
  code: string;
  name: string;
  region: string;
  country?: string;
  flag?: string;
  timezone?: string;
  timezoneAbbr?: string;
  utcOffsetSeconds?: number;
  lat: number;
  lng: number;
  elevation: number;
  riskScore: number;
  riskLabel: string;
  riskClass: 'low' | 'moderate' | 'elevated' | 'high' | 'critical';
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
  so2: number;
  dryTemp: number;
  wetTemp: number;
  humidity: number;
  pressure: number;
  windSpeedKmH: number;
  windSpeedMS: number;
  windDirection: string;
  windDegrees: number;
  ventilationIndex: number;
  pblHeight: number;
  pblStatus: string;
  dispersionCoeff: number;
  opticalDepthAOD: number;
  uptime: string;
  hardwareFw: string;
}

export interface HourlyForecastRow {
  horizon: string;
  timestamp: string;
  localTimestamp?: string;
  localTimeFormatted?: string;
  pm25: number;
  ciLower: number;
  ciUpper: number;
  temp: number;
  humidity: number;
  windVector: string;
  windAngle: number;
  pblHeight: number;
  pblNote?: string;
  riskScore: number;
  riskCategory: 'MOD' | 'ELEV' | 'HIGH' | 'CRITICAL' | 'NOMINAL';
  isHighlight?: boolean;
  isCritical?: boolean;
  isFrontArrival?: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type?: 'success' | 'info' | 'warning';
}
