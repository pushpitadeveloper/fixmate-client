"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Booking = {
  _id: string;
  serviceTitle?: string;
  serviceName?: string;
  title?: string;
  date?: string;
  status?: string;
  price?: number;
  amount?: number;
  address?: string;
  phone?: string;
  paymentStatus?: string;
};

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/bookings", {
          credentials: "include",
        });
        const d = await res.json();
        // FIX: backend jai dik na keno - array baniye nibo
        const list = Array.isArray(d) ? d : d.bookings || d.data || d.result || [];
        setBookings(Array.isArray(list) ? list : []);
      } catch (e: any) {
        setError("Could not load bookings. Please refresh.");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const total = bookings.length;
  const pending = bookings.filter((b) => (b.status || "").toLowerCase().includes("pend")).length;
  const completed = bookings.filter((b) => (b.status || "").toLowerCase().includes("complet") || (b.status || "").toLowerCase().includes("done")).length;
  const paid = bookings.filter((b) => (b.paymentStatus || "").toLowerCase().includes("paid")).length;

  function statusColor(status: string) {
    const s = status.toLowerCase();
    if (s.includes("complet") || s.includes("done")) return "bg-emerald-100 text-emerald-700";
    if (s.includes("pend")) return "bg-yellow-100 text-yellow-700";
    if (s.includes("cancel")) return "bg-red-100 text-red-700";
    if (s.includes("confirm")) return "bg-blue-100 text-blue-700";
    return "bg-slate-100 text-slate-700";
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-blue-600 text-xs font-bold tracking-widest">CUSTOMER DASHBOARD</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-1">My Bookings</h1>
          <p className="text-slate-500 text-sm mt-1">Track your repairs, pay and see status.</p>
        </div>
        <Link href="/services" className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold">Book New Service</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-white border rounded-3xl p-5"><p className="text-xs text-slate-500 font-bold">TOTAL BOOKINGS</p><p className="text-3xl font-extrabold mt-1">{total}</p></div>
        <div className="bg-white border rounded-3xl p-5"><p className="text-xs text-slate-500 font-bold">PENDING</p><p className="text-3xl font-extrabold mt-1 text-yellow-600">{pending}</p></div>
        <div className="bg-white border rounded-3xl p-5"><p className="text-xs text-slate-500 font-bold">COMPLETED</p><p className="text-3xl font-extrabold mt-1 text-emerald-600">{completed}</p></div>
        <div className="bg-white border rounded-3xl p-5"><p className="text-xs text-slate-500 font-bold">PAID</p><p className="text-3xl font-extrabold mt-1 text-blue-600">{paid}</p></div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-44 bg-slate-100 rounded-3xl animate-pulse"></div>)}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 mt-6 text-center">
          <p className="font-bold text-red-700">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-3 px-5 py-2 rounded-full bg-red-600 text-white text-sm font-bold">Refresh</button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white border rounded-3xl p-10 mt-6 text-center">
          <h3 className="font-bold text-xl">No bookings yet</h3>
          <p className="text-slate-500 text-sm mt-1">You have not booked any service yet. Book your first repair now.</p>
          <Link href="/services" className="inline-block mt-5 px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-bold">Browse Services</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {(bookings || []).map((b) => (
            <div key={b._id} className="border rounded-3xl p-5 bg-white shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold leading-snug">{b.serviceTitle || b.serviceName || b.title || "Repair Service"}</h3>
                <span className={"px-3 py-1 rounded-full text-xs font-bold shrink-0 " + statusColor(b.status || "Pending")}>{b.status || "Pending"}</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">Date: {b.date || "Not set"}</p>
              {b.address && <p className="text-sm text-slate-500">Address: {b.address}</p>}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-slate-400">Price</p>
                  <p className="font-extrabold text-lg">{b.price ?? b.amount ?? 0} Tk</p>
                  <p className="text-xs font-bold text-slate-500">Payment: {b.paymentStatus || "Unpaid"}</p>
                </div>
                <Link href={"/payment?bookingId=" + b._id} className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-bold">Pay Now</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
