import { NextRequest, NextResponse } from 'next/server';

/**
 * Appointments API — ready for Neon DB integration.
 *
 * When Neon DB is connected:
 * 1. Install: npm install @neondatabase/serverless drizzle-orm drizzle-kit
 * 2. Set DATABASE_URL in .env.local (from Neon dashboard)
 * 3. Replace the TODO sections below with your Neon/Drizzle queries
 */

// GET /api/appointments?date=YYYY-MM-DD
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');

  // TODO: Replace with Neon DB query
  // const db = neon(process.env.DATABASE_URL!);
  // const rows = await db`SELECT * FROM appointments WHERE date = ${date} ORDER BY start_time ASC`;
  // return NextResponse.json(rows);

  return NextResponse.json({
    message: 'DB not connected yet — using localStorage on client.',
    date,
    appointments: [],
  });
}

// POST /api/appointments
export async function POST(req: NextRequest) {
  const body = await req.json();

  // TODO: Replace with Neon DB insert
  // const db = neon(process.env.DATABASE_URL!);
  // await db`
  //   INSERT INTO appointments (id, date, start_time, end_time, break_end_time,
  //     service_id, vehicle_type, client_name, client_phone, notes, created_at)
  //   VALUES (${body.id}, ${body.date}, ${body.startTime}, ${body.endTime},
  //     ${body.breakEndTime}, ${body.serviceId}, ${body.vehicleType},
  //     ${body.clientName}, ${body.clientPhone}, ${body.notes}, ${body.createdAt})
  // `;

  return NextResponse.json({ success: true, appointment: body });
}

// DELETE /api/appointments/:id
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  // TODO: Replace with Neon DB delete
  // const db = neon(process.env.DATABASE_URL!);
  // await db`DELETE FROM appointments WHERE id = ${id}`;

  return NextResponse.json({ success: true, id });
}
