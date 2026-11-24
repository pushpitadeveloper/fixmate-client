"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function PaymentSuccessContent() {
  const params = useSearchParams();
  const [done, setDone] = useState(false);
  useEffect(() => {
    const session_id = params.get("session_id");
    const bookingId = params.get("bookingId");
    if (!session_id || !bookingId) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/verify?session_id=${session_id}&bookingId=${bookingId}`).then(() => setDone(true));
  }, [params]);
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-green-600">Payment Success!</h1>
      <p className="text-gray-600 mt-3">Tomar payment hoye gese. {done ? "Booking update hoye gese." : "Updating..."}</p>
      <Link href="/dashboard/customer" className="inline-block mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-lg">Dashboard e Jao</Link>
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
