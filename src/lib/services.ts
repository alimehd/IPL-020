import { Service } from './types';

export const SERVICES: Service[] = [
  {
    id: 'oil-change',
    name: 'Oil Change',
    durationMinutes: 20,
    vehicles: ['skidoo', 'honda', 'car', 'truck'],
    description: 'Full oil change service',
  },
  {
    id: 'tire-appointment',
    name: 'Tire Appointment',
    durationMinutes: 30,
    vehicles: ['honda', 'car', 'truck'],
    description: 'Tire change or inspection',
  },
  {
    id: 'changing-skis',
    name: 'Changing Skis',
    durationMinutes: 30,
    vehicles: ['skidoo'],
    description: 'Ski replacement for Ski-Doo',
  },
  {
    id: 'spark-plugs',
    name: 'Spark Plugs',
    durationMinutes: 30,
    vehicles: ['skidoo', 'honda', 'car', 'truck'],
    description: 'Spark plug replacement',
  },
  {
    id: 'case-oil',
    name: 'Case Oil Change',
    durationMinutes: 10,
    vehicles: ['skidoo', 'honda', 'car', 'truck'],
    description: 'Case oil change',
  },
  {
    id: 'gas-filters',
    name: 'Gas Filters (Ski-Doo)',
    durationMinutes: 210,
    vehicles: ['skidoo'],
    description: 'Gas filter replacement — half day service',
  },
  {
    id: 'air-filters',
    name: 'Air Filters',
    durationMinutes: 15,
    vehicles: ['skidoo', 'honda', 'car', 'truck'],
    description: 'Air filter replacement',
  },
  {
    id: 'kill-switch',
    name: 'Kill Switch',
    durationMinutes: 90,
    vehicles: ['skidoo'],
    description: 'Kill switch repair/replacement for Ski-Doo',
  },
  {
    id: 'rims',
    name: 'Rims',
    durationMinutes: 30,
    vehicles: ['skidoo', 'honda', 'car', 'truck'],
    description: 'Rim change or inspection',
  },
];

export const VEHICLE_LABELS: Record<string, string> = {
  skidoo: 'Ski-Doo',
  honda: 'Honda',
  car: 'Car',
  truck: 'Truck',
};

export const VEHICLE_ICONS: Record<string, string> = {
  skidoo: '🛷',
  honda: '🏍️',
  car: '🚗',
  truck: '🚛',
};

export function getServicesForVehicle(vehicleType: string): Service[] {
  return SERVICES.filter((s) => s.vehicles.includes(vehicleType as never));
}

export function getServiceById(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}
