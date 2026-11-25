"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type User = {
  _id: string;
  name?: string;
  email: string;
  role?: string;
  phone?: string;
  createdAt?: string;
};

type Service = {
  _id: string;
  title: string;
  category: string;
  description: string;
  basePrice?: number;
  price?: number;
  estimatedDuration?: string;
  duration?: string;
  serviceMode?: string;
  serviceArea?: string;
  image?: string;
  imageUrl?: string;
  status?: string;
  technicianName?: string;
};

type Booking = {
  _id: string;
  serviceId?: any;
  serviceTitle?: string;
  title?: string;
  customerEmail?: string;
  email?: string;
  userEmail?: string;
  name?: string;
  date?: string;
  scheduledDate?: string;
  timeSlot?: string;
  scheduledTime?: string;
  status?: string;
  price?: number;
  finalAmount?: number;
  paymentStatus?: string;
};

type Payment = {
  _id: string;
  serviceTitle?: string;
  amount?: number;
  price?: number;
  transactionId?: string;
  paymentId?: string;
  status?: string;
  paymentStatus?: string;
  createdAt?: string;
};

const CATS = ["Smartphone", "Laptop & PC", "AC", "Refrigerator", "TV", "Washing Machine", "Electrical"];

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user: any = (session as any)?.user;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"users" | "services" | "bookings" | "transactions">("services");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Smartphone");
  const [basePrice, setBasePrice] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("1 hour");
  const [serviceMode, setServiceMode] = useState("Home Visit");
  const [serviceArea, setServiceArea] = useState("Dhaka");
  const [image, setImage] = useState("");
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [bRes, sRes, uRes, pRes] = await Promise.allSettled([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, { credentials: "include" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`, { credentials: "include" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, { credentials: "include" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments`, { credentials: "include" }),
      ]);
      if (bRes.status === "fulfilled" && bRes.value.ok) {
        const d = await bRes.value.json();
        const list = Array.isArray(d) ? d : d.bookings || d.data || [];
        setBookings(Array.isArray(list) ? list : []);
      }
      if (sRes.status === "fulfilled" && sRes.value.ok) {
        const d = await sRes.value.json();
        const list = Array.isArray(d) ? d : d.data || [];
        setServices(Array.isArray(list) ? list : []);
      }
      if (uRes.status === "fulfilled" && uRes.value.ok) {
        const d = await uRes.value.json();
        const list = Array.isArray(d) ? d : d.users || d.data || [];
        setUsers(Array.isArray(list) ? list : []);
      }
      if (pRes.status === "fulfilled" && pRes.value.ok) {
        const d = await pRes.value.json();
        const list = Array.isArray(d) ? d : d.payments || d.data || [];
        setPayments(Array.isArray(list) ? list : []);
      }
    } catch {} finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isPending) return;
    if (!user) { router.push("/sign-in"); return; }
    if (user.role === "customer") { router.push("/dashboard/customer"); return; }
    if (user.role === "technician") { router.push("/dashboard/technician"); return; }
    load();
  }, [user, isPending]);

  async function createService(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !description || !basePrice) {
      toast.error("Please fill title, description and price");
      return;
    }
    if (description.trim().length < 20) {
      toast.error("Description must be at least 20 characters");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title, category,
          price: Number(basePrice), basePrice: Number(basePrice),
          description, estimatedDuration, serviceMode, serviceArea,
          image, imageUrl: image,
          technicianName: "FixMate Team",
          status: "Approved",
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Service created successfully");
      setTitle(""); setCategory("Smartphone"); setBasePrice(""); setDescription("");
      setEstimatedDuration("1 hour"); setServiceMode("Home Visit"); setServiceArea("Dhaka"); setImage("");
      load();
    } catch {
      toast.error("Failed to create service");
    } finally {
      setCreating(false);
    }
  }

  async function updateUserRole(u: User, newRole: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${u._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Failed");
      setUsers((prev) => prev.map((x) => x._id === u._id ? { ...x, role: newRole } : x));
      toast.success("User role updated to " + newRole);
    } catch {
      toast.error("Failed to update user role");
    }
  }

  async function updateServiceStatus(s: Service, status: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${s._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      setServices((prev) => prev.map((x) => x._id === s._id ? { ...x, status } : x));
      toast.success("Service " + status);
    } catch {
      toast.error("Failed to update service");
    }
  }

  if (isPending) return <p className="text-center py-20">Loading...</p>;
  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500";

  const pendingBookings = bookings.filter((b) => (b.status || "").toLowerCase().includes("pend") || (b.status || "").toLowerCase().includes("request")).length;
  const pendingServices = services.filter((s) => (s.status || "Pending").toLowerCase().includes("pend")).length;
  const paidPayments = payments.length > 0 ? payments : bookings.filter((b) => (b.paymentStatus || "").toLowerCase() === "paid").map((b) => ({
    _id: b._id, serviceTitle: b.serviceTitle || b.title || "Repair Service",
    amount: b.finalAmount ?? b.price ?? 0, transactionId: "TXN-" + String(b._id).slice(-8).toUpperCase(), status: "Paid", createdAt: "",
  }));
  const totalRevenue = paidPayments.reduce((sum, p: any) => sum + (p.amount ?? p.price ?? 0), 0);

  function getBookingTitle(b: Booking) {
    if (typeof b.serviceId === "object" && b.serviceId?.title) return b.serviceId.title;
    return b.serviceTitle || b.title || "Repair Service";
  }

  function statusColor(s: string) {
    const v = s.toLowerCase();
    if (v.includes("complet") || v.includes("approv")) return "bg-emerald-100 text-emerald-700";
    if (v.includes("pend") || v.includes("request")) return "bg-yellow-100 text-yellow-700";
    if (v.includes("cancel") || v.includes("reject")) return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-700";
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-sm text-slate-500 mt-1">Welcome, {user?.name || "Admin"} - Manage users, services, bookings and payments.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="border rounded-xl p-4 bg-white"><p className="text-sm text-gray-500">Total Users</p><p className="text-2xl font-bold">{users.length}</p></div>
        <div className="border rounded-xl p-4 bg-white"><p className="text-sm text-gray-500">Total Services</p><p className="text-2xl font-bold">{services.length}</p><p className="text-xs text-yellow-600 font-bold">{pendingServices} Pending Approval</p></div>
        <div className="border rounded-xl p-4 bg-white"><p className="text-sm text-gray-500">Total Bookings</p><p className="text-2xl font-bold">{bookings.length}</p><p className="text-xs text-yellow-600 font-bold">{pendingBookings} Pending</p></div>
        <div className="border rounded-xl p-4 bg-white"><p className="text-sm text-gray-500">Total Revenue</p><p className="text-2xl font-bold text-emerald-600">{totalRevenue} Tk</p><p className="text-xs text-slate-500">{paidPayments.length} Paid Transactions</p></div>
      </div>

      <div className="flex gap-2 mt-6 overflow-x-auto pb-1">
        {(["users", "services", "bookings", "transactions"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={tab === t ? "px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold whitespace-nowrap" : "px-5 py-2.5 rounded-full bg-white border text-sm font-bold whitespace-nowrap capitalize"}>{t}</button>
        ))}
      </div>

      {loading ? (
        <div className="mt-6 bg-slate-100 h-40 rounded-xl animate-pulse"></div>
      ) : tab === "users" ? (
        <div className="border rounded-xl p-5 bg-white mt-6">
          <h2 className="font-bold mb-3">All Users - Change Role</h2>
          {users.length === 0 ? <p className="text-gray-500 text-sm">No users found. Users will appear here after they sign up.</p> : (
            <div className="flex flex-col gap-3">
              {users.map((u) => (
                <div key={u._id} className="border rounded-lg p-3 text-sm flex flex-wrap items-center justify-between gap-3">
                  <div><p className="font-bold">{u.name || "User"}</p><p className="text-gray-500">{u.email} {u.phone ? " | " + u.phone : ""}</p></div>
                  <select value={u.role || "customer"} onChange={(e) => updateUserRole(u, e.target.value)} className="border rounded-lg px-3 py-2 text-sm font-bold bg-white">
                    <option value="customer">Customer</option>
                    <option value="technician">Technician</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : tab === "services" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="border rounded-xl p-5 bg-white h-fit">
            <h2 className="font-bold mb-3">Create New Service</h2>
            <form onSubmit={createService} className="flex flex-col gap-3">
              <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title - Laptop Repair" required />
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass + " bg-white"}>{CATS.map((c) => <option key={c} value={c}>{c}</option>)}</select>
              <input className={inputClass} value={basePrice} onChange={(e) => setBasePrice(e.target.value)} placeholder="Price - 1000" type="number" required />
              <input className={inputClass} value={estimatedDuration} onChange={(e) => setEstimatedDuration(e.target.value)} placeholder="Duration - 1 hour" />
              <div className="grid grid-cols-2 gap-3">
                <select value={serviceMode} onChange={(e) => setServiceMode(e.target.value)} className={inputClass + " bg-white"}><option>Home Visit</option><option>Shop Drop-off</option></select>
                <input className={inputClass} value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} placeholder="Area - Dhaka" />
              </div>
              <input className={inputClass} value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL (optional)" />
              <textarea className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description - Min 20 characters" rows={3} required />
              <button disabled={creating} className="w-full bg-blue-600 text-white py-2.5 rounded-lg disabled:opacity-50">{creating ? "Creating..." : "Create Service"}</button>
            </form>
          </div>
          <div className="border rounded-xl p-5 bg-white">
            <h2 className="font-bold mb-3">All Services - Approve / Reject</h2>
            <div className="flex flex-col gap-3 max-h- overflow-y-auto pr-1">
              {services.map((s) => (
                <div key={s._id} className="border rounded-lg p-3 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold">{s.title}</p>
                    <span className={"px-2.5 py-0.5 rounded-full text-xs font-bold " + statusColor(s.status || "Pending")}>{s.status || "Pending"}</span>
                  </div>
                  <p className="text-gray-500 mt-1">{s.category} | {s.basePrice ?? s.price} Tk | {s.technicianName || "FixMate Team"}</p>
                  <p className="text-gray-500 line-clamp-2">{s.description}</p>
                  <div className="flex gap-2 mt-3">
                    {(s.status || "Pending").toLowerCase().includes("pend") && (
                      <>
                        <button onClick={() => updateServiceStatus(s, "Approved")} className="px-4 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold cursor-pointer hover:bg-emerald-700">Approve</button>
                        <button onClick={() => updateServiceStatus(s, "Rejected")} className="px-4 py-1.5 rounded-full border border-red-200 text-red-600 text-xs font-bold cursor-pointer">Reject</button>
                      </>
                    )}
                    {(s.status || "Pending").toLowerCase().includes("reject") && <button onClick={() => updateServiceStatus(s, "Approved")} className="px-4 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold cursor-pointer hover:bg-emerald-700">Approve Again</button>}
                    {(s.status || "Pending").toLowerCase().includes("approv") && <button onClick={() => updateServiceStatus(s, "Rejected")} className="px-4 py-1.5 rounded-full border border-red-200 text-red-600 text-xs font-bold cursor-pointer">Reject</button>}
                  </div>
                </div>
              ))}
              {services.length === 0 && <p className="text-gray-500">No services found.</p>}
            </div>
          </div>
        </div>
      ) : tab === "bookings" ? (
        <div className="border rounded-xl p-5 bg-white mt-6">
          <h2 className="font-bold mb-1">All Bookings - Read Only</h2>
          <p className="text-sm text-slate-500 mb-3">Admin cannot change booking status. Technician and customer manage bookings.</p>
          <div className="flex flex-col gap-3 max-h- overflow-y-auto pr-1">
            {bookings.map((b) => (
              <div key={b._id} className="border rounded-lg p-3 text-sm flex flex-wrap justify-between gap-2">
                <div>
                  <p className="font-bold">{getBookingTitle(b)} - {b.status || "Pending"}</p>
                  <p className="text-gray-500">{b.customerEmail || b.email || b.userEmail || ""} | {b.scheduledDate || b.date || ""} {b.scheduledTime || b.timeSlot || ""} | {b.finalAmount ?? b.price ?? 0} Tk</p>
                  <p className="text-gray-500">Payment: {b.paymentStatus || "Unpaid"}</p>
                </div>
                <span className={"px-3 py-1 rounded-full text-xs font-bold h-fit " + statusColor(b.status || "Pending")}>{b.status || "Pending"}</span>
              </div>
            ))}
            {bookings.length === 0 && <p className="text-gray-500">No bookings found.</p>}
          </div>
        </div>
      ) : (
        <div className="border rounded-xl p-5 bg-white mt-6">
          <h2 className="font-bold mb-1">All Transactions</h2>
          <p className="text-sm text-slate-500 mb-3">Total Revenue: <b className="text-emerald-600">{totalRevenue} Tk</b> from {paidPayments.length} paid transactions.</p>
          <div className="flex flex-col gap-3">
            {paidPayments.map((p: any) => (
              <div key={p._id} className="border rounded-lg p-3 text-sm flex flex-wrap justify-between gap-2">
                <div>
                  <p className="font-bold">{p.serviceTitle || "Repair Service"}</p>
                  <p className="text-gray-500">Transaction ID: <b className="text-slate-700">{p.transactionId || p.paymentId || "TXN-" + String(p._id).slice(-8).toUpperCase()}</b></p>
                  {p.createdAt && <p className="text-gray-400 text-xs">{new Date(p.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>}
                </div>
                <div className="text-right"><p className="font-extrabold">{p.amount ?? p.price ?? 0} Tk</p><span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full">Paid</span></div>
              </div>
            ))}
            {paidPayments.length === 0 && <p className="text-gray-500">No transactions yet.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
