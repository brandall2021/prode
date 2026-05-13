const TZ = 'America/Argentina/Buenos_Aires';

const dateFmt = new Intl.DateTimeFormat('es-AR', {
  timeZone: TZ,
  weekday: 'short',
  day: '2-digit',
  month: 'short',
});

const timeFmt = new Intl.DateTimeFormat('es-AR', {
  timeZone: TZ,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const fullFmt = new Intl.DateTimeFormat('es-AR', {
  timeZone: TZ,
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export function formatDateAR(d: Date): string {
  return dateFmt.format(d);
}

export function formatTimeAR(d: Date): string {
  return timeFmt.format(d) + ' hs';
}

export function formatFullAR(d: Date): string {
  return fullFmt.format(d) + ' hs';
}

export const LOCKOUT_MS = 90 * 60 * 1000;

export function isLocked(matchDate: Date, now: Date = new Date()): boolean {
  return now.getTime() >= matchDate.getTime() - LOCKOUT_MS;
}

export function minutesUntilLock(matchDate: Date, now: Date = new Date()): number {
  const lock = matchDate.getTime() - LOCKOUT_MS;
  return Math.max(0, Math.floor((lock - now.getTime()) / 60000));
}
