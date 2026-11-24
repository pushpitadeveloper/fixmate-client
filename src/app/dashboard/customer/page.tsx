'use client';
import { useSession } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CustomerDashboard() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.push('/signin');
      return;
    }
    (async () => {
      const tokenRes = await fetch('/api/auth/token');
      const tokenData = await tokenRes.json();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/my`, {
        headers: { Authorization: `Bearer ${tokenData.token}` },
      });
      const data = await res.json();
      setBookings(data);
    })();
  }, [session, isPending, router]);

  async function handlePay(bookingId: string, price: number) {
    const tokenRes = await fetch('/api/auth/token');
    const tokenData = await tokenRes.json();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenData.token}` },
      body: JSON.stringify({ bookingId }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert('Payment start hoy nai, abar try koro');
  }

  if (isPending) return <p className="text-center py-20">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold">Amar Bookings</h1>
      <p className="text-sm text-gray-500 mt-1">Welcome, {session?.user?.name}</p>
      <Link
        href="/services"
        className="inline-block mt-4 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg"
      >
        Notun Booking Koro
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {bookings.map(b => (
          <div key={b._id} className="border rounded-xl p-4 bg-white shadow-sm">
            <h3 className="font-bold">{b.serviceTitle}</h3>
            <p className="text-sm text-gray-500 mt-1">Date: {b.date}</p>
            <p className="text-sm text-gray-500">Address: {b.address}</p>
            <p className="text-sm mt-2">
              Status: <span className="font-bold text-blue-600">{b.status}</span>
            </p>
            <p className="text-sm">
              Payment: <span className="font-bold">{b.paymentStatus}</span>
            </p>
            <p className="font-bold mt-2">৳ {b.price}</p>
            {b.paymentStatus !== 'paid' && b.status === 'completed' && (
              <button
                onClick={() => handlePay(b._id, b.price)}
                className="mt-3 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2.5 rounded-lg w-full font-medium"
              >
                Pay Now - ৳ {b.price}
              </button>
            )}
            {b.paymentStatus === 'paid' && (
              <p className="mt-3 bg-green-100 text-green-700 text-sm text-center py-2 rounded-lg font-medium">
                Paid ✓
              </p>
            )}
          </div>
        ))}
      </div>
      {bookings.length === 0 && (
        <p className="text-center text-gray-500 mt-10">Ekhono kono booking nai.</p>
      )}
    </div>
  );
}
