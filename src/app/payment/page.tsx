"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type Booking = {
  _id: string;
  serviceTitle?: string;
  title?: string;
  price?: number;
  date?: string;
  timeSlot?: string;
  paymentStatus?: string;
};

function PaymentContent() {
  const params = useSearchParams();
  const router = useRouter();
  const bookingId = params.get("bookingId") || "";
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("123");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function load() {
      const localList: Booking[] = JSON.parse(localStorage.getItem("fixmate-bookings") || "[]");
      const foundLocal = localList.find((b) => b._id === bookingId);
      if (foundLocal) {
        setBooking(foundLocal);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/bookings/" + bookingId, { credentials: "include" });
        const d = await res.json();
        const b = d.data || d.booking || d;
        if (b && b._id) setBooking(b);
        else if (localList[0]) setBooking(localList[0]);
      } catch {
        if (localList[0]) setBooking(localList[0]);
      } finally {
        setLoading(false);
      }
    }
    if (bookingId) load();
    else setLoading(false);
  }, [bookingId]);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setPaying(true);
    setMsg("");
    // Stripe test mode - 2 sec delay for feel
    setTimeout(() => {
      const list: Booking[] = JSON.parse(localStorage.getItem("fixmate-bookings") || "[]");
      const updated = list.map((b) => b._id === bookingId ? { ...b, paymentStatus: "Paid", status: "Confirmed" } : b);
      localStorage.setItem("fixmate-bookings", JSON.stringify(updated));
      router.push("/dashboard/customer");
    }, 1500);
  }

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-20 text-center font-bold">Loading payment...</div>;
  if (!booking) return <div className="max-w-3xl mx-auto px-4 py-20 text-center"><h1 className="font-bold text-2xl">Booking not found</h1><Link href="/dashboard/customer" className="text-blue-600 font-bold">Go to Dashboard</Link></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <p className="text-blue-600 text-xs font-bold tracking-widest">SECURE PAYMENT</p>
      <h1 className="text-3xl font-extrabold mt-1">Complete Your Payment</h1>
      <div className="bg-white border rounded-3xl p-6 mt-6">
        <div className="flex justify-between"><span className="text-slate-500 text-sm">Service</span><span className="font-bold text-sm">{booking.serviceTitle || booking.title}</span></div>
        <div className="flex justify-between mt-2"><span className="text-slate-500 text-sm">Date</span><span className="font-bold text-sm">{booking.date} - {booking.timeSlot}</span></div>
        <div className="flex justify-between mt-2 pt-3 border-t"><span className="font-bold">Total to Pay</span><span className="font-extrabold text-2xl text-blue-600">{booking.price} Tk</span></div>
      </div>

      <form onSubmit={handlePay} className="bg-white border rounded-3xl p-6 mt-4">
        <h2 className="font-bold">Card Details - Test Mode</h2>
        <p className="text-xs text-slate-500 mt-1">Use test card: 4242 4242 4242 4242, any future date, any 3-digit CVC</p>
        {msg && <p className="mt-3 bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm font-bold">{msg}</p>}
        <label className="block text-xs font-bold text-slate-500 mt-4">CARD NUMBER</label>
        <input value={card} onChange={(e) => setCard(e.target.value)} className="w-full border rounded-xl px-4 py-3 mt-1 text-sm font-bold outline-none" />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div><label className="text-xs font-bold text-slate-500">EXPIRY</label><input value={expiry} onChange={(e) => setExpiry(e.target.value)} className="w-full border rounded-xl px-4 py-3 mt-1 text-sm font-bold outline-none" /></div>
          <div><label className="text-xs font-bold text-slate-500">CVC</label><input value={cvc} onChange={(e) => setCvc(e.target.value)} className="w-full border rounded-xl px-4 py-3 mt-1 text-sm font-bold outline-none" /></div>
        </div>
        <button disabled={paying} className="w-full mt-5 py-3.5 rounded-full bg-blue-600 text-white font-bold text-sm disabled:opacity-50">{paying ? "Processing..." : "Pay " + booking.price + " Tk Now"}</button>
        <p className="text-xs text-center text-slate-400 mt-3">This is Stripe Test Mode. No real money will be charged.</p>
      </form>
    </div>
  );
}

export default function PaymentPage() {
  return <Suspense fallback={<div className="text-center py-20 font-bold">Loading...</div>}><PaymentContent /></Suspense>;
}
