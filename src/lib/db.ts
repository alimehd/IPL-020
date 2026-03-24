import { neon } from '@neondatabase/serverless';
import { Appointment } from './types';

export function getSql() {
  return neon(process.env.DATABASE_URL!);
}

export async function ensureTable() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS appointments (
      id             TEXT PRIMARY KEY,
      date           TEXT NOT NULL,
      start_time     TEXT NOT NULL,
      end_time       TEXT NOT NULL,
      break_end_time TEXT NOT NULL,
      service_id     TEXT NOT NULL,
      vehicle_type   TEXT NOT NULL,
      client_name    TEXT NOT NULL,
      client_phone   TEXT NOT NULL DEFAULT '',
      notes          TEXT NOT NULL DEFAULT '',
      created_at     TEXT NOT NULL
    )
  `;
}

export async function ensureBlockedDaysTable() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS blocked_days (
      date       TEXT PRIMARY KEY,
      reason     TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    )
  `;
}

export interface BlockedDay {
  date: string;
  reason: string;
  createdAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToBlockedDay(row: Record<string, any>): BlockedDay {
  return { date: row.date, reason: row.reason, createdAt: row.created_at };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToAppointment(row: Record<string, any>): Appointment {
  return {
    id: row.id,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    breakEndTime: row.break_end_time,
    serviceId: row.service_id,
    vehicleType: row.vehicle_type,
    clientName: row.client_name,
    clientPhone: row.client_phone,
    notes: row.notes,
    createdAt: row.created_at,
  };
}
