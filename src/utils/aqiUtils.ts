import { UnitSystem } from '../types';

export interface AQICategory {
  label: string;
  level: 'good' | 'moderate' | 'sensitive' | 'unhealthy' | 'very-unhealthy' | 'hazardous';
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  gradient: string;
  advice: string;
  healthImplications: string;
}

/**
 * Calculates standard EPA Air Quality Index (AQI) from PM2.5 (µg/m³)
 */
export function calculateAQI(pm25: number): number {
  if (isNaN(pm25) || pm25 <= 0) return 0;

  const breakpoints = [
    { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },
    { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
    { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
    { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
    { cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400 },
    { cLow: 350.5, cHigh: 500.4, iLow: 401, iHigh: 500 }
  ];

  for (const bp of breakpoints) {
    if (pm25 >= bp.cLow && pm25 <= bp.cHigh) {
      return Math.round(
        ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (pm25 - bp.cLow) + bp.iLow
      );
    }
  }

  // Beyond 500
  return Math.min(500, Math.round(pm25 * 1.05));
}

/**
 * Returns category styling and actionable health advice for a given AQI score
 */
export function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) {
    return {
      label: 'Good',
      level: 'good',
      color: '#10b981',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      gradient: 'from-emerald-500 to-teal-600',
      advice: 'Air quality is pristine. Ideal conditions for outdoor cardio, sports, and airing out living spaces.',
      healthImplications: 'Air pollution poses little or no health risk to any group.'
    };
  }
  if (aqi <= 100) {
    return {
      label: 'Moderate',
      level: 'moderate',
      color: '#f59e0b',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
      gradient: 'from-amber-500 to-yellow-600',
      advice: 'Acceptable air quality. Unusually sensitive individuals may experience mild respiratory symptoms.',
      healthImplications: 'Safe for general public; sensitive groups should consider pacing outdoor exertion.'
    };
  }
  if (aqi <= 150) {
    return {
      label: 'Unhealthy for Sensitive Groups',
      level: 'sensitive',
      color: '#f97316',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      gradient: 'from-orange-500 to-amber-600',
      advice: 'Children, older adults, and individuals with asthma should reduce prolonged outdoor exertion.',
      healthImplications: 'Vulnerable populations may experience respiratory irritation.'
    };
  }
  if (aqi <= 200) {
    return {
      label: 'Unhealthy',
      level: 'unhealthy',
      color: '#ef4444',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      textColor: 'text-rose-400',
      gradient: 'from-rose-500 to-red-600',
      advice: 'Everyone may begin to experience health effects. Keep outdoor exercise brief and consider an N95 mask.',
      healthImplications: 'General population at risk of throat irritation and reduced lung capacity.'
    };
  }
  if (aqi <= 300) {
    return {
      label: 'Very Unhealthy',
      level: 'very-unhealthy',
      color: '#a855f7',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
      gradient: 'from-purple-500 to-indigo-600',
      advice: 'Health alert: increased likelihood of serious effects. Avoid outdoor workouts; seal windows and run air filtration.',
      healthImplications: 'Significant irritation across the entire population; trigger risk for cardio-respiratory conditions.'
    };
  }
  return {
    label: 'Hazardous',
    level: 'hazardous',
    color: '#e11d48',
    bgColor: 'bg-rose-950/40',
    borderColor: 'border-rose-700/50',
    textColor: 'text-rose-300',
    gradient: 'from-rose-700 to-red-900',
    advice: 'Emergency conditions: severe health risk. Remain indoors with high-grade HEPA filtration active.',
    healthImplications: 'Serious risk of adverse respiratory and cardiovascular events for the entire population.'
  };
}

/**
 * Universal metric formatter with seamless Standard ⇄ Scientific CGS support
 */
export function formatTelemetryMetric(
  val: number,
  type: 'pm25' | 'pm10' | 'pressure' | 'wind' | 'pblHeight' | 'temp',
  unitSystem: UnitSystem = 'standard'
): {
  primary: string;
  secondary: string;
  label: string;
  context: string;
} {
  switch (type) {
    case 'pm25': {
      if (unitSystem === 'scientific') {
        const cgsVal = val * 1e-12;
        return {
          primary: `${cgsVal.toExponential(2)} g/cm³`,
          secondary: `${val.toFixed(1)} µg/m³ (SI)`,
          label: 'PM2.5 Mass Density',
          context: val < 35 ? 'Nominal aerosol density.' : 'Elevated sub-micron particulates.'
        };
      }
      return {
        primary: `${val.toFixed(1)} µg/m³`,
        secondary: `${(val * 1e-12).toExponential(2)} g/cm³ (CGS)`,
        label: 'PM2.5 Particulate',
        context: val < 35 ? 'Within clean threshold' : 'Exceeds WHO clean baseline'
      };
    }

    case 'pm10': {
      if (unitSystem === 'scientific') {
        const cgsVal = val * 1e-12;
        return {
          primary: `${cgsVal.toExponential(2)} g/cm³`,
          secondary: `${val.toFixed(1)} µg/m³ (SI)`,
          label: 'PM10 Mass Density',
          context: 'Coarse road dust and mineral particles.'
        };
      }
      return {
        primary: `${val.toFixed(1)} µg/m³`,
        secondary: `${(val * 1e-12).toExponential(2)} g/cm³ (CGS)`,
        label: 'PM10 Coarse Dust',
        context: 'Surface dust, construction, and soil drift'
      };
    }

    case 'pressure': {
      if (unitSystem === 'scientific') {
        const barye = Math.round(val * 1000);
        return {
          primary: `${(val * 1000).toLocaleString()} dyn/cm²`,
          secondary: `${val.toFixed(1)} hPa (SI)`,
          label: 'Barometric Force',
          context: val > 1013 ? 'High pressure anticyclone: subsidence traps haze.' : 'Normal barometric gradient.'
        };
      }
      return {
        primary: `${val.toFixed(1)} hPa`,
        secondary: `${(val * 1000).toLocaleString()} dyn/cm² (Barye)`,
        label: 'Barometric Pressure',
        context: val > 1013 ? 'High pressure subsidence traps ground haze' : 'Normal barometric circulation'
      };
    }

    case 'wind': {
      if (unitSystem === 'scientific') {
        const cmS = Math.round(val * 100);
        return {
          primary: `${cmS} cm/s`,
          secondary: `${val.toFixed(1)} m/s (${(val * 3.6).toFixed(1)} km/h)`,
          label: 'Wind Velocity',
          context: val < 1.5 ? 'Stagnation layer: pollutants pool over ground.' : 'Active surface dispersion.'
        };
      }
      const kmh = (val * 3.6).toFixed(1);
      return {
        primary: `${val.toFixed(1)} m/s`,
        secondary: `${kmh} km/h • ${Math.round(val * 100)} cm/s (CGS)`,
        label: 'Wind Velocity',
        context: val < 1.5 ? 'Stagnant air prevents smog dispersion' : 'Active breeze dispersing particulates'
      };
    }

    case 'pblHeight': {
      if (unitSystem === 'scientific') {
        const cm = Math.round(val * 100);
        return {
          primary: `${cm.toLocaleString()} cm`,
          secondary: `${val.toFixed(0)} m (SI)`,
          label: 'Inversion Ceiling',
          context: val < 700 ? 'Severe thermal inversion cap.' : 'Deep convective mixing layer.'
        };
      }
      return {
        primary: `${val.toFixed(0)} m`,
        secondary: `${(val * 100).toLocaleString()} cm (CGS)`,
        label: 'Boundary Layer Ceiling',
        context: val < 700 ? 'Low ceiling traps exhaust at ground level' : 'High ceiling allows vertical dispersion'
      };
    }

    case 'temp': {
      return {
        primary: `${val.toFixed(1)} °C`,
        secondary: `${((val * 9) / 5 + 32).toFixed(1)} °F • ${(val + 273.15).toFixed(1)} K`,
        label: 'Ambient Temperature',
        context: 'Surface ambient temperature'
      };
    }
  }
}
