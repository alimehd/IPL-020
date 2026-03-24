import { Suspense } from 'react';
import Link from 'next/link';
import BookingForm from '@/components/BookingForm';

export const metadata = {
  title: 'Book Appointment — PWT Jaanimmarik Garage',
};

export default function BookPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-[#799351] hover:text-[#ff6b4a] transition-colors text-sm flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Schedule
        </Link>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-[#ff6b4a]">Book an Appointment</h2>
        <p className="text-[#799351] mt-1">
          PWT Jaanimmarik Garage · Open 9&nbsp;AM – 4&nbsp;PM
        </p>
      </div>

      <Suspense fallback={<div className="text-center py-12 text-[#799351]">Loading...</div>}>
        <BookingForm />
      </Suspense>
    </div>
  );
}
