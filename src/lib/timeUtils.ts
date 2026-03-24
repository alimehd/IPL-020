import { Appointment, BREAK_MINUTES, GARAGE_CLOSE, GARAGE_OPEN } from './types';

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function addMinutes(time: string, minutes: number): string {
  return minutesToTime(timeToMinutes(time) + minutes);
}

export function formatTime12(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

export function getAvailableSlots(
  appointments: Appointment[],
  date: string,
  durationMinutes: number
): string[] {
  const openMinutes = timeToMinutes(GARAGE_OPEN);
  const closeMinutes = timeToMinutes(GARAGE_CLOSE);

  // When booking for today, don't show slots that have already passed
  const today = getTodayString();
  let earliestStart = openMinutes;
  if (date === today) {
    const now = new Date();
    earliestStart = Math.max(openMinutes, now.getHours() * 60 + now.getMinutes());
    // Round up to next 15-min boundary
    earliestStart = Math.ceil(earliestStart / 15) * 15;
  }

  // Build list of blocked ranges from booked appointments on this date
  const bookedRanges = appointments
    .filter((a) => a.date === date)
    .map((a) => ({
      start: timeToMinutes(a.startTime),
      end: timeToMinutes(a.breakEndTime), // blocked until break is over
    }))
    .sort((a, b) => a.start - b.start);

  const slots: string[] = [];
  let cursor = earliestStart;

  while (cursor + durationMinutes <= closeMinutes) {
    const slotEnd = cursor + durationMinutes;
    const slotBreakEnd = slotEnd + BREAK_MINUTES;

    // Check if this slot overlaps with any booked range
    const conflicts = bookedRanges.some(
      (range) => cursor < range.end && slotBreakEnd > range.start
    );

    if (!conflicts) {
      slots.push(minutesToTime(cursor));
    }

    cursor += 15; // 15-minute stepping granularity
  }

  return slots;
}

export function isToday(dateStr: string): boolean {
  return new Date().toISOString().slice(0, 10) === dateStr;
}

export function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Returns the 7 dates of the week containing the given date (Mon–Sun). */
export function getWeekDates(anchorDate: string): string[] {
  const d = new Date(anchorDate + 'T12:00:00');
  const day = d.getDay(); // 0=Sun
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(monday);
    dt.setDate(monday.getDate() + i);
    return dt.toISOString().slice(0, 10);
  });
}

export function isPastDate(dateStr: string): boolean {
  return dateStr < getTodayString();
}

export function getScheduleBlocks(appointments: Appointment[]) {
  const openMin = timeToMinutes(GARAGE_OPEN);
  const closeMin = timeToMinutes(GARAGE_CLOSE);
  const totalMinutes = closeMin - openMin;

  return appointments
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .map((appt) => {
      const start = timeToMinutes(appt.startTime) - openMin;
      const serviceEnd = timeToMinutes(appt.endTime) - openMin;
      const breakEnd = timeToMinutes(appt.breakEndTime) - openMin;

      return {
        appointment: appt,
        startPct: (start / totalMinutes) * 100,
        servicePct: ((serviceEnd - start) / totalMinutes) * 100,
        breakPct: ((breakEnd - serviceEnd) / totalMinutes) * 100,
      };
    });
}
