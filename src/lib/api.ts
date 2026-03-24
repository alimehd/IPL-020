import { Appointment } from './types';

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
