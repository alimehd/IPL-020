import { Appointment } from './types';
import { BlockedDay } from './db';

export async function fetchAppointments(date?: string): Promise<Appointment[]> {
  try {
    const url = date ? `/api/appointments?date=${date}` : '/api/appointments';
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function createAppointment(appointment: Appointment): Promise<boolean> {
  try {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointment),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function removeAppointment(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/appointments?id=${id}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchBlockedDays(): Promise<BlockedDay[]> {
  try {
    const res = await fetch('/api/blocked-days', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function blockDay(date: string, reason?: string): Promise<boolean> {
  try {
    const res = await fetch('/api/blocked-days', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, reason }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function unblockDay(date: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/blocked-days?date=${date}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}
