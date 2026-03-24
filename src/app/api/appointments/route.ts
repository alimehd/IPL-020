import { NextRequest, NextResponse } from 'next/server';
import { ensureTable, getSql, rowToAppointment } from '@/lib/db';
import { Appointment } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    await ensureTable();
    const sql = getSql();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    const rows = date
      ? await sql`SELECT * FROM appointments WHERE date = ${date} ORDER BY start_time ASC`
      : await sql`SELECT * FROM appointments ORDER BY date ASC, start_time ASC`;

    return NextResponse.json(rows.map(rowToAppointment));
  } catch (err) {
    console.error('GET /api/appointments error:', err);
    return NextResponse.json({ error: 'Failed to load appointments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTable();
    const sql = getSql();
    const appt: Appointment = await req.json();

    await sql`
      INSERT INTO appointments
        (id, date, start_time, end_time, break_end_time,
         service_id, vehicle_type, client_name, client_phone, notes, created_at)
      VALUES
        (${appt.id}, ${appt.date}, ${appt.startTime}, ${appt.endTime},
         ${appt.breakEndTime}, ${appt.serviceId}, ${appt.vehicleType},
         ${appt.clientName}, ${appt.clientPhone ?? ''}, ${appt.notes ?? ''},
         ${appt.createdAt})
    `;

    return NextResponse.json({ success: true, appointment: appt });
  } catch (err) {
    console.error('POST /api/appointments error:', err);
    return NextResponse.json({ error: 'Failed to save appointment' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureTable();
    const sql = getSql();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    await sql`DELETE FROM appointments WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/appointments error:', err);
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
}
