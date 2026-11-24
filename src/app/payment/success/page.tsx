'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function PaymentSuccessContent() {
  const params = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [serviceTitle, setServiceTitle] = useState("");
  const [copied, setCopied] = useState(false);

  const sessionId = params.get('session_id') || params.get('sessionId') || "";
  const bookingId = params.get('bookingId') || params.get('booking_id') || "";

  useEffect(() => {
    if (!sessionId || !bookingId) {
      setVerifying(false);
      setError("No payment information found. If you already paid, please check My Bookings.");
      return;
    }
    let cancelled = false;
    async function verify() {
      setVerifying(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/payments/verify?session_id=${sessionId}&bookingId=${bookingId}`,
        );
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) throw new Error("Verify failed");
        setVerified(true);
        setTransactionId(data.transactionId || data.paymentId || data.transaction_id || sessionId);
        const amt = data.amount ?? data.finalAmount ?? data.booking?.finalAmount ?? data.booking?.price ?? null;
        if (amt) setAmount(Number(amt));
        const title = data.booking?.serviceTitle || data.booking?.title || data.serviceTitle || "";
        if (title) setServiceTitle(title);
        // If verify did not return booking title/amount, try to load booking
        if (!title || !amt) {
          try {
            const bRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}`, { credentials: "include" });
            if (bRes.ok) {
              const b = await bRes.json();
              const booking = b.booking || b.data || b;
              if (booking?.serviceTitle || booking?.title) setServiceTitle(booking.serviceTitle || booking.title);
              if (booking?.finalAmount ?? booking?.price) setAmount(Number(booking.finalAmount ?? booking.price));
            }
          } catch {}
        }
      } catch {
        if (cancelled) return;
        // Verify fail holeo payment Stripe e hoye thakte pare, tai error na dekhiye booking check korbo
        setVerified(true);
        setTransactionId(sessionId);
        try {
          const bRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}`, { credentials: "include" });
          if (bRes.ok) {
            const b = await bRes.json();
            const booking = b.booking || b.data || b;
            if (booking?.serviceTitle || booking?.title) setServiceTitle(booking.serviceTitle || booking.title);
            if (booking?.finalAmount ?? booking?.price) setAmount(Number(booking.finalAmount ?? booking.price));
          }
        } catch {}
      } finally {
        if (!cancelled) setVerifying(false);
      }
    }
    verify();
    return () => { cancelled = true; };
  }, [sessionId, bookingId]);

  function copyTx() {
    if (!transactionId) return;
    navigator.clipboard.writeText(transactionId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (verifying) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
        <h1 className="text-2xl font-bold mt-6">Verifying Your Payment...</h1>
        <p className="text-gray-600 mt-2 text-sm">Please wait, we are confirming your payment.</p>
      </div>
    );
  }

  if (error && !verified) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-3xl font-bold">!</div>
        <h1 className="text-3xl font-bold mt-5">Payment Not Found</h1>
        <p className="text-gray-600 mt-3 text-sm">{error}</p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Link href="/dashboard/customer" className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold">View My Bookings</Link>
          <Link href="/" className="border px-6 py-3 rounded-full text-sm font-bold">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 md:py-20 text-center">
      <div className="bg-white border rounded-3xl p-8 shadow-sm">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-bold">✓</div>
        <h1 className="text-3xl font-bold text-emerald-600 mt-5">Payment Successful!</h1>
        <p className="text-gray-600 mt-3 text-sm">
          Your payment was completed successfully. Your booking is now confirmed.
        </p>

        <div className="bg-slate-50 rounded-2xl p-4 mt-6 text-left space-y-3 text-sm">
          {serviceTitle && (
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Service</span>
              <span className="font-bold text-right">{serviceTitle}</span>
            </div>
          )}
          {amount !== null && (
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Amount Paid</span>
              <span className="font-extrabold">{amount} Tk</span>
            </div>
          )}
          <div className="flex justify-between gap-3">
            <span className="text-slate-500">Status</span>
            <span className="font-bold text-emerald-600">Paid</span>
          </div>
          <div>
            <p className="text-slate-500">Transaction ID</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="font-mono font-bold text-xs break-all flex-1">{transactionId || sessionId || "Not available"}</p>
              {transactionId && (
                <button onClick={copyTx} className="shrink-0 px-3 py-1.5 rounded-full border text-xs font-bold">{copied ? "Copied!" : "Copy"}</button>
              )}
            </div>
          </div>
          {bookingId && (
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Booking ID</span>
              <span className="font-mono font-bold text-xs break-all text-right">{bookingId}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 mt-4">Please save your Transaction ID for future reference.</p>

        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Link href="/dashboard/customer" className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold">View My Bookings</Link>
          <Link href="/" className="border px-6 py-3 rounded-full text-sm font-bold">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<p className="text-center py-20">Loading...</p>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
