import { useState, useEffect } from 'react';
import { StationData } from '../types';

export interface StationTimeInfo {
  time24: string;         // "14:32:05"
  time12: string;         // "2:32:05 PM"
  timeShort: string;      // "2:32 PM"
  dateStr: string;        // "Mon, Sep 28, 2026"
  dateShort: string;      // "Sep 28, 2026"
  dateISO: string;        // "2026-09-28"
  timezone: string;       // "Asia/Kolkata"
  timezoneAbbr: string;   // "IST"
  utcOffsetStr: string;   // "UTC+05:30"
  utcOffsetHours: number; // 5.5
  utcTime: string;        // "09:02:05 UTC"
  isNight: boolean;       // true if local hour < 6 or >= 19
  dayPeriod: string;      // "Morning", "Afternoon", "Evening", "Night"
}

/**
 * Resolve the best matching IANA timezone for a given location (lat, lng, country, name).
 * Used when the live API doesn't specify one, or for offline/preset stations.
 */
export function getTimezoneForLocation(lat: number, lng: number, countryCode?: string, countryName?: string, cityName?: string): { timezone: string; abbr: string } {
  const code = (countryCode || '').toUpperCase();
  const name = (cityName || '').toLowerCase();
  const country = (countryName || '').toLowerCase();

  // Known megacities & presets
  if (name.includes('delhi') || name.includes('mumbai') || name.includes('indore') || name.includes('bhopal') || name.includes('bangalore') || name.includes('chennai') || code === 'IN' || country.includes('india')) {
    return { timezone: 'Asia/Kolkata', abbr: 'IST' };
  }
  if (name.includes('tokyo') || name.includes('osaka') || name.includes('kyoto') || code === 'JP' || country.includes('japan')) {
    return { timezone: 'Asia/Tokyo', abbr: 'JST' };
  }
  if (name.includes('london') || code === 'GB' || code === 'UK' || country.includes('united kingdom')) {
    return { timezone: 'Europe/London', abbr: 'BST' };
  }
  if (name.includes('paris') || code === 'FR' || country.includes('france')) {
    return { timezone: 'Europe/Paris', abbr: 'CEST' };
  }
  if (name.includes('berlin') || name.includes('frankfurt') || code === 'DE' || country.includes('germany')) {
    return { timezone: 'Europe/Berlin', abbr: 'CEST' };
  }
  if (name.includes('beijing') || name.includes('shanghai') || code === 'CN' || country.includes('china')) {
    return { timezone: 'Asia/Shanghai', abbr: 'CST' };
  }
  if (name.includes('cairo') || code === 'EG' || country.includes('egypt')) {
    return { timezone: 'Africa/Cairo', abbr: 'EEST' };
  }
  if (name.includes('sao paulo') || name.includes('são paulo') || name.includes('rio') || code === 'BR' || country.includes('brazil')) {
    return { timezone: 'America/Sao_Paulo', abbr: 'BRT' };
  }
  if (name.includes('sydney') || name.includes('melbourne') || code === 'AU' || country.includes('australia')) {
    return { timezone: 'Australia/Sydney', abbr: 'AEST' };
  }
  if (name.includes('dubai') || name.includes('abu dhabi') || code === 'AE' || country.includes('emirates')) {
    return { timezone: 'Asia/Dubai', abbr: 'GST' };
  }
  if (name.includes('singapore') || code === 'SG' || country.includes('singapore')) {
    return { timezone: 'Asia/Singapore', abbr: 'SGT' };
  }

  // United States by longitude
  if (code === 'US' || country.includes('united states')) {
    if (lng < -140) return { timezone: 'Pacific/Honolulu', abbr: 'HST' };
    if (lng < -130) return { timezone: 'America/Anchorage', abbr: 'AKDT' };
    if (lng < -114) return { timezone: 'America/Los_Angeles', abbr: 'PDT' };
    if (lng < -102) return { timezone: 'America/Denver', abbr: 'MDT' };
    if (lng < -86) return { timezone: 'America/Chicago', abbr: 'CDT' };
    return { timezone: 'America/New_York', abbr: 'EDT' };
  }

  // Canada by longitude
  if (code === 'CA' || country.includes('canada')) {
    if (lng < -120) return { timezone: 'America/Vancouver', abbr: 'PDT' };
    if (lng < -102) return { timezone: 'America/Edmonton', abbr: 'MDT' };
    if (lng < -88) return { timezone: 'America/Winnipeg', abbr: 'CDT' };
    return { timezone: 'America/Toronto', abbr: 'EDT' };
  }

  // Europe broad longitude zone
  if (lat > 35 && lat < 70 && lng > -10 && lng < 40) {
    if (lng < 5) return { timezone: 'Europe/London', abbr: 'BST' };
    if (lng < 25) return { timezone: 'Europe/Berlin', abbr: 'CEST' };
    return { timezone: 'Europe/Athens', abbr: 'EEST' };
  }

  // General fallback: estimate UTC offset from longitude (15 degrees per hour)
  const approxOffsetHours = Math.round(lng / 15);
  const sign = approxOffsetHours >= 0 ? '+' : '-';
  const absHours = Math.abs(approxOffsetHours);
  const abbr = `UTC${sign}${absHours}`;

  return { timezone: 'UTC', abbr };
}

/**
 * Format time and timezone accurately for any IANA timezone string.
 */
export function getStationTimeInfo(date: Date, timezone?: string, customAbbr?: string, utcOffsetSec?: number): StationTimeInfo {
  // Validate timezone with Intl, fallback safely if invalid
  let validTz = timezone;
  if (!validTz) {
    validTz = 'UTC';
  } else {
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: validTz }).format(date);
    } catch {
      validTz = 'UTC';
    }
  }

  // Time components in target timezone
  let time24 = '00:00:00';
  let time12 = '12:00:00 AM';
  let timeShort = '12:00 AM';
  let dateStr = 'Mon, Sep 28, 2026';
  let dateShort = 'Sep 28, 2026';
  let dateISO = '2026-09-28';
  let hour = 12;

  try {
    const time24Formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: validTz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    time24 = time24Formatter.format(date);

    const time12Formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: validTz,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    time12 = time12Formatter.format(date);

    const timeShortFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: validTz,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    timeShort = timeShortFormatter.format(date);

    const dateStrFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: validTz,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    dateStr = dateStrFormatter.format(date);

    const dateShortFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: validTz,
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    dateShort = dateShortFormatter.format(date);

    const hourFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: validTz,
      hour: 'numeric',
      hour12: false
    });
    hour = parseInt(hourFormatter.format(date), 10) || 12;

    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: validTz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
    dateISO = parts;
  } catch (err) {
    console.warn('Error formatting timezone date:', err);
  }

  // Calculate UTC offset
  let offsetMinutes = 0;
  if (utcOffsetSec !== undefined) {
    offsetMinutes = Math.round(utcOffsetSec / 60);
  } else {
    try {
      // Calculate offset difference between target timezone and UTC
      const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
      const tzDate = new Date(date.toLocaleString('en-US', { timeZone: validTz }));
      offsetMinutes = Math.round((tzDate.getTime() - utcDate.getTime()) / 60000);
    } catch {
      offsetMinutes = 0;
    }
  }

  const offsetSign = offsetMinutes >= 0 ? '+' : '-';
  const absOffset = Math.abs(offsetMinutes);
  const offsetH = String(Math.floor(absOffset / 60)).padStart(2, '0');
  const offsetM = String(absOffset % 60).padStart(2, '0');
  const utcOffsetStr = `UTC${offsetSign}${offsetH}:${offsetM}`;
  const utcOffsetHours = Number((offsetMinutes / 60).toFixed(1));

  // Timezone abbreviation
  let abbr = customAbbr || '';
  if (!abbr) {
    try {
      const tzNameFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: validTz,
        timeZoneName: 'short'
      });
      const parts = tzNameFormatter.formatToParts(date);
      const tzPart = parts.find((p) => p.type === 'timeZoneName');
      if (tzPart && tzPart.value) {
        abbr = tzPart.value;
      }
    } catch {
      abbr = utcOffsetStr;
    }
  }
  if (!abbr || abbr === 'GMT' || abbr.startsWith('GMT+0')) {
    abbr = utcOffsetStr;
  }

  // Day period & night detection
  const isNight = hour < 6 || hour >= 19;
  let dayPeriod = 'Afternoon';
  if (hour >= 5 && hour < 12) dayPeriod = 'Morning';
  else if (hour >= 12 && hour < 17) dayPeriod = 'Afternoon';
  else if (hour >= 17 && hour < 21) dayPeriod = 'Evening';
  else dayPeriod = 'Night';

  // Current UTC string
  const utcHours = String(date.getUTCHours()).padStart(2, '0');
  const utcMinutes = String(date.getUTCMinutes()).padStart(2, '0');
  const utcSeconds = String(date.getUTCSeconds()).padStart(2, '0');
  const utcTime = `${utcHours}:${utcMinutes}:${utcSeconds} UTC`;

  return {
    time24,
    time12,
    timeShort,
    dateStr,
    dateShort,
    dateISO,
    timezone: validTz,
    timezoneAbbr: abbr,
    utcOffsetStr,
    utcOffsetHours,
    utcTime,
    isNight,
    dayPeriod
  };
}

/**
 * Format a future horizon (e.g., +24 hours) into the station's local time and day.
 */
export function formatForecastTimeForTimezone(hoursAhead: number, timezone?: string): { localTimeStr: string; localDateStr: string; fullLabel: string } {
  const futureDate = new Date(Date.now() + hoursAhead * 3600 * 1000);
  const info = getStationTimeInfo(futureDate, timezone);

  let dayRelative = `+${hoursAhead}h`;
  if (hoursAhead === 0) dayRelative = 'Today (Now)';
  else if (hoursAhead <= 12) dayRelative = 'Today';
  else if (hoursAhead <= 24) dayRelative = 'Tomorrow';
  else if (hoursAhead <= 48) dayRelative = `In ${Math.round(hoursAhead / 24)} days`;

  return {
    localTimeStr: info.timeShort,
    localDateStr: info.dateShort,
    fullLabel: `${info.dateShort} ${info.timeShort} (${dayRelative})`
  };
}

/**
 * React hook for live updating clock synchronized with the active station's timezone.
 */
export function useStationTime(station?: StationData): StationTimeInfo {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    // Immediate sync
    setNow(new Date());

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [station?.id, station?.timezone]);

  return getStationTimeInfo(
    now,
    station?.timezone,
    station?.timezoneAbbr,
    station?.utcOffsetSeconds
  );
}
