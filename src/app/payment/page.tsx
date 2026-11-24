"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type Booking = {
  _id: string;
  serviceTitle?: string;
  title?: string;
  price?: number;
  amount?: number;
  date?: string;
  timeSlot?: string;
  address?: string;
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
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("fixmate-profile") || "{}");
    if (saved.name) setName(saved.name);
  }, []);

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

  function formatCard(v: string) {
    const clean = v.replace(/\D/g, "").slice(0, 16);
    return clean.replace(/(\d{4})(?=\d)/g, "$1 ");
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!card || !expiry || !cvc || !name) {
      setMsg("Please fill all card details.");
      return;
    }
    setPaying(true);
    setMsg("");
    setTimeout(() => {
      const list: Booking[] = JSON.parse(localStorage.getItem("fixmate-bookings") || "[]");
      const updated = list.map((b) => b._id === bookingId ? { ...b, paymentStatus: "Paid", status: "Confirmed" } : b);
      localStorage.setItem("fixmate-bookings", JSON.stringify(updated));
      router.push("/dashboard/customer");
    }, 1500);
  }

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-20 text-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div><p className="font-bold mt-4">Loading secure payment...</p></div>;
  if (!booking) return <div className="max-w-3xl mx-auto px-4 py-20 text-center"><h1 className="font-bold text-2xl">Booking not found</h1><p className="text-slate-500 text-sm mt-2">This booking link may have expired.</p><Link href="/dashboard/customer" className="inline-block mt-5 px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-bold">Go to Dashboard</Link></div>;

  const price = booking.price ?? booking.amount ?? 0;
  const discount = Math.round(price * 0.2);
  const total = price;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <p className="text-sm text-slate-500"><Link href="/" className="hover:text-blue-600">Home</Link> / <Link href="/dashboard/customer" className="hover:text-blue-600">My Bookings</Link> / <span className="text-slate-900 font-bold">Payment</span></p>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
        <div>
          <p className="text-blue-600 text-xs font-bold tracking-widest">SECURE CHECKOUT</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-1">Complete Your Payment</h1>
          <p className="text-slate-500 text-sm mt-1">Pay securely. Your technician will be confirmed instantly after payment.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full">
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
          <span className="text-emerald-700 text-xs font-bold">256-bit SSL Secured</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border rounded-3xl p-6 shadow-sm">
            <h2 className="font-extrabold text-lg">Order Summary</h2>
            <div className="flex gap-4 mt-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-xl shrink-0">F</div>
              <div>
                <p className="font-bold leading-snug">{booking.serviceTitle || booking.title}</p>
                <p className="text-xs text-slate-500 mt-1">Verified Technician • 30 Days Warranty</p>
                <p className="text-xs text-slate-500">Free Pickup & Delivery in Dhaka</p>
              </div>
            </div>
            <div className="mt-5 space-y-2 text-sm border-t pt-4">
              <div className="flex justify-between"><span className="text-slate-500">Booking Date</span><span className="font-bold">{booking.date || "Not set"}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Time Slot</span><span className="font-bold">{booking.timeSlot || "10:00 AM - 12:00 PM"}</span></div>
              {booking.address && <div className="flex justify-between gap-4"><span className="text-slate-500 shrink-0">Address</span><span className="font-bold text-right">{booking.address}</span></div>}
              <div className="flex justify-between"><span className="text-slate-500">Booking ID</span><span className="font-bold text-xs">{bookingId.slice(0, 18)}...</span></div>
            </div>
            <div className="mt-5 space-y-2 text-sm border-t pt-4">
              <div className="flex justify-between"><span className="text-slate-500">Service Price</span><span className="font-bold">{Math.round(price * 1.2)} Tk</span></div>
              <div className="flex justify-between"><span className="text-emerald-600 font-bold">Discount (20% OFF)</span><span className="font-bold text-emerald-600">- {discount} Tk</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Service Fee</span><span className="font-bold text-emerald-600">FREE</span></div>
              <div className="flex justify-between pt-3 border-t"><span className="font-extrabold">Total to Pay</span><span className="font-extrabold text-2xl text-blue-600">{total} Tk</span></div>
            </div>
            <div className="bg-blue-50 rounded-2xl p-3 mt-4 flex gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              <p className="text-xs text-blue-800 leading-relaxed">You save <b>{discount} Tk</b> with this offer. Payment is refundable if technician cannot repair.</p>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-6">
            <h3 className="font-bold">Why pay online?</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>• Technician confirmed instantly</li>
              <li>• Priority booking - no waiting</li>
              <li>• Full payment protection</li>
              <li>• Invoice & warranty auto-generated</li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white border rounded-3xl p-6 md:p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-lg">Card Payment</h2>
              <div className="flex gap-1">
                <span className="text-xs font-extrabold bg-slate-900 text-white px-2.5 py-1 rounded-md">CARD</span>
                <span className="text-xs font-extrabold bg-slate-100 px-2.5 py-1 rounded-md">SECURE</span>
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-2">All transactions are encrypted and secure. We never store your card details.</p>

            <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-slate-900 text-white rounded-3xl p-5 mt-5">
              <div className="flex justify-between items-start">
                <p className="font-extrabold text-lg tracking-wide">FixMate</p>
                <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold">CARD</span>
              </div>
              <p className="font-mono text-xl md:text-2xl tracking-wider mt-6">{card || "4242 4242 4242 4242"}</p>
              <div className="flex justify-between mt-5 text-xs">
                <div><p className="text-white/60">CARD HOLDER</p><p className="font-bold mt-1">{name || "YOUR NAME"}</p></div>
                <div><p className="text-white/60">EXPIRES</p><p className="font-bold mt-1">{expiry || "MM/YY"}</p></div>
                <div><p className="text-white/60">CVC</p><p className="font-bold mt-1">•••</p></div>
              </div>
            </div>

            <form onSubmit={handlePay} className="mt-5" autoComplete="off">
              {msg && <p className="mb-3 bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm font-bold">{msg}</p>}
              <label className="block text-xs font-bold text-slate-500">CARDHOLDER NAME</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name on card" autoComplete="off" name="fixmate-name" className="w-full border rounded-xl px-4 py-3 mt-1 text-sm outline-none focus:border-blue-600 font-semibold" />
              <label className="block text-xs font-bold text-slate-500 mt-4">CARD NUMBER</label>
              <input value={card} onChange={(e) => setCard(formatCard(e.target.value))} placeholder="4242 4242 4242 4242" autoComplete="off" name="fixmate-card" inputMode="numeric" className="w-full border rounded-xl px-4 py-3 mt-1 text-sm outline-none focus:border-blue-600 font-bold" />
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div><label className="text-xs font-bold text-slate-500">EXPIRY</label><input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" autoComplete="off" name="fixmate-exp" className="w-full border rounded-xl px-4 py-3 mt-1 text-sm outline-none focus:border-blue-600 font-bold" /></div>
                <div><label className="text-xs font-bold text-slate-500">CVC</label><input value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="123" maxLength={3} autoComplete="off" name="fixmate-cvc" inputMode="numeric" className="w-full border rounded-xl px-4 py-3 mt-1 text-sm outline-none focus:border-blue-600 font-bold" /></div>
              </div>
              <button disabled={paying} className="w-full mt-5 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm disabled:opacity-50 shadow-lg shadow-blue-200">{paying ? "Processing Secure Payment..." : "Pay " + total + " Tk Securely"}</button>
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-400 font-bold">
                <span>SSL Secured</span><span>•</span><span>Payment Protected</span><span>•</span><span>Refund Available</span>
              </div>
            </form>
          </div>
          <p className="text-xs text-center text-slate-400 mt-4">By paying you agree to FixMate Terms & Refund Policy. Your payment is protected by 256-bit SSL encryption.</p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return <Suspense fallback={<div className="text-center py-20 font-bold">Loading...</div>}><PaymentContent /></Suspense>;
}
