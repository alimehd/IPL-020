import Link from 'next/link';
import Schedule from '@/components/Schedule';
import { SERVICES, formatDuration } from '@/lib/services';

const SERVICE_ICONS: Record<string, string> = {
  'oil-change': '🛢️',
  'tire-appointment': '🔧',
  'changing-skis': '⛷️',
  'spark-plugs': '⚡',
  'case-oil': '🔩',
  'gas-filters': '⛽',
  'air-filters': '💨',
  'kill-switch': '🔌',
  'rims': '⭕',
};

export default function Home() {
  return (
    <div className="space-y-8 sm:space-y-10">

      {/* ── Hero ── */}
      <section className="text-center py-4 sm:py-6">
        <h2 className="text-2xl sm:text-4xl font-bold text-[#ff6b4a] mb-2 sm:mb-3">
          Garage Appointment Booking
        </h2>
        <p className="text-[#799351] text-base sm:text-lg max-w-xl mx-auto mb-5">
          Book your next vehicle service at IPL Jaanimmarik Garage in Kuujjuaq.
          Open Monday – Friday, 9&nbsp;AM – 4&nbsp;PM.
        </p>
        <Link
          href="/book"
          className="inline-block px-7 py-3 sm:px-8 sm:py-3.5 bg-[#ff6b4a] text-white rounded-full text-base sm:text-lg font-bold shadow-md hover:bg-[#e55a3a] hover:shadow-lg transition-all"
        >
          Book Now
        </Link>
      </section>

      {/* ── Services Banner ── */}
      <section className="bg-[#799351] rounded-2xl overflow-hidden">
        <div className="px-5 sm:px-8 py-5 border-b border-white/10">
          <h3 className="text-white font-bold text-lg tracking-tight">Our Services</h3>
          <p className="text-[#a1dd70] text-xs mt-0.5">Ski-Doo · Honda · Car · Truck</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-px bg-white/10">
          {SERVICES.map((svc) => (
            <Link
              key={svc.id}
              href={`/book`}
              className="bg-[#799351] hover:bg-[#6b8448] transition-colors px-4 sm:px-6 py-4 flex items-center gap-3 group"
            >
              <span className="text-2xl sm:text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                {SERVICE_ICONS[svc.id]}
              </span>
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm leading-tight truncate">
                  {svc.name}
                </p>
                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff6b4a] text-white">
                  {formatDuration(svc.durationMinutes)}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="px-5 sm:px-8 py-3 bg-[#6b8448]">
          <p className="text-[#a1dd70] text-xs text-center">
            All bookings include a recovery break between appointments
          </p>
        </div>
      </section>

      {/* ── Weekly Schedule ── */}
      <section>
        <Schedule />
      </section>

      {/* ── Call banner ── */}
      <section className="bg-[#ff6b4a] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-bold text-white text-lg">Prefer to call?</p>
          <p className="text-white/80 text-sm mt-0.5">
            Reach us at the school to reserve your spot.
          </p>
        </div>
        <a
          href="tel:8199642961"
          className="flex-shrink-0 px-6 py-3 bg-white text-[#ff6b4a] rounded-full font-bold hover:bg-[#f6edd3] transition-colors text-base"
        >
          📞 (819) 964-2961
        </a>
      </section>

    </div>
  );
}
