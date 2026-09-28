import { HourlyForecastRow, StationData } from '../types';

export interface CleanestWindowResult {
  bestSlot: {
    startHorizon: string;
    endHorizon: string;
    localTimeDisplay: string;
    avgPm25: number;
    riskScore: number;
    riskLabel: string;
    relativeStatus: 'ACTIVE_NOW' | 'UPCOMING' | 'TOMORROW';
    relativeHoursAway: number;
  };
  worstSlot: {
    horizon: string;
    localTimeDisplay: string;
    pm25: number;
    riskScore: number;
    riskLabel: string;
    reason: string;
  };
  recommendations: {
    outdoorExercise: { allowed: boolean; text: string };
    windowVentilation: { allowed: boolean; text: string };
    outdoorPlay: { allowed: boolean; text: string };
  };
  summarySentence: string;
}

/**
 * Calculates the cleanest and worst air quality windows from the 48-hour forecast.
 */
export function calculateCleanestWindow(
  forecast: HourlyForecastRow[],
  currentStation: StationData
): CleanestWindowResult {
  if (!forecast || forecast.length === 0) {
    return {
      bestSlot: {
        startHorizon: 'T+12h',
        endHorizon: 'T+16h',
        localTimeDisplay: 'Afternoon (14:00 - 17:00)',
        avgPm25: Number((currentStation.pm25 * 0.7).toFixed(1)),
        riskScore: Math.max(10, Math.round(currentStation.riskScore * 0.7)),
        riskLabel: 'Moderate',
        relativeStatus: 'UPCOMING',
        relativeHoursAway: 4
      },
      worstSlot: {
        horizon: 'T+24h',
        localTimeDisplay: 'Morning Peak (07:00 - 10:00)',
        pm25: Number((currentStation.pm25 * 1.25).toFixed(1)),
        riskScore: Math.min(100, Math.round(currentStation.riskScore * 1.25)),
        riskLabel: 'High Risk',
        reason: 'Low inversion ceiling compresses pollution at street level'
      },
      recommendations: {
        outdoorExercise: {
          allowed: currentStation.riskScore < 50,
          text: currentStation.riskScore < 50 ? 'Safe for running & cycling' : 'Postpone outdoor workout until afternoon'
        },
        windowVentilation: {
          allowed: currentStation.riskScore < 45,
          text: currentStation.riskScore < 45 ? 'Air out living rooms for 20 mins' : 'Keep windows closed; run HEPA filtration'
        },
        outdoorPlay: {
          allowed: currentStation.riskScore < 55,
          text: currentStation.riskScore < 55 ? 'Safe outdoor playtime for kids' : 'Limit outdoor playtime for sensitive children'
        }
      },
      summarySentence: `Best outdoor conditions expected in the afternoon when solar warming expands the inversion lid.`
    };
  }

  // Find lowest PM2.5 in forecast
  let minPm25 = Infinity;
  let minIdx = 0;
  let maxPm25 = -Infinity;
  let maxIdx = 0;

  forecast.forEach((row, idx) => {
    if (row.pm25 < minPm25) {
      minPm25 = row.pm25;
      minIdx = idx;
    }
    if (row.pm25 > maxPm25) {
      maxPm25 = row.pm25;
      maxIdx = idx;
    }
  });

  const bestRow = forecast[minIdx];
  const worstRow = forecast[maxIdx];

  // Derive time label
  const bestTimeLabel = bestRow.localTimeFormatted || bestRow.localTimestamp || bestRow.horizon;
  const worstTimeLabel = worstRow.localTimeFormatted || worstRow.localTimestamp || worstRow.horizon;

  const hoursAway = minIdx * 2; // Assuming ~2-3h step or hourly
  let relativeStatus: 'ACTIVE_NOW' | 'UPCOMING' | 'TOMORROW' = 'UPCOMING';
  if (minIdx <= 1) {
    relativeStatus = 'ACTIVE_NOW';
  } else if (hoursAway > 18) {
    relativeStatus = 'TOMORROW';
  }

  const bestRiskLabel = minPm25 <= 15 ? 'Good / Clean' : minPm25 <= 35 ? 'Moderate' : minPm25 <= 75 ? 'Elevated' : 'Unhealthy';
  const worstRiskLabel = maxPm25 <= 25 ? 'Moderate' : maxPm25 <= 55 ? 'Elevated' : maxPm25 <= 100 ? 'High Alert' : 'Critical Hazard';

  return {
    bestSlot: {
      startHorizon: bestRow.horizon,
      endHorizon: forecast[Math.min(forecast.length - 1, minIdx + 2)]?.horizon || bestRow.horizon,
      localTimeDisplay: bestTimeLabel,
      avgPm25: Number(minPm25.toFixed(1)),
      riskScore: Math.round(bestRow.riskScore),
      riskLabel: bestRiskLabel,
      relativeStatus,
      relativeHoursAway: Math.max(0, hoursAway)
    },
    worstSlot: {
      horizon: worstRow.horizon,
      localTimeDisplay: worstTimeLabel,
      pm25: Number(maxPm25.toFixed(1)),
      riskScore: Math.round(worstRow.riskScore),
      riskLabel: worstRiskLabel,
      reason: worstRow.pblNote || 'Atmospheric boundary layer compression and stagnant wind'
    },
    recommendations: {
      outdoorExercise: {
        allowed: minPm25 <= 40,
        text: minPm25 <= 25
          ? `Ideal window for marathon training, running, and cycling.`
          : minPm25 <= 45
          ? `Acceptable for light jogs; sensitive athletes should monitor breathing.`
          : `Even at best hour, particulate levels remain elevated. Favor indoor treadmill.`
      },
      windowVentilation: {
        allowed: minPm25 <= 35,
        text: minPm25 <= 35
          ? `Best 30-minute window to open windows and refresh stale indoor air.`
          : `Keep windows sealed. Outdoor air will degrade indoor air quality.`
      },
      outdoorPlay: {
        allowed: minPm25 <= 50,
        text: minPm25 <= 30
          ? `Children and elderly can safely enjoy outdoor activities.`
          : minPm25 <= 50
          ? `Moderate activity permitted; take hydration breaks.`
          : `Keep playground activities indoors or equipped with air purifiers.`
      }
    },
    summarySentence:
      relativeStatus === 'ACTIVE_NOW'
        ? `The cleanest window is occurring RIGHT NOW (${bestTimeLabel}) with PM2.5 at ${minPm25.toFixed(1)} µg/m³.`
        : `Plan outdoor workouts for ${bestTimeLabel} when pollution drops by ${Math.max(0, Math.round(((currentStation.pm25 - minPm25) / Math.max(1, currentStation.pm25)) * 100))}% to ${minPm25.toFixed(1)} µg/m³.`
  };
}
