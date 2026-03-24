'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SCHOOL_PHONE } from '@/lib/types';

export default function Header() {
  return (
    <header className="bg-[#f6edd3] border-b-4 border-[#ff6b4a] shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4">
        {/* Top row: logo + title + nav */}
        <div className="flex items-center justify-between gap-3">
          {/* Logo + name */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="IPL Jaanimmarik Garage Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#ff6b4a] leading-tight">
                IPL Jaanimmarik
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[#799351] tracking-wide uppercase">
                Garage — Kuujjuaq
              </p>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-3 text-sm font-medium">
            <Link
              href="/"
              className="px-4 py-2 rounded-full text-[#799351] hover:bg-[#a1dd70] hover:text-white transition-colors duration-200"
            >
              Schedule
            </Link>
            <Link
              href="/book"
              className="px-5 py-2 rounded-full bg-[#ff6b4a] text-white hover:bg-[#e55a3a] transition-colors duration-200 font-semibold shadow"
            >
              Book Now
            </Link>
            <a
              href={`tel:${SCHOOL_PHONE.replace(/\D/g, '')}`}
              className="px-4 py-2 rounded-full border-2 border-[#799351] text-[#799351] hover:bg-[#799351] hover:text-white transition-colors duration-200 flex items-center gap-1.5"
            >
              <PhoneIcon />
              {SCHOOL_PHONE}
            </a>
            <Link
              href="/admin"
              className="px-4 py-2 rounded-full border-2 border-[#799351] text-[#799351] hover:bg-[#799351] hover:text-white transition-colors duration-200 flex items-center gap-1.5"
              title="Admin Panel"
            >
              <GearIcon />
            </Link>
          </nav>

          {/* Mobile: Book + gear buttons */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href={`tel:${SCHOOL_PHONE.replace(/\D/g, '')}`}
              className="p-2 rounded-full border-2 border-[#799351] text-[#799351]"
              aria-label={`Call ${SCHOOL_PHONE}`}
            >
              <PhoneIcon />
            </a>
            <Link
              href="/admin"
              className="p-2 rounded-full border-2 border-[#799351] text-[#799351]"
              aria-label="Admin"
            >
              <GearIcon />
            </Link>
            <Link
              href="/book"
              className="px-4 py-2 rounded-full bg-[#ff6b4a] text-white text-sm font-bold shadow"
            >
              Book
            </Link>
          </div>
        </div>

        {/* Mobile bottom row: phone number text */}
        <div className="sm:hidden flex justify-center mt-2">
          <a
            href={`tel:${SCHOOL_PHONE.replace(/\D/g, '')}`}
            className="text-xs text-[#799351] font-medium flex items-center gap-1"
          >
            <PhoneIcon />
            {SCHOOL_PHONE}
          </a>
        </div>
      </div>
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.5 11.5 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.5 11.5 0 00.57 3.6 1 1 0 01-.25 1.01l-2.2 2.18z" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
