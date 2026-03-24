'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Appointment, GARAGE_CLOSE, GARAGE_OPEN } from '@/lib/types';
import { getServiceById, VEHICLE_LABELS, VEHICLE_ICONS } from '@/lib/services';
import {
  formatTime12,
  getScheduleBlocks,
  getTodayString,
  getWeekDates,
  isPastDate,
  timeToMinutes,
} from '@/lib/timeUtils';
import { deleteAppointment, loadAppointments } from '@/lib/store';

const TOTAL_MINUTES = timeToMinutes(GARAGE_CLOSE) - timeToMinutes(GARAGE_OPEN);
const OPEN_MIN = timeToMinutes(GARAGE_OPEN);

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function HourMarkers() {
  const markers = [];
  const openH = parseInt(GARAGE_OPEN.split(':')[0]);
  const closeH = parseInt(GARAGE_CLOSE.split(':')[0]);
  for (let h = openH; h <= closeH; h++) {
    const time = `${String(h).padStart(2, '0')}:00`;
    const pct = ((timeToMinutes(time) - OPEN_MIN) / TOTAL_MINUTES) * 100;
    markers.push({ pct, label: formatTime12(time) });
  }
  return (
    <>
      {markers.map(({ pct, label }) => (
        <div
          key={label}
          className="absolute top-0 bottom-0"
          style={{ left: `${pct}%` }}
        >
          <div className="w-px h-full bg-[#799351]/15" />
          <span className="absolute -bottom-5 text-[9px] text-[#799351]/60 whitespace-nowrap -translate-x-1/2 hidden sm:block">
            {label}
          </span>
        </div>
      ))}
    </>
  );
}

interface AppointmentBlockProps {
  block: ReturnType<typeof getScheduleBlocks>[0];
  onDelete: (id: string) => void;
}

function AppointmentBlock({ block, onDelete }: AppointmentBlockProps) {
  const { appointment: appt, startPct, servicePct } = block;
  const service = getServiceById(appt.serviceId);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className="absolute top-0 h-full"
      style={{ left: `${startPct}%`, width: `${servicePct}%` }}
    >
      <div
        className="h-full bg-[#ff6b4a] cursor-pointer rounded-md overflow-hidden relative"
        onClick={() => setShowDetails((v) => !v)}
      >
        <div className="px-1.5 py-1 h-full flex flex-col justify-center">
          <p className="text-white text-[10px] font-bold truncate leading-tight">
            {service?.name}
          </p>
          <p className="text-white/80 text-[9px] truncate hidden sm:block">
            {VEHICLE_LABELS[appt.vehicleType]}
          </p>
        </div>

        {showDetails && (
          <div
            className="absolute top-full left-0 mt-1 z-40 bg-white border border-[#ff6b4a] rounded-xl shadow-2xl p-3 w-52 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-bold text-[#ff6b4a] mb-2">{service?.name}</div>
            <div className="text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Vehicle:</span>{' '}
                {VEHICLE_ICONS[appt.vehicleType]} {VEHICLE_LABELS[appt.vehicleType]}
              </p>
              <p>
                <span className="font-medium">Client:</span> {appt.clientName}
              </p>
              {appt.clientPhone && (
                <p>
                  <span className="font-medium">Phone:</span> {appt.clientPhone}
                </p>
              )}
              <p>
                <span className="font-medium">Time:</span>{' '}
                {formatTime12(appt.startTime)} – {formatTime12(appt.endTime)}
              </p>
              {appt.notes && (
                <p>
                  <span className="font-medium">Notes:</span> {appt.notes}
                </p>
              )}
            </div>
            <button
              onClick={() => { onDelete(appt.id); setShowDetails(false); }}
              className="mt-2 w-full text-center text-red-500 hover:text-red-700 text-[10px] font-medium border border-red-200 rounded-lg py-1 hover:bg-red-50 transition-colors"
            >
              Cancel Appointment
            </button>
            <button
              onClick={() => setShowDetails(false)}
              className="mt-1 w-full text-center text-gray-400 text-[10px]"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface DayTimelineProps {
  date: string;
  appointments: Appointment[];
  onDelete: (id: string) => void;
}

function DayTimeline({ date, appointments, onDelete }: DayTimelineProps) {
  const blocks = getScheduleBlocks(appointments);

  // Free slots for background shading
  const bookedRanges = appointments
    .map((a) => ({ start: timeToMinutes(a.startTime), end: timeToMinutes(a.breakEndTime) }))
    .sort((a, b) => a.start - b.start);
  const freeSlots: { start: number; end: number }[] = [];
  const closeMin = timeToMinutes(GARAGE_CLOSE);
  let cursor = OPEN_MIN;
  for (const r of bookedRanges) {
    if (cursor < r.start) freeSlots.push({ start: cursor, end: r.start });
    cursor = Math.max(cursor, r.end);
  }
  if (cursor < closeMin) freeSlots.push({ start: cursor, end: closeMin });

  return (
    <div className="relative h-10 sm:h-12">
      {/* Track */}
      <div className="absolute inset-0 bg-[#f6edd3] rounded-lg overflow-hidden border border-[#a1dd70]/30">
        {isPastDate(date) && (
          <div className="absolute inset-0 bg-gray-200/60" />
        )}
        {!isPastDate(date) && freeSlots.map((slot, i) => {
          const startPct = ((slot.start - OPEN_MIN) / TOTAL_MINUTES) * 100;
          const widthPct = ((slot.end - slot.start) / TOTAL_MINUTES) * 100;
          return (
            <div
              key={i}
              className="absolute top-0 h-full bg-[#a1dd70]/30"
              style={{ left: `${startPct}%`, width: `${widthPct}%` }}
            />
          );
        })}
      </div>

      {/* Hour markers */}
      <div className="absolute inset-0 overflow-visible">
        <HourMarkers />
      </div>

      {/* Appointment blocks */}
      <div className="absolute inset-0 overflow-visible">
        {blocks.map((block) => (
          <AppointmentBlock key={block.appointment.id} block={block} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}

export default function Schedule() {
  const today = getTodayString();
  const [weekAnchor, setWeekAnchor] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);

  const reload = useCallback(() => {
    setAllAppointments(loadAppointments());
  }, []);

  useEffect(() => { reload(); }, [reload]);
  useEffect(() => {
    const handler = () => reload();
    window.addEventListener('focus', handler);
    return () => window.removeEventListener('focus', handler);
  }, [reload]);

  const weekDates = getWeekDates(weekAnchor);

  const goWeek = (delta: number) => {
    const d = new Date(weekAnchor + 'T12:00:00');
    d.setDate(d.getDate() + delta * 7);
    setWeekAnchor(d.toISOString().slice(0, 10));
  };

  const handleDelete = (id: string) => {
    deleteAppointment(id);
    reload();
  };

  const dayAppointments = allAppointments.filter((a) => a.date === selectedDate);
  const sortedDayAppts = [...dayAppointments].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  const weekLabel = (() => {
    const first = new Date(weekDates[0] + 'T12:00:00');
    const last = new Date(weekDates[6] + 'T12:00:00');
    const fmt = (d: Date) =>
      d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
    return `${fmt(first)} – ${fmt(last)}, ${first.getFullYear()}`;
  })();

  return (
    <section className="bg-white rounded-2xl shadow-md border border-[#a1dd70]/40 overflow-hidden">
      {/* Week navigation header */}
      <div className="bg-[#799351] px-4 sm:px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => goWeek(-1)}
          className="text-white hover:text-[#a1dd70] p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeft />
        </button>
        <div className="text-center">
          <p className="text-white font-bold text-base sm:text-lg">Weekly Schedule</p>
          <p className="text-[#a1dd70] text-xs sm:text-sm">{weekLabel}</p>
        </div>
        <button
          onClick={() => goWeek(1)}
          className="text-white hover:text-[#a1dd70] p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Next week"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Day selector tabs — horizontally scrollable on mobile */}
      <div className="overflow-x-auto border-b border-[#a1dd70]/20">
        <div className="flex min-w-max px-2 sm:px-4 py-2 gap-1">
          {weekDates.map((date, idx) => {
            const dayNum = new Date(date + 'T12:00:00').getDate();
            const count = allAppointments.filter((a) => a.date === date).length;
            const isSelected = date === selectedDate;
            const isToday = date === today;
            const isPast = isPastDate(date);

            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center px-3 sm:px-4 py-2 rounded-xl transition-all min-w-[52px] sm:min-w-[64px] ${
                  isSelected
                    ? 'bg-[#ff6b4a] text-white shadow'
                    : isPast
                    ? 'text-gray-400'
                    : 'hover:bg-[#f6edd3] text-gray-700'
                }`}
              >
                <span className={`text-[10px] font-semibold uppercase tracking-wide ${isSelected ? 'text-white/80' : isPast ? 'text-gray-400' : 'text-[#799351]'}`}>
                  {DAY_LABELS[idx]}
                </span>
                <span className={`text-lg font-bold leading-tight ${isPast && !isSelected ? 'text-gray-300' : ''}`}>
                  {dayNum}
                </span>
                {isToday && !isSelected && (
                  <span className="w-1 h-1 rounded-full bg-[#ff6b4a] mt-0.5" />
                )}
                {count > 0 && (
                  <span className={`text-[9px] font-bold mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#ff6b4a]'}`}>
                    {count} apt
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day timeline */}
      <div className="px-4 sm:px-6 pt-5 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[#799351] text-sm">
            {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-CA', {
              weekday: 'long', month: 'long', day: 'numeric',
            })}
            {selectedDate === today && (
              <span className="ml-2 text-xs bg-[#ff6b4a] text-white px-2 py-0.5 rounded-full">Today</span>
            )}
          </h3>
          <span className="text-xs text-[#799351]/60">
            {formatTime12(GARAGE_OPEN)} – {formatTime12(GARAGE_CLOSE)}
          </span>
        </div>

        <DayTimeline
          date={selectedDate}
          appointments={allAppointments.filter((a) => a.date === selectedDate)}
          onDelete={handleDelete}
        />

        {/* Hour labels row — visible on larger screens */}
        <div className="relative h-5 mt-1 hidden sm:block">
          {(() => {
            const openH = parseInt(GARAGE_OPEN.split(':')[0]);
            const closeH = parseInt(GARAGE_CLOSE.split(':')[0]);
            return Array.from({ length: closeH - openH + 1 }, (_, i) => {
              const h = openH + i;
              const time = `${String(h).padStart(2, '0')}:00`;
              const pct = ((timeToMinutes(time) - OPEN_MIN) / TOTAL_MINUTES) * 100;
              return (
                <span
                  key={h}
                  className="absolute text-[9px] text-[#799351]/60 -translate-x-1/2"
                  style={{ left: `${pct}%` }}
                >
                  {formatTime12(time)}
                </span>
              );
            });
          })()}
        </div>

        {/* Mobile time range */}
        <div className="flex justify-between text-[9px] text-[#799351]/60 mt-1 sm:hidden">
          <span>{formatTime12(GARAGE_OPEN)}</span>
          <span>{formatTime12(GARAGE_CLOSE)}</span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs mt-3 mb-1 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-3 rounded bg-[#ff6b4a]" />
            <span className="text-gray-400">Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-3 rounded bg-[#a1dd70]/40 border border-[#a1dd70]/40" />
            <span className="text-gray-400">Available</span>
          </div>
        </div>
      </div>

      {/* Day's appointment list */}
      <div className="px-4 sm:px-6 pb-6 pt-2">
        {isPastDate(selectedDate) ? (
          <p className="text-center text-sm text-gray-400 py-4">
            This day has passed.
          </p>
        ) : sortedDayAppts.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-[#799351] font-medium mb-1">No appointments yet</p>
            <p className="text-gray-400 text-xs mb-4">The full day is open.</p>
            <Link
              href={`/book?date=${selectedDate}`}
              className="inline-block px-6 py-2.5 bg-[#ff6b4a] text-white rounded-full font-semibold text-sm hover:bg-[#e55a3a] transition-colors"
            >
              Book an Appointment
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#799351] uppercase tracking-wider mb-2">
              {sortedDayAppts.length} Appointment{sortedDayAppts.length > 1 ? 's' : ''}
            </p>
            {sortedDayAppts.map((appt) => {
              const svc = getServiceById(appt.serviceId);
              return (
                <div
                  key={appt.id}
                  className="flex items-center justify-between bg-[#f6edd3] rounded-xl px-3 sm:px-4 py-3 border border-[#a1dd70]/20 gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-1 h-10 rounded-full bg-[#ff6b4a] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{svc?.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {VEHICLE_ICONS[appt.vehicleType]} {VEHICLE_LABELS[appt.vehicleType]} · {appt.clientName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-[#799351] whitespace-nowrap">
                      {formatTime12(appt.startTime)}
                    </p>
                    <p className="text-[10px] text-gray-400 whitespace-nowrap">
                      – {formatTime12(appt.endTime)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div className="pt-1">
              <Link
                href={`/book?date=${selectedDate}`}
                className="inline-block px-5 py-2 bg-[#ff6b4a] text-white rounded-full text-sm font-semibold hover:bg-[#e55a3a] transition-colors"
              >
                + Add Appointment
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ChevronLeft() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
