import { NextRequest, NextResponse } from 'next/server';
import { ensureBlockedDaysTable, getSql, rowToBlockedDay } from '@/lib/db';

export async function GET() {
  try {
    await ensureBlockedDaysTable();
    const sql = getSql();
    const rows = await sql`SELECT * FROM blocked_days ORDER BY date ASC`;
    return NextResponse.json(rows.map(rowToBlockedDay));
  } catch (err) {
    console.error('GET /api/blocked-days error:', err);
    return NextResponse.json({ error: 'Failed to load blocked days' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureBlockedDaysTable();
    const sql = getSql();
    const { date, reason } = await req.json();
    if (!date) return NextResponse.json({ error: 'Missing date' }, { status: 400 });

    await sql`
      INSERT INTO blocked_days (date, reason, created_at)
      VALUES (${date}, ${reason ?? ''}, ${new Date().toISOString()})
      ON CONFLICT (date) DO UPDATE SET reason = EXCLUDED.reason
    `;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('POST /api/blocked-days error:', err);
    return NextResponse.json({ error: 'Failed to block day' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureBlockedDaysTable();
    const sql = getSql();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    if (!date) return NextResponse.json({ error: 'Missing date' }, { status: 400 });

    await sql`DELETE FROM blocked_days WHERE date = ${date}`;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/blocked-days error:', err);
    return NextResponse.json({ error: 'Failed to unblock day' }, { status: 500 });
  }
}
