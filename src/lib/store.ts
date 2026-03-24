'use client';

import { Appointment } from './types';

const STORAGE_KEY = 'ipl_garage_appointments';

export function loadAppointments(): Appointment[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAppointments(appointments: Appointment[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

export function addAppointment(appointment: Appointment): Appointment[] {
  const current = loadAppointments();
  const updated = [...current, appointment];
  saveAppointments(updated);
  return updated;
}

export function deleteAppointment(id: string): Appointment[] {
  const current = loadAppointments();
  const updated = current.filter((a) => a.id !== id);
  saveAppointments(updated);
  return updated;
}

export function getAppointmentsByDate(date: string): Appointment[] {
  return loadAppointments().filter((a) => a.date === date);
}
