export type VehicleType = 'skidoo' | 'honda' | 'car' | 'truck';

export type ServiceId =
  | 'oil-change'
  | 'tire-appointment'
  | 'changing-skis'
  | 'spark-plugs'
  | 'case-oil'
  | 'gas-filters'
  | 'air-filters'
  | 'kill-switch'
  | 'rims';

export interface Service {
  id: ServiceId;
  name: string;
  durationMinutes: number;
  vehicles: VehicleType[];
  description?: string;
}

export interface Appointment {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM (24h)
  endTime: string; // HH:MM (24h) — service end
  breakEndTime: string; // HH:MM (24h) — end of 30-min break after service
  serviceId: ServiceId;
  vehicleType: VehicleType;
  clientName: string;
  clientPhone: string;
  notes?: string;
  createdAt: string;
}

export interface TimeSlot {
  startTime: string; // HH:MM
  endTime: string; // HH:MM (service end)
  breakEndTime: string; // HH:MM (break end)
  available: boolean;
}

export const GARAGE_OPEN = '09:00';
export const GARAGE_CLOSE = '16:00';
export const BREAK_MINUTES = 30;
export const SCHOOL_PHONE = '(819) 964-2961';
