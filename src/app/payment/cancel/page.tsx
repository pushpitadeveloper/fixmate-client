"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentCancelContent() {
  const params = useSearchParams();
  const bookingId = params.get("bookingId") || params.get("booking_id") || "";
  const retryHref = bookingId ? `/payment?bookingId=${bookingId}` : "/dashboard/customer";

  return (
    <div className="max-w-md mx-auto px-4 py-16 md:py-20 text-center">
      <div className="bg-white border rounded-3xl p-8 shadow-sm">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-100 text-red-500 flex items-center justify-center text-3xl font-bold">×</div>
        <h1 className="text-3xl font-bold text-red-500 mt-5">Payment Cancelled</h1>
        <p className="text-gray-600 mt-3 text-sm">
          Your payment was cancelled. No money was charged. You can try again anytime.
        </p>

        {bookingId && (
          <div className="bg-slate-50 rounded-2xl p-4 mt-6 text-left">
            <p className="text-slate-500 text-sm">Booking ID</p>
            <p className="font-mono font-bold text-xs break-all mt-1">{bookingId}</p>
            <p className="text-xs text-slate-400 mt-2">Your booking is still saved. You can complete the payment from My Bookings.</p>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Link href={retryHref} className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold">
            Try Payment Again
          </Link>
          <Link href="/dashboard/customer" className="border px-6 py-3 rounded-full text-sm font-bold">
            View My Bookings
          </Link>
          <Link href="/" className="border px-6 py-3 rounded-full text-sm font-bold">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<p className="text-center py-20">Loading...</p>}>
      <PaymentCancelContent />
    </Suspense>
  );
}
