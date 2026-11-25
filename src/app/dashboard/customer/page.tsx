"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Booking = {
  _id: string;
  serviceId?: any;
  serviceTitle?: string;
  serviceName?: string;
  title?: string;
  date?: string;
  scheduledDate?: string;
  timeSlot?: string;
  scheduledTime?: string;
  status?: string;
  price?: number;
  amount?: number;
  basePrice?: number;
  finalAmount?: number;
  address?: string;
  phone?: string;
  paymentStatus?: string;
  transactionId?: string;
  paymentId?: string;
  createdAt?: string;
};

type Payment = {
  _id: string;
  bookingId?: string;
  serviceTitle?: string;
  amount?: number;
  price?: number;
  transactionId?: string;
  paymentId?: string;
  status?: string;
  paymentStatus?: string;
  createdAt?: string;
  paidAt?: string;
};

export default function CustomerDashboard() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user: any = (session as any)?.user;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelBooking, setCancelBooking] = useState<Booking | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Auth guard - only customer
  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      router.push("/sign-in");
      return;
    }
    if (user.role === "admin") router.push("/dashboard/admin");
    else if (user.role === "technician") router.push("/dashboard/technician");
  }, [user, sessionLoading]);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        let apiList: Booking[] = [];
        try {
          const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/bookings", { credentials: "include" });
          const d = await res.json();
          const list = Array.isArray(d) ? d : d.bookings || d.data || d.result || [];
          apiList = Array.isArray(list) ? list : [];
        } catch { apiList = []; }

        // Local bookings - demo service er booking ekhane thake
        const localList: Booking[] = JSON.parse(localStorage.getItem("fixmate-bookings") || "[]");
        const merged = [...localList, ...apiList];
        // Duplicate bad dao
        const seen = new Set();
        const unique = merged.filter((b) => {
          if (seen.has(b._id)) return false;
          seen.add(b._id);
          return true;
        });
        setBookings(unique);

        // Payments history
        try {
          const pres = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/payments", { credentials: "include" });
          const pdata = await pres.json();
          const plist = Array.isArray(pdata) ? pdata : pdata.payments || pdata.data || [];
          if (Array.isArray(plist) && plist.length > 0) {
            setPayments(plist);
          } else {
            // Fallback - paid bookings theke history banao
            const paidList = unique.filter((b) => (b.paymentStatus || "").toLowerCase() === "paid");
            setPayments(paidList.map((b) => ({
              _id: b._id,
              bookingId: b._id,
              serviceTitle: b.serviceTitle || b.serviceName || b.title || "Repair Service",
              amount: b.finalAmount ?? b.price ?? b.amount ?? 0,
              transactionId: b.transactionId || b.paymentId || "TXN-" + String(b._id).slice(-8).toUpperCase(),
              status: "Paid",
              paymentStatus: "Paid",
              createdAt: b.createdAt,
            })));
          }
        } catch {
          const paidList = unique.filter((b) => (b.paymentStatus || "").toLowerCase() === "paid");
          setPayments(paidList.map((b) => ({
            _id: b._id,
            bookingId: b._id,
            serviceTitle: b.serviceTitle || b.serviceName || b.title || "Repair Service",
            amount: b.finalAmount ?? b.price ?? b.amount ?? 0,
            transactionId: b.transactionId || b.paymentId || "TXN-" + String(b._id).slice(-8).toUpperCase(),
            status: "Paid",
            paymentStatus: "Paid",
            createdAt: b.createdAt,
          })));
        }
      } catch (e: any) {
        setBookings(JSON.parse(localStorage.getItem("fixmate-bookings") || "[]"));
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const total = bookings.length;
  const pending = bookings.filter((b) => {
    const s = (b.status || "").toLowerCase();
    return s.includes("pend") || s.includes("request");
  }).length;
  const completed = bookings.filter((b) => (b.status || "").toLowerCase().includes("complet") || (b.status || "").toLowerCase().includes("done")).length;
  const paid = bookings.filter((b) => (b.paymentStatus || "").toLowerCase() === "paid").length;

  function statusColor(status: string) {
    const s = status.toLowerCase();
    if (s.includes("complet") || s.includes("done")) return "bg-emerald-100 text-emerald-700";
    if (s.includes("pend") || s.includes("request")) return "bg-yellow-100 text-yellow-700";
    if (s.includes("cancel")) return "bg-red-100 text-red-700";
    if (s.includes("confirm") || s.includes("accept")) return "bg-blue-100 text-blue-700";
    if (s.includes("progress")) return "bg-purple-100 text-purple-700";
    return "bg-slate-100 text-slate-700";
  }

  function canCancel(b: Booking) {
    const s = (b.status || "").toLowerCase();
    return s.includes("pend") || s === "requested" || s.includes("request");
  }

  function isCompleted(b: Booking) {
    const s = (b.status || "").toLowerCase();
    return s.includes("complet") || s.includes("done");
  }

  function canPay(b: Booking) {
    const isPaid = (b.paymentStatus || "").toLowerCase() === "paid";
    return isCompleted(b) && !isPaid;
  }

  async function confirmCancel() {
    if (!cancelBooking) return;
    setCancelLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/bookings/" + cancelBooking._id + "/cancel", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "Cancelled" }),
      });
      if (!res.ok) {
        // Fallback - PUT try
        await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/bookings/" + cancelBooking._id, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: "Cancelled" }),
        });
      }
    } catch {}
    // Local + UI update
    const updated = bookings.map((b) => b._id === cancelBooking._id ? { ...b, status: "Cancelled" } : b);
    setBookings(updated);
    const local = JSON.parse(localStorage.getItem("fixmate-bookings") || "[]");
    const newLocal = local.map((b: any) => b._id === cancelBooking._id ? { ...b, status: "Cancelled" } : b);
    localStorage.setItem("fixmate-bookings", JSON.stringify(newLocal));
    setCancelBooking(null);
    setCancelLoading(false);
  }

  function getTitle(b: Booking) {
    if (typeof b.serviceId === "object" && b.serviceId?.title) return b.serviceId.title;
    return b.serviceTitle || b.serviceName || b.title || "Repair Service";
  }
  function getDate(b: Booking) {
    return b.date || b.scheduledDate || "Not set";
  }
  function getTime(b: Booking) {
    return b.timeSlot || b.scheduledTime || "";
  }
  function getPrice(b: Booking) {
    return b.finalAmount ?? b.price ?? b.amount ?? b.basePrice ?? 0;
  }

  if (sessionLoading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center font-bold">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-blue-600 text-xs font-bold tracking-widest">CUSTOMER DASHBOARD</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-1">My Bookings</h1>
          <p className="text-slate-500 text-sm mt-1">Your booking is saved here. Pay from here.</p>
        </div>
        <Link href="/services" className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold">Book New Service</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-white border rounded-3xl p-5"><p className="text-xs text-slate-500 font-bold">TOTAL BOOKINGS</p><p className="text-3xl font-extrabold mt-1">{total}</p></div>
        <div className="bg-white border rounded-3xl p-5"><p className="text-xs text-slate-500 font-bold">PENDING</p><p className="text-3xl font-extrabold mt-1 text-yellow-600">{pending}</p></div>
        <div className="bg-white border rounded-3xl p-5"><p className="text-xs text-slate-500 font-bold">COMPLETED</p><p className="text-3xl font-extrabold mt-1 text-emerald-600">{completed}</p></div>
        <div className="bg-white border rounded-3xl p-5"><p className="text-xs text-slate-500 font-bold">PAID</p><p className="text-3xl font-extrabold mt-1 text-blue-600">{paid}</p></div>
      </div>

      {error && <p className="mt-4 bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 text-sm font-bold">{error}</p>}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-44 bg-slate-100 rounded-3xl animate-pulse"></div>)}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white border rounded-3xl p-10 mt-6 text-center">
          <h3 className="font-bold text-xl">No bookings yet</h3>
          <p className="text-slate-500 text-sm mt-1">You have not booked any service yet.</p>
          <Link href="/services" className="inline-block mt-5 px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-bold">Browse Services</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {(bookings || []).map((b) => {
            const isPaid = (b.paymentStatus || "").toLowerCase() === "paid";
            const txn = b.transactionId || b.paymentId;
            return (
            <div key={b._id} className="border rounded-3xl p-5 bg-white shadow-sm hover:shadow-md transition flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold leading-snug">{getTitle(b)}</h3>
                <span className={"px-3 py-1 rounded-full text-xs font-bold shrink-0 " + statusColor(b.status || "Pending")}>{b.status || "Pending"}</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">Date: {getDate(b)} {getTime(b) ? " - " + getTime(b) : ""}</p>
              {b.address && <p className="text-sm text-slate-500">Address: {b.address}</p>}
              {isPaid && txn && <p className="text-xs text-slate-500 mt-1">Transaction ID: <span className="font-bold text-slate-700">{txn}</span></p>}
              <div className="flex items-center justify-between mt-4 pt-4 border-t mt-auto">
                <div>
                  <p className="text-xs text-slate-400">Price</p>
                  <p className="font-extrabold text-lg">{getPrice(b)} Tk</p>
                  <p className="text-xs font-bold text-slate-500">Payment: {b.paymentStatus || "Unpaid"}</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {isPaid ? (
                    <span className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">Paid</span>
                  ) : canPay(b) ? (
                    <Link href={"/payment?bookingId=" + b._id} className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-bold">Pay Now</Link>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium text-right">Pay after completion</span>
                  )}
                  {canCancel(b) && (
                    <button onClick={() => setCancelBooking(b)} className="px-4 py-2 rounded-full border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50">Cancel</button>
                  )}
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* Payments History */}
      <div className="mt-10">
        <h2 className="font-extrabold text-2xl">Payments History</h2>
        <p className="text-sm text-slate-500 mt-1">All your card payments with transaction ID.</p>
        {payments.length === 0 ? (
          <div className="bg-white border rounded-3xl p-8 mt-4 text-center text-sm text-slate-500">No payments yet. Complete a service and pay by card to see it here.</div>
        ) : (
          <div className="bg-white border rounded-3xl overflow-hidden mt-4">
            {payments.map((p) => (
              <div key={p._id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b last:border-b-0">
                <div>
                  <p className="font-bold text-sm">{p.serviceTitle || "Repair Service"}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Transaction ID: <span className="font-bold text-slate-700">{p.transactionId || p.paymentId || "TXN-" + String(p._id).slice(-8).toUpperCase()}</span></p>
                  {p.createdAt && <p className="text-xs text-slate-400">{new Date(p.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>}
                </div>
                <div className="text-right">
                  <p className="font-extrabold">{p.amount ?? p.price ?? 0} Tk</p>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full">Paid</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {cancelBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-extrabold text-xl">Cancel Booking?</h3>
            <p className="text-sm text-slate-500 mt-2">Are you sure you want to cancel <b className="text-slate-900">{getTitle(cancelBooking)}</b> on {getDate(cancelBooking)}? This action cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setCancelBooking(null)} disabled={cancelLoading} className="flex-1 py-3 rounded-full border font-bold text-sm">Keep Booking</button>
              <button onClick={confirmCancel} disabled={cancelLoading} className="flex-1 py-3 rounded-full bg-red-600 text-white font-bold text-sm disabled:opacity-50">{cancelLoading ? "Cancelling..." : "Yes, Cancel"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
