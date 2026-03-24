'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { VehicleType } from '@/lib/types';
import { getServicesForVehicle, VEHICLE_LABELS, VEHICLE_ICONS, formatDuration, getServiceById } from '@/lib/services';
import { addMinutes, formatTime12, getAvailableSlots, getTodayString, isWeekend, nextWeekday, getTomorrowWeekday } from '@/lib/timeUtils';
import { fetchAppointments, createAppointment, fetchBlockedDays } from '@/lib/api';
import { v4 as uuidv4 } from 'uuid';

const VEHICLES: VehicleType[] = ['skidoo', 'honda', 'car', 'truck'];

export default function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(1);
  const [vehicleType, setVehicleType] = useState<VehicleType | null>(null);
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState(() => {
    const param = searchParams.get('date');
    const candidate = param && param > getTodayString() ? param : getTomorrowWeekday();
    return nextWeekday(candidate);
  });
  const [startTime, setStartTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedReason, setBlockedReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const service = serviceId ? getServiceById(serviceId) : null;

  useEffect(() => {
    if (!date) return;

    // Weekends are always closed
    if (isWeekend(date)) {
      setIsBlocked(true);
      setBlockedReason('The garage is closed on Saturdays and Sundays.');
      setAvailableSlots([]);
      setStartTime('');
      return;
    }

    fetchBlockedDays().then((blocked) => {
      const found = blocked.find((b) => b.date === date);
      if (found) {
        setIsBlocked(true);
        setBlockedReason(found.reason || '');
        setAvailableSlots([]);
        setStartTime('');
      } else {
        setIsBlocked(false);
        setBlockedReason('');
        if (service) {
          fetchAppointments(date).then((all) => {
            const slots = getAvailableSlots(all, date, service.durationMinutes);
            setAvailableSlots(slots);
            setStartTime('');
          });
        }
      }
    });
  }, [date, service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleType || !serviceId || !startTime || !service) return;

    setLoading(true);
    const endTime = addMinutes(startTime, service.durationMinutes);
    const breakEndTime = addMinutes(endTime, 30);

    const appointment = {
      id: uuidv4(),
      date,
      startTime,
      endTime,
      breakEndTime,
      serviceId: service.id,
      vehicleType,
      clientName,
      clientPhone,
      notes,
      createdAt: new Date().toISOString(),
    };

    await createAppointment(appointment);
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted && service && vehicleType) {
    const endTime = addMinutes(startTime, service.durationMinutes);
    return (
      <div className="bg-white rounded-2xl shadow-md border border-[#a1dd70]/40 p-8 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-[#a1dd70] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#799351] mb-2">Appointment Booked!</h2>
        <p className="text-gray-500 mb-6 text-sm">Your appointment has been confirmed.</p>

        <div className="bg-[#f6edd3] rounded-xl p-4 text-left space-y-2 text-sm mb-6">
          <Row label="Service" value={service.name} />
          <Row label="Vehicle" value={`${VEHICLE_ICONS[vehicleType]} ${VEHICLE_LABELS[vehicleType]}`} />
          <Row label="Date" value={new Date(date + 'T12:00:00').toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} />
          <Row label="Time" value={`${formatTime12(startTime)} – ${formatTime12(endTime)}`} />
          <Row label="Client" value={clientName} />
          {clientPhone && <Row label="Phone" value={clientPhone} />}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              setStep(1); setVehicleType(null); setServiceId(''); setStartTime('');
              setClientName(''); setClientPhone(''); setNotes(''); setSubmitted(false);
            }}
            className="px-5 py-2.5 border-2 border-[#799351] text-[#799351] rounded-full font-semibold hover:bg-[#799351] hover:text-white transition-colors"
          >
            Book Another
          </button>
          <button
            onClick={() => router.push(`/?date=${date}`)}
            className="px-5 py-2.5 bg-[#ff6b4a] text-white rounded-full font-semibold hover:bg-[#e55a3a] transition-colors"
          >
            View Schedule
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-[#a1dd70]/40 overflow-hidden max-w-2xl mx-auto">
      {/* Step header */}
      <div className="bg-[#799351] px-6 py-5">
        <h2 className="text-white font-bold text-xl mb-3">Book an Appointment</h2>
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step >= s
                    ? 'bg-[#ff6b4a] text-white'
                    : 'bg-white/20 text-white/60'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
              <span className={`text-xs ${step >= s ? 'text-white' : 'text-white/50'}`}>
                {s === 1 ? 'Vehicle & Service' : s === 2 ? 'Date & Time' : 'Your Info'}
              </span>
              {s < 3 && <div className="w-6 h-px bg-white/30" />}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* STEP 1: Vehicle & Service */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Vehicle Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {VEHICLES.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => { setVehicleType(v); setServiceId(''); }}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all font-medium text-sm ${
                      vehicleType === v
                        ? 'border-[#ff6b4a] bg-[#ff6b4a]/8 text-[#ff6b4a]'
                        : 'border-gray-200 hover:border-[#a1dd70] text-gray-700'
                    }`}
                  >
                    <span className="text-2xl">{VEHICLE_ICONS[v]}</span>
                    <span>{VEHICLE_LABELS[v]}</span>
                  </button>
                ))}
              </div>
            </div>

            {vehicleType && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Service
                </label>
                <div className="space-y-2">
                  {getServicesForVehicle(vehicleType).map((svc) => (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => { setServiceId(svc.id); setStep(2); }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-sm ${
                        serviceId === svc.id
                          ? 'border-[#ff6b4a] bg-[#ff6b4a]/8'
                          : 'border-gray-200 hover:border-[#a1dd70]'
                      }`}
                    >
                      <span className={`font-medium ${serviceId === svc.id ? 'text-[#ff6b4a]' : 'text-gray-800'}`}>
                        {svc.name}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        serviceId === svc.id
                          ? 'bg-[#ff6b4a] text-white'
                          : 'bg-[#f6edd3] text-[#799351]'
                      }`}>
                        {formatDuration(svc.durationMinutes)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={!vehicleType || !serviceId}
              onClick={() => setStep(2)}
              className="w-full py-3 bg-[#ff6b4a] text-white rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#e55a3a] transition-colors"
            >
              Next: Choose Date & Time →
            </button>
          </div>
        )}

        {/* STEP 2: Date & Time */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={date}
                min={getTomorrowWeekday()}
                onChange={(e) => {
                  const picked = e.target.value;
                  setDate(isWeekend(picked) ? nextWeekday(picked) : picked);
                }}
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#ff6b4a] text-gray-800"
              />
              <p className="text-xs text-[#799351]/70 mt-1">Open Monday – Friday only</p>
            </div>

            {isBlocked ? (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                <span className="text-red-400 text-xl flex-shrink-0">🚫</span>
                <div>
                  <p className="font-semibold text-red-600 text-sm">This day is not available</p>
                  <p className="text-red-400 text-xs mt-0.5">
                    {blockedReason || 'The garage is closed on this day.'} Please choose a different date.
                  </p>
                </div>
              </div>
            ) : service && (
              <div className="bg-[#f6edd3] rounded-xl p-3 text-sm flex items-center gap-2">
                <span className="text-[#ff6b4a]">⏱</span>
                <span className="text-gray-700">
                  <strong>{service.name}</strong> takes{' '}
                  <strong>{formatDuration(service.durationMinutes)}</strong>
                </span>
              </div>
            )}

            {!isBlocked && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Available Time Slots
              </label>
              {availableSlots.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  <p className="font-medium">No slots available for this day</p>
                  <p className="text-sm mt-1">Try selecting a different date</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-1">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setStartTime(slot)}
                      className={`py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                        startTime === slot
                          ? 'border-[#ff6b4a] bg-[#ff6b4a] text-white'
                          : 'border-[#a1dd70] text-[#799351] hover:bg-[#a1dd70] hover:text-white hover:border-[#a1dd70]'
                      }`}
                    >
                      {formatTime12(slot)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:border-[#799351] hover:text-[#799351] transition-colors"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={!startTime || isBlocked}
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-[#ff6b4a] text-white rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#e55a3a] transition-colors"
              >
                Next: Your Info →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Client Info */}
        {step === 3 && (
          <div className="space-y-5">
            {/* Booking summary */}
            <div className="bg-[#f6edd3] rounded-xl p-4 space-y-1.5 text-sm">
              <p className="font-semibold text-[#799351] mb-2">Booking Summary</p>
              <Row label="Vehicle" value={`${vehicleType ? VEHICLE_ICONS[vehicleType] : ''} ${vehicleType ? VEHICLE_LABELS[vehicleType] : ''}`} />
              <Row label="Service" value={service?.name || ''} />
              <Row label="Duration" value={service ? formatDuration(service.durationMinutes) : ''} />
              <Row label="Date" value={new Date(date + 'T12:00:00').toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })} />
              <Row label="Time" value={startTime ? `${formatTime12(startTime)} – ${service ? formatTime12(addMinutes(startTime, service.durationMinutes)) : ''}` : ''} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full Name <span className="text-[#ff6b4a]">*</span>
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                placeholder="Your name"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#ff6b4a] text-gray-800 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Phone Number <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="(819) 000-0000"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#ff6b4a] text-gray-800 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Notes <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Any additional details about your vehicle or service needs..."
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#ff6b4a] text-gray-800 placeholder-gray-400 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:border-[#799351] hover:text-[#799351] transition-colors"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={!clientName || loading}
                className="flex-1 py-3 bg-[#ff6b4a] text-white rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#e55a3a] transition-colors"
              >
                {loading ? 'Booking...' : 'Confirm Booking ✓'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 text-right">{value}</span>
    </div>
  );
}
