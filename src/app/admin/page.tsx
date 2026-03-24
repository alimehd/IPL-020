'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Appointment } from '@/lib/types';
import { BlockedDay } from '@/lib/db';
import { fetchAppointments, removeAppointment, fetchBlockedDays, blockDay, unblockDay } from '@/lib/api';
import { getServiceById, VEHICLE_LABELS, VEHICLE_ICONS } from '@/lib/services';
import { formatTime12, formatDateDisplay, getTodayString } from '@/lib/timeUtils';

const ADMIN_PIN = '24686';
const SESSION_KEY = 'garage_admin_auth';

// ─── PIN Screen ───────────────────────────────────────────────────────────────

function PinScreen({ onSuccess }: { onSuccess: () => void }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const press = (digit: string) => {
    if (input.length >= 5) return;
    const next = input + digit;
    setInput(next);
    setError(false);
    if (next.length === 5) {
      if (next === ADMIN_PIN) {
        sessionStorage.setItem(SESSION_KEY, '1');
        onSuccess();
      } else {
        setError(true);
        setShake(true);
        setTimeout(() => { setInput(''); setShake(false); }, 700);
      }
    }
  };

  const del = () => setInput((v) => v.slice(0, -1));

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className={`bg-white rounded-2xl shadow-xl border border-[#a1dd70]/30 p-8 w-full max-w-xs text-center ${shake ? 'animate-shake' : ''}`}>
        <div className="w-14 h-14 bg-[#799351] rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Admin Access</h2>
        <p className="text-sm text-gray-500 mb-6">Enter your PIN to continue</p>

        {/* PIN dots */}
        <div className="flex justify-center gap-3 mb-6">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                i < input.length
                  ? error ? 'bg-red-400 border-red-400' : 'bg-[#ff6b4a] border-[#ff6b4a]'
                  : 'border-gray-300'
              }`}
            />
          ))}
        </div>
        {error && <p className="text-red-500 text-xs mb-4 font-medium">Incorrect PIN. Try again.</p>}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5">
          {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k) => (
            <button
              key={k}
              onClick={() => k === '⌫' ? del() : k !== '' ? press(k) : undefined}
              disabled={k === ''}
              className={`h-14 rounded-xl text-xl font-semibold transition-all ${
                k === '' ? 'invisible' :
                k === '⌫' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95' :
                'bg-[#f6edd3] text-gray-800 hover:bg-[#a1dd70]/30 active:scale-95 active:bg-[#a1dd70]/50'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

type Tab = 'appointments' | 'blocked';

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const [tab, setTab] = useState<Tab>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blockedDays, setBlockedDays] = useState<BlockedDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');
  const [newBlockDate, setNewBlockDate] = useState('');
  const [newBlockReason, setNewBlockReason] = useState('');
  const [blockingDay, setBlockingDay] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    const [appts, blocked] = await Promise.all([fetchAppointments(), fetchBlockedDays()]);
    setAppointments(appts);
    setBlockedDays(blocked);
    setLoading(false);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const handleDeleteAppointment = async (id: string) => {
    setDeletingId(id);
    await removeAppointment(id);
    setDeletingId(null);
    reload();
  };

  const handleBlockDay = async () => {
    if (!newBlockDate) return;
    setBlockingDay(true);
    await blockDay(newBlockDate, newBlockReason);
    setNewBlockDate('');
    setNewBlockReason('');
    setBlockingDay(false);
    reload();
  };

  const handleUnblockDay = async (date: string) => {
    await unblockDay(date);
    reload();
  };

  // Group appointments by date
  const today = getTodayString();
  const filtered = appointments
    .filter((a) => !filterDate || a.date === filterDate)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));

  const grouped = filtered.reduce<Record<string, Appointment[]>>((acc, appt) => {
    (acc[appt.date] = acc[appt.date] || []).push(appt);
    return acc;
  }, {});

  const upcomingCount = appointments.filter((a) => a.date >= today).length;
  const blockedCount = blockedDays.filter((d) => d.date >= today).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Admin header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#ff6b4a]">Admin Dashboard</h2>
          <p className="text-sm text-[#799351]">PWT Jaanimmarik Garage</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-[#799351] hover:text-[#ff6b4a] transition-colors flex items-center gap-1">
            ← Public Site
          </Link>
          <button
            onClick={onSignOut}
            className="px-4 py-2 text-sm border-2 border-gray-200 text-gray-600 rounded-full hover:border-red-300 hover:text-red-500 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Total Appointments" value={appointments.length} color="orange" />
        <StatCard label="Upcoming" value={upcomingCount} color="green" />
        <StatCard label="Days Blocked" value={blockedCount} color="red" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#f6edd3] p-1 rounded-xl">
        {(['appointments', 'blocked'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize ${
              tab === t ? 'bg-white text-[#ff6b4a] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'appointments' ? `Appointments (${appointments.length})` : `Blocked Days (${blockedDays.length})`}
          </button>
        ))}
      </div>

      {/* Appointments Tab */}
      {tab === 'appointments' && (
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <label className="text-sm font-medium text-gray-600">Filter by date:</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="text-sm border-2 border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#ff6b4a]"
            />
            {filterDate && (
              <button onClick={() => setFilterDate('')} className="text-xs text-[#799351] hover:text-[#ff6b4a]">
                Clear ×
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1,2,3].map(i => <div key={i} className="h-20 bg-[#f6edd3] rounded-xl animate-pulse" />)}
            </div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg font-medium">No appointments found</p>
            </div>
          ) : (
            Object.entries(grouped).map(([date, appts]) => {
              const isPast = date < today;
              return (
                <div key={date} className="bg-white rounded-2xl border border-[#a1dd70]/30 overflow-hidden shadow-sm">
                  <div className={`px-4 py-2.5 flex items-center justify-between ${isPast ? 'bg-gray-100' : 'bg-[#f6edd3]'}`}>
                    <span className={`font-semibold text-sm ${isPast ? 'text-gray-400' : 'text-[#799351]'}`}>
                      {formatDateDisplay(date)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      isPast ? 'bg-gray-200 text-gray-400' : 'bg-[#ff6b4a] text-white'
                    }`}>
                      {appts.length} apt{appts.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {appts.map((appt) => {
                      const svc = getServiceById(appt.serviceId);
                      return (
                        <div key={appt.id} className="px-4 py-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-1 h-10 rounded-full bg-[#ff6b4a] flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-800 text-sm truncate">{svc?.name}</p>
                              <p className="text-xs text-gray-500 truncate">
                                {VEHICLE_ICONS[appt.vehicleType]} {VEHICLE_LABELS[appt.vehicleType]} · {appt.clientName}
                                {appt.clientPhone && ` · ${appt.clientPhone}`}
                              </p>
                              {appt.notes && <p className="text-xs text-gray-400 italic truncate">{appt.notes}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="text-right hidden sm:block">
                              <p className="text-sm font-medium text-[#799351]">{formatTime12(appt.startTime)}</p>
                              <p className="text-[10px] text-gray-400">– {formatTime12(appt.endTime)}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteAppointment(appt.id)}
                              disabled={deletingId === appt.id}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete appointment"
                            >
                              {deletingId === appt.id ? (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Blocked Days Tab */}
      {tab === 'blocked' && (
        <div className="space-y-4">
          {/* Add block */}
          <div className="bg-white rounded-2xl border border-[#a1dd70]/30 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Block a Day Off</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="date"
                value={newBlockDate}
                min={today}
                onChange={(e) => setNewBlockDate(e.target.value)}
                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#ff6b4a] text-gray-800"
              />
              <input
                type="text"
                value={newBlockReason}
                onChange={(e) => setNewBlockReason(e.target.value)}
                placeholder="Reason (optional)"
                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#ff6b4a] text-gray-800 placeholder-gray-400"
              />
              <button
                onClick={handleBlockDay}
                disabled={!newBlockDate || blockingDay}
                className="px-5 py-2.5 bg-[#ff6b4a] text-white rounded-xl font-semibold disabled:opacity-40 hover:bg-[#e55a3a] transition-colors whitespace-nowrap"
              >
                {blockingDay ? 'Blocking…' : 'Block Day'}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1,2].map(i => <div key={i} className="h-14 bg-[#f6edd3] rounded-xl animate-pulse" />)}
            </div>
          ) : blockedDays.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="font-medium">No days are currently blocked</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#a1dd70]/30 overflow-hidden shadow-sm divide-y divide-gray-100">
              {[...blockedDays].sort((a, b) => a.date.localeCompare(b.date)).map((bd) => {
                const isPast = bd.date < today;
                return (
                  <div key={bd.date} className={`px-4 py-3.5 flex items-center justify-between gap-3 ${isPast ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{formatDateDisplay(bd.date)}</p>
                        {bd.reason && <p className="text-xs text-gray-400">{bd.reason}</p>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnblockDay(bd.date)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#799351] border-2 border-[#799351] rounded-full hover:bg-[#799351] hover:text-white transition-colors"
                    >
                      Unblock
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: 'orange' | 'green' | 'red' }) {
  const colors = {
    orange: 'bg-[#ff6b4a]/10 text-[#ff6b4a]',
    green: 'bg-[#a1dd70]/20 text-[#799351]',
    red: 'bg-red-50 text-red-500',
  };
  return (
    <div className="bg-white rounded-xl border border-[#a1dd70]/30 p-4 shadow-sm">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') setAuthed(true);
    setChecked(true);
  }, []);

  const signOut = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  if (!checked) return null;

  return authed ? (
    <Dashboard onSignOut={signOut} />
  ) : (
    <PinScreen onSuccess={() => setAuthed(true)} />
  );
}
