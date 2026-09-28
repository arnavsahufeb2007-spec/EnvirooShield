// CGS (Centimeter-Gram-Second) Environmental Conversion & Context Utilities

export interface CGSFormattedValue {
  cgsValue: number;
  cgsFormatted: string;
  cgsUnit: string;
  scientificNotation: string;
  siEquiv: string;
  context: string;
  healthContext?: string;
  statusBadge: {
    label: string;
    color: string;
    bg: string;
    border: string;
  };
}

/**
 * Converts PM2.5 / PM10 (µg/m³) into CGS mass concentration (g/cm³).
 * 1 µg/m³ = 10^-6 g / 10^6 cm³ = 10^-12 g/cm³.
 */
export function formatPM_CGS(ug_per_m3: number, pollutant: 'PM2.5' | 'PM10' = 'PM2.5'): CGSFormattedValue {
  const g_per_cm3 = ug_per_m3 * 1e-12;
  const sciExp = (ug_per_m3 * 1e-12).toExponential(2);
  const [base, exp] = sciExp.split('e');
  const expNum = parseInt(exp, 10);
  const superscriptExp = expNum.toString().replace('-', '⁻').replace('+', '');
  const scientificNotation = `${base} × 10${superscriptExp} g/cm³`;

  // Health context & cigarette equivalence (Berkeley Earth rule: 22 µg/m³ ≈ 1 cigarette/day)
  const cigs = (ug_per_m3 / 22).toFixed(1);
  const whoRatio = (ug_per_m3 / 15).toFixed(1); // WHO daily PM2.5 guide is 15 µg/m³ (1.50 × 10^-11 g/cm³)

  let statusBadge = {
    label: 'GOOD (CLEAN AIR)',
    color: 'text-[#44e2cd]',
    bg: 'bg-[#44e2cd]/15',
    border: 'border-[#44e2cd]/30'
  };
  let context = 'Air quality meets strict international health guidelines. Ideal for outdoor exercise and opening windows.';
  let healthContext = 'Clean baseline: No elevated health risk for sensitive groups.';

  if (ug_per_m3 > 150) {
    statusBadge = {
      label: 'HAZARDOUS SMOG',
      color: 'text-[#ffb4ab]',
      bg: 'bg-[#93000a]/30',
      border: 'border-[#ffb4ab]/50'
    };
    context = `Extremely dense particulate loading (${whoRatio}× WHO clean air limit). Equal to inhaling ~${cigs} cigarettes today.`;
    healthContext = 'Severe danger: Wear N95 masks outdoors, run HEPA air filtration indoors, avoid all outdoor exertion.';
  } else if (ug_per_m3 > 75) {
    statusBadge = {
      label: 'UNHEALTHY / HIGH',
      color: 'text-[#fbbf24]',
      bg: 'bg-[#fbbf24]/15',
      border: 'border-[#fbbf24]/40'
    };
    context = `Elevated fine aerosol particles (${whoRatio}× WHO guideline). Breathing this 24h equals smoking ~${cigs} cigarettes.`;
    healthContext = 'Children, seniors, and individuals with respiratory issues should stay indoors and keep windows closed.';
  } else if (ug_per_m3 > 35) {
    statusBadge = {
      label: 'MODERATE EXPOSURE',
      color: 'text-[#38bdf8]',
      bg: 'bg-[#38bdf8]/15',
      border: 'border-[#38bdf8]/40'
    };
    context = `Typical urban particulate level (${whoRatio}× WHO guideline). Sensitive groups may experience slight throat or eye irritation.`;
    healthContext = 'Acceptable for most; sensitive individuals should consider taking breaks during long outdoor activities.';
  }

  return {
    cgsValue: g_per_cm3,
    cgsFormatted: scientificNotation,
    cgsUnit: 'g/cm³',
    scientificNotation,
    siEquiv: `${ug_per_m3} µg/m³`,
    context,
    healthContext,
    statusBadge
  };
}

/**
 * Converts atmospheric pressure (hPa) to CGS pressure in barye (Ba) or dyn/cm².
 * 1 hPa = 100 Pa = 1,000 dyn/cm² = 1,000 Ba.
 */
export function formatPressure_CGS(hPa: number): CGSFormattedValue {
  const dyn_per_cm2 = hPa * 1000;
  const sciExp = dyn_per_cm2.toExponential(2);
  const [base, exp] = sciExp.split('e');
  const expNum = parseInt(exp, 10);
  const superscriptExp = expNum.toString().replace('-', '⁻').replace('+', '');
  const scientificNotation = `${base} × 10${superscriptExp} dyn/cm²`;
  const formattedBa = `${dyn_per_cm2.toLocaleString()} Ba`;

  let context = 'Standard barometric pressure near sea level (~1.013 × 10⁶ dyn/cm²). Balanced atmospheric column.';
  let statusBadge = {
    label: 'BALANCED BAROMETRIC',
    color: 'text-[#8ed5ff]',
    bg: 'bg-[#8ed5ff]/15',
    border: 'border-[#8ed5ff]/30'
  };

  if (hPa > 1020) {
    context = 'High-pressure anti-cyclone system. Downward air sinking traps smoke close to streets with minimal upward dispersal.';
    statusBadge = {
      label: 'HIGH PRESSURE LID',
      color: 'text-[#fbbf24]',
      bg: 'bg-[#fbbf24]/15',
      border: 'border-[#fbbf24]/30'
    };
  } else if (hPa < 990) {
    context = 'Low-pressure system promoting vertical upward thermal convection, which helps disperse ground-level haze.';
    statusBadge = {
      label: 'DYNAMIC LOW PRESSURE',
      color: 'text-[#44e2cd]',
      bg: 'bg-[#44e2cd]/15',
      border: 'border-[#44e2cd]/30'
    };
  }

  return {
    cgsValue: dyn_per_cm2,
    cgsFormatted: scientificNotation,
    cgsUnit: 'dyn/cm² (barye)',
    scientificNotation: `${scientificNotation} (${formattedBa})`,
    siEquiv: `${hPa} hPa`,
    context,
    statusBadge
  };
}

/**
 * Converts wind velocity (m/s or km/h) into CGS velocity (cm/s).
 * 1 m/s = 100 cm/s.
 */
export function formatWind_CGS(ms: number, direction: string = 'NW'): CGSFormattedValue {
  const cm_per_s = Math.round(ms * 100);

  let statusBadge = {
    label: 'VENTILATED BREEZE',
    color: 'text-[#44e2cd]',
    bg: 'bg-[#44e2cd]/15',
    border: 'border-[#44e2cd]/30'
  };
  let context = `Active breeze blowing ${direction}. Rapidly sweeps car exhaust and factory emissions away from the urban surface.`;

  if (cm_per_s < 100) {
    statusBadge = {
      label: 'CRITICAL STAGNATION',
      color: 'text-[#ffb4ab]',
      bg: 'bg-[#93000a]/25',
      border: 'border-[#ffb4ab]/40'
    };
    context = `Nearly dead calm (< 100 cm/s). Smog, vehicle smoke, and dust stagnate directly in the breathing zone.`;
  } else if (cm_per_s < 250) {
    statusBadge = {
      label: 'LIGHT DRIFT',
      color: 'text-[#fbbf24]',
      bg: 'bg-[#fbbf24]/15',
      border: 'border-[#fbbf24]/30'
    };
    context = `Slow atmospheric drift (${cm_per_s} cm/s). Weak air movement provides minimal natural cleansing.`;
  }

  return {
    cgsValue: cm_per_s,
    cgsFormatted: `${cm_per_s} cm/s`,
    cgsUnit: 'cm/s',
    scientificNotation: `${cm_per_s} cm/s`,
    siEquiv: `${ms.toFixed(1)} m/s (${(ms * 3.6).toFixed(1)} km/h)`,
    context,
    statusBadge
  };
}

/**
 * Converts Boundary Layer Height (PBL) in meters to CGS height (cm).
 * 1 m = 100 cm.
 */
export function formatHeight_CGS(meters: number): CGSFormattedValue {
  const cm = Math.round(meters * 100);
  const formattedCm = `${cm.toLocaleString()} cm`;

  let statusBadge = {
    label: 'DEEP MIXING LAYER',
    color: 'text-[#44e2cd]',
    bg: 'bg-[#44e2cd]/15',
    border: 'border-[#44e2cd]/30'
  };
  let context = 'Atmospheric ceiling is high (> 100,000 cm). Plenty of vertical volume allows pollutants to dilute into the upper troposphere.';

  if (meters < 450) {
    statusBadge = {
      label: 'SEVERE INVERSION LID',
      color: 'text-[#ffb4ab]',
      bg: 'bg-[#93000a]/30',
      border: 'border-[#ffb4ab]/50'
    };
    context = `Compressed weather lid at ${formattedCm} (${meters}m). Acts like a pot lid over the city, trapping toxic gases.`;
  } else if (meters < 800) {
    statusBadge = {
      label: 'MODERATE BOUNDARY',
      color: 'text-[#fbbf24]',
      bg: 'bg-[#fbbf24]/15',
      border: 'border-[#fbbf24]/30'
    };
    context = `Ceiling capped at ${formattedCm} (${meters}m). Moderate vertical mixing volume during daytime.`;
  }

  return {
    cgsValue: cm,
    cgsFormatted: formattedCm,
    cgsUnit: 'cm',
    scientificNotation: `${(cm / 1e5).toFixed(2)} × 10⁵ cm`,
    siEquiv: `${meters} m`,
    context,
    statusBadge
  };
}

/**
 * Formats overall risk score into clear human-friendly health advice.
 */
export function getOverallRiskContext(score: number, cityName: string): {
  headline: string;
  description: string;
  badge: { text: string; bg: string; color: string; border: string };
  actionItems: { icon: string; title: string; desc: string; allowed: boolean }[];
} {
  if (score < 30) {
    return {
      headline: `Good Air Quality in ${cityName}`,
      description: `Atmospheric dispersion is optimal. Fresh winds and an open vertical mixing boundary layer keep particulate levels well within WHO safe boundaries.`,
      badge: {
        text: 'LOW RISK / CLEAN',
        bg: 'bg-[#44e2cd]/15',
        color: 'text-[#44e2cd]',
        border: 'border-[#44e2cd]/40'
      },
      actionItems: [
        { icon: 'directions_run', title: 'Outdoor Sports & Jogging', desc: 'Completely safe for everyone.', allowed: true },
        { icon: 'window', title: 'Natural Home Ventilation', desc: 'Open windows freely for fresh air.', allowed: true },
        { icon: 'masks', title: 'Face Masks', desc: 'Not needed today.', allowed: false },
        { icon: 'air_purifier_gen', title: 'Air Purifiers', desc: 'Optional / standard energy mode.', allowed: false }
      ]
    };
  } else if (score < 55) {
    return {
      headline: `Moderate Air Quality in ${cityName}`,
      description: `Particulate matter is present at noticeable levels. Weather conditions (temperature inversion lid and mild winds) are holding urban emissions near ground level.`,
      badge: {
        text: 'MODERATE RISK',
        bg: 'bg-[#38bdf8]/15',
        color: 'text-[#8ed5ff]',
        border: 'border-[#38bdf8]/40'
      },
      actionItems: [
        { icon: 'directions_run', title: 'Outdoor Exercise', desc: 'Safe for healthy adults; sensitive people should reduce intensity.', allowed: true },
        { icon: 'window', title: 'Window Ventilation', desc: 'Ventilate during afternoon when winds peak.', allowed: true },
        { icon: 'masks', title: 'N95 Masks for Sensitive Groups', desc: 'Recommended if experiencing irritation.', allowed: true },
        { icon: 'air_purifier_gen', title: 'Indoor Air Filters', desc: 'Recommended in bedrooms during night hours.', allowed: true }
      ]
    };
  } else {
    return {
      headline: `Elevated Smog Hazard in ${cityName}`,
      description: `Severe atmospheric entrapment. A low inversion ceiling and stagnant wind vectors prevent pollutants from escaping. High particulate concentration.`,
      badge: {
        text: 'HIGH / CRITICAL RISK',
        bg: 'bg-[#93000a]/25',
        color: 'text-[#ffb4ab]',
        border: 'border-[#ffb4ab]/50'
      },
      actionItems: [
        { icon: 'directions_run', title: 'Outdoor Workouts', desc: 'Avoid heavy exertion outdoors.', allowed: false },
        { icon: 'window', title: 'Keep Windows Closed', desc: 'Seal windows against outdoor haze.', allowed: false },
        { icon: 'masks', title: 'Wear N95/FFP2 Mask', desc: 'Essential if walking outside near traffic.', allowed: true },
        { icon: 'air_purifier_gen', title: 'Run HEPA Filtration', desc: 'Keep air purifiers running continuously.', allowed: true }
      ]
    };
  }
}
