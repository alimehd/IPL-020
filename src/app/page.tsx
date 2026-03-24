import Image from 'next/image';
import Link from 'next/link';
import Schedule from '@/components/Schedule';

export default function Home() {
  return (
    <div className="space-y-8 sm:space-y-10">

      {/* ── Hero with garage photo ── */}
      <section className="relative rounded-2xl overflow-hidden shadow-lg" style={{ minHeight: '320px' }}>
        {/* Background photo */}
        <Image
          src="/garage.png"
          alt="PWT Jaanimmarik Garage"
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
        />

        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full px-7 sm:px-12 py-14 sm:py-20 max-w-xl">
          <p className="text-[#a1dd70] text-xs sm:text-sm font-bold uppercase tracking-widest mb-2">
            Kuujjuaq, Nunavik
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-3 sm:mb-4 drop-shadow">
            Garage<br />Appointment<br />Booking
          </h2>
          <p className="text-white/75 text-sm sm:text-base mb-6 leading-relaxed">
            PWT Jaanimmarik Garage · Open Mon – Fri, 9&nbsp;AM – 4&nbsp;PM
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/book"
              className="px-7 py-3 bg-[#ff6b4a] text-white rounded-full font-bold shadow-lg hover:bg-[#e55a3a] hover:shadow-xl transition-all text-sm sm:text-base"
            >
              Book Now
            </Link>
            <a
              href="tel:8199642961"
              className="px-7 py-3 bg-white/15 backdrop-blur-sm text-white rounded-full font-semibold border border-white/30 hover:bg-white/25 transition-all text-sm sm:text-base"
            >
              📞 Call Us
            </a>
          </div>
        </div>
      </section>

      {/* ── Weekly Schedule ── */}
      <section>
        <Schedule />
      </section>

      {/* ── 360° Garage Tour ── */}
      <section className="rounded-2xl overflow-hidden shadow-md border border-[#a1dd70]/30 bg-white">
        <div className="bg-[#799351] px-5 sm:px-8 py-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-white font-bold text-lg leading-tight">
              Tour the Garage in 360°
            </h3>
            <p className="text-[#a1dd70] text-xs mt-0.5">
              Drag to look around inside the garage
            </p>
          </div>
        </div>

        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src="https://panoraven.com/en/embed/Z77oXbfa8R"
            className="absolute inset-0 w-full h-full border-0"
            allow="gyroscope; accelerometer"
            title="PWT Jaanimmarik Garage 360° Tour"
          />
        </div>
      </section>

    </div>
  );
}
