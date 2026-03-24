import Link from 'next/link';
import Schedule from '@/components/Schedule';
import { SERVICES } from '@/lib/services';
import { formatDuration } from '@/lib/services';

const VEHICLES = [
  { type: 'skidoo', label: 'Ski-Doo', icon: '🛷', color: '#ff6b4a' },
  { type: 'honda', label: 'Honda', icon: '🏍️', color: '#799351' },
  { type: 'car', label: 'Car', icon: '🚗', color: '#799351' },
  { type: 'truck', label: 'Truck', icon: '🚛', color: '#ff6b4a' },
];

export default function Home() {
  return (
    <div className="space-y-10">
      {/* Hero */}
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

      {/* Live Schedule */}
      <section>
        <Schedule />
      </section>

      {/* Vehicles */}
      <section>
        <h3 className="text-xl font-bold text-[#799351] mb-4">
          We Service
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {VEHICLES.map((v) => (
            <Link
              key={v.type}
              href={`/book?vehicle=${v.type}`}
              className="bg-white rounded-2xl p-5 text-center border-2 border-[#a1dd70]/30 hover:border-[#ff6b4a] hover:shadow-md transition-all group"
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                {v.icon}
              </div>
              <p className="font-semibold text-gray-800">{v.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Services */}
      <section>
        <h3 className="text-xl font-bold text-[#799351] mb-4">
          Our Services
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((svc) => (
            <div
              key={svc.id}
              className="bg-white rounded-xl p-4 border border-[#a1dd70]/30 hover:border-[#ff6b4a]/40 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-gray-800 leading-tight">
                  {svc.name}
                </p>
                <span className="flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-[#f6edd3] text-[#ff6b4a] border border-[#ff6b4a]/20">
                  {formatDuration(svc.durationMinutes)}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2.5">
                {svc.vehicles.map((v) => (
                  <span
                    key={v}
                    className="text-xs px-2 py-0.5 rounded-full bg-[#a1dd70]/20 text-[#799351] font-medium capitalize"
                  >
                    {v === 'skidoo' ? 'Ski-Doo' : v}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info banner */}
      <section className="bg-[#799351] rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-bold text-lg">Need to call ahead?</p>
          <p className="text-[#a1dd70] text-sm mt-0.5">
            Reach us at the school number to reserve your spot.
          </p>
        </div>
        <a
          href="tel:8199642961"
          className="flex-shrink-0 px-6 py-3 bg-[#ff6b4a] text-white rounded-full font-bold hover:bg-[#e55a3a] transition-colors text-lg"
        >
          📞 (819) 964-2961
        </a>
      </section>
    </div>
  );
}
