"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  technicianEmail?: string;
};

type Booking = {
  _id: string;
  serviceId?: any;
  serviceTitle?: string;
  title?: string;
  name?: string;
  customerName?: string;
  email?: string;
  phone?: string;
  address?: string;
  problem?: string;
  date?: string;
  scheduledDate?: string;
  timeSlot?: string;
  scheduledTime?: string;
  status?: string;
  price?: number;
  finalAmount?: number;
  paymentStatus?: string;
};

const CATS = ["Smartphone", "Laptop & PC", "AC", "Refrigerator", "TV", "Washing Machine", "Electrical"];
const MODES = ["Home Visit", "Shop Drop-off"];

const emptyForm = {
  title: "", category: "Smartphone", description: "",
  basePrice: 1000, estimatedDuration: "1 hour",
  serviceMode: "Home Visit", serviceArea: "Dhaka", image: "",
};

export default function TechnicianDashboard() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user: any = (session as any)?.user;

  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"services" | "bookings">("services");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);

  const [completing, setCompleting] = useState<Booking | null>(null);
  const [finalAmount, setFinalAmount] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleting, setDeleting] = useState<Service | null>(null);

  // Auth guard - only technician
  useEffect(() => {
    if (sessionLoading) return;
    if (!user) { router.push("/sign-in"); return; }
    if (user.role === "admin") router.push("/dashboard/admin");
    else if (user.role === "customer") router.push("/dashboard/customer");
  }, [user, sessionLoading]);

  async function loadAll() {
    if (!user) return;
    setLoading(true);
    try {
      const sres = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/services", { credentials: "include" });
      const sdata = await sres.json();
      const slist = Array.isArray(sdata) ? sdata : sdata.data || [];
      const mine = (slist || []).filter((s: any) => {
        if (!s.technicianEmail && !s.technicianName) return true;
        return s.technicianEmail === user.email || s.technicianName === user.name || s.technician === user.name;
      });
      setServices(mine);

      const bres = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/bookings", { credentials: "include" });
      const bdata = await bres.json();
      const blist = Array.isArray(bdata) ? bdata : bdata.bookings || bdata.data || [];
      setBookings(blist || []);
    } catch {
      setServices([]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (user?.role === "technician") loadAll(); }, [user]);

  const pendingServices = services.filter((s) => (s.status || "").toLowerCase().includes("pend")).length;
  const activeBookings = bookings.filter((b) => ["Requested", "Pending", "Accepted", "In Progress"].includes(b.status || "")).length;
  const completedBookings = bookings.filter((b) => (b.status || "").toLowerCase().includes("complet")).length;
  const earnings = bookings.filter((b) => (b.status || "").toLowerCase().includes("complet")).reduce((sum, b) => sum + (b.finalAmount ?? b.price ?? 0), 0);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setImagePreview("");
    setShowForm(true);
  }

  function openEdit(s: Service) {
    setEditing(s);
    setForm({
      title: s.title,
      category: s.category,
      description: s.description,
      basePrice: s.basePrice ?? s.price ?? 1000,
      estimatedDuration: s.estimatedDuration || s.duration || "1 hour",
      serviceMode: s.serviceMode || "Home Visit",
      serviceArea: s.serviceArea || "Dhaka",
      image: s.image || s.imageUrl || "",
    });
    setImagePreview(s.image || s.imageUrl || "");
    setShowForm(true);
  }

  function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      setImagePreview(url);
      setForm((f) => ({ ...f, image: url }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSaveService(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.description || !form.basePrice) {
      toast.error("Please fill title, description and price");
      return;
    }
    if (form.description.trim().length < 20) {
      toast.error("Description must be at least 20 characters");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      price: form.basePrice,
      imageUrl: form.image,
      technicianName: user?.name || "Verified Technician",
      technicianEmail: user?.email,
      technician: user?.name || "Verified Technician",
      status: "Pending",
    };
    try {
      let res: Response;
      if (editing) {
        // Edit -> abar Pending e jabe, Admin abar approve korbe
        res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/services/" + editing._id, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ...payload, status: "Pending" }),
        });
      } else {
        res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error("Failed");
      toast.success(editing ? "Service updated. Sent again for approval (Pending)." : "Service added. Waiting for admin approval.");
      setShowForm(false);
      loadAll();
    } catch {
      toast.error("Failed to save service. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function updateBookingStatus(b: Booking, status: string, extra: any = {}) {
    setActionLoading(true);
    try {
      await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/bookings/" + b._id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status, ...extra }),
      });
      setBookings((prev) => prev.map((x) => x._id === b._id ? { ...x, status, ...extra } : x));
      toast.success("Booking " + status);
    } catch {
      toast.error("Failed to update booking");
    } finally {
      setActionLoading(false);
    }
  }

  async function confirmComplete() {
    if (!completing) return;
    if (!finalAmount || finalAmount <= 0) {
      toast.error("Please enter final amount");
      return;
    }
    setActionLoading(true);
    try {
      await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/bookings/" + completing._id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "Completed", finalAmount, paymentStatus: "Unpaid" }),
      });
      setBookings((prev) => prev.map((x) => x._id === completing._id ? { ...x, status: "Completed", finalAmount, paymentStatus: "Unpaid" } : x));
      toast.success("Marked as Completed. Customer can now pay by card.");
      setCompleting(null);
    } catch {
      toast.error("Failed to complete booking");
    } finally {
      setActionLoading(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/services/" + deleting._id, { method: "DELETE", credentials: "include" });
      setServices((prev) => prev.filter((s) => s._id !== deleting._id));
      toast.success("Service deleted");
    } catch {
      toast.error("Failed to delete service");
    }
    setDeleting(null);
  }

  function statusColor(s: string) {
    const v = s.toLowerCase();
    if (v.includes("complet")) return "bg-emerald-100 text-emerald-700";
    if (v.includes("pend") || v.includes("request")) return "bg-yellow-100 text-yellow-700";
    if (v.includes("cancel") || v.includes("reject")) return "bg-red-100 text-red-700";
    if (v.includes("accept") || v.includes("confirm")) return "bg-blue-100 text-blue-700";
    if (v.includes("progress")) return "bg-purple-100 text-purple-700";
    if (v.includes("approv")) return "bg-emerald-100 text-emerald-700";
    return "bg-slate-100 text-slate-700";
  }

  function getBookingTitle(b: Booking) {
    if (typeof b.serviceId === "object" && b.serviceId?.title) return b.serviceId.title;
    return b.serviceTitle || b.title || "Repair Service";
  }

  if (sessionLoading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center font-bold">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-blue-600 text-xs font-bold tracking-widest">TECHNICIAN DASHBOARD</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-1">Welcome, {user?.name || "Technician"}</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your services and bookings here.</p>
        </div>
        <button onClick={openAdd} className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold">+ Add Service</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-white border rounded-3xl p-5"><p className="text-xs text-slate-500 font-bold">MY SERVICES</p><p className="text-3xl font-extrabold mt-1">{services.length}</p></div>
        <div className="bg-white border rounded-3xl p-5"><p className="text-xs text-slate-500 font-bold">PENDING APPROVAL</p><p className="text-3xl font-extrabold mt-1 text-yellow-600">{pendingServices}</p></div>
        <div className="bg-white border rounded-3xl p-5"><p className="text-xs text-slate-500 font-bold">ACTIVE BOOKINGS</p><p className="text-3xl font-extrabold mt-1 text-blue-600">{activeBookings}</p></div>
        <div className="bg-white border rounded-3xl p-5"><p className="text-xs text-slate-500 font-bold">COMPLETED</p><p className="text-3xl font-extrabold mt-1 text-emerald-600">{completedBookings}</p><p className="text-xs text-slate-500 mt-1">Earnings: {earnings} Tk</p></div>
      </div>

      <div className="flex gap-2 mt-8">
        <button onClick={() => setTab("services")} className={tab === "services" ? "px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold" : "px-5 py-2.5 rounded-full bg-white border text-sm font-bold"}>My Services ({services.length})</button>
        <button onClick={() => setTab("bookings")} className={tab === "bookings" ? "px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold" : "px-5 py-2.5 rounded-full bg-white border text-sm font-bold"}>Bookings ({bookings.length})</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">{[1, 2, 3].map((i) => <div key={i} className="h-44 bg-slate-100 rounded-3xl animate-pulse"></div>)}</div>
      ) : tab === "services" ? (
        services.length === 0 ? (
          <div className="bg-white border rounded-3xl p-10 mt-6 text-center">
            <h3 className="font-bold text-xl">No services yet</h3>
            <p className="text-slate-500 text-sm mt-1">Add your first service. It will go to admin for approval.</p>
            <button onClick={openAdd} className="mt-5 px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-bold">Add Service</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {services.map((s) => (
              <div key={s._id} className="bg-white border rounded-3xl overflow-hidden flex flex-col">
                <img src={s.image || s.imageUrl || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"} alt={s.title} className="w-full h-44 object-cover" />
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold leading-snug">{s.title}</h3>
                    <span className={"px-3 py-1 rounded-full text-xs font-bold shrink-0 " + statusColor(s.status || "Pending")}>{s.status || "Pending"}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{s.description}</p>
                  <p className="text-sm text-slate-500 mt-2">{s.category} - {s.serviceMode || "Home Visit"} - {s.estimatedDuration || s.duration}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t mt-auto">
                    <p className="font-extrabold text-lg">{s.basePrice ?? s.price} Tk</p>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(s)} className="px-4 py-2 rounded-full border text-sm font-bold">Edit</button>
                      <button onClick={() => setDeleting(s)} className="px-4 py-2 rounded-full border border-red-200 text-red-600 text-sm font-bold">Delete</button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Edit korle abar Pending e jabe, Admin abar approve korbe.</p>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        bookings.length === 0 ? (
          <div className="bg-white border rounded-3xl p-10 mt-6 text-center"><h3 className="font-bold text-xl">No bookings yet</h3><p className="text-slate-500 text-sm mt-1">When a customer books your service, it will show here.</p></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            {bookings.map((b) => {
              const st = b.status || "Pending";
              const isRequested = st === "Pending" || st === "Requested";
              const isAccepted = st === "Accepted";
              const isProgress = st === "In Progress" || st === "In-Progress";
              return (
                <div key={b._id} className="bg-white border rounded-3xl p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold">{getBookingTitle(b)}</h3>
                    <span className={"px-3 py-1 rounded-full text-xs font-bold shrink-0 " + statusColor(st)}>{st}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">Customer: {b.customerName || b.name || "Customer"} - {b.phone || ""}</p>
                  <p className="text-sm text-slate-500">Date: {b.scheduledDate || b.date || "Not set"} - {b.scheduledTime || b.timeSlot || ""}</p>
                  {b.address && <p className="text-sm text-slate-500">Address: {b.address}</p>}
                  {b.problem && <p className="text-sm text-slate-600 mt-2 bg-slate-50 rounded-xl p-3">Problem: {b.problem}</p>}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <p className="font-extrabold">{b.finalAmount ?? b.price ?? 0} Tk - <span className="text-xs font-bold text-slate-500">{b.paymentStatus || "Unpaid"}</span></p>
                    <div className="flex gap-2 flex-wrap justify-end">
                      {isRequested && (
                        <>
                          <button onClick={() => updateBookingStatus(b, "Accepted")} disabled={actionLoading} className="px-4 py-2 rounded-full bg-emerald-600 text-white text-sm font-bold disabled:opacity-50">Accept</button>
                          <button onClick={() => updateBookingStatus(b, "Rejected")} disabled={actionLoading} className="px-4 py-2 rounded-full border border-red-200 text-red-600 text-sm font-bold disabled:opacity-50">Reject</button>
                        </>
                      )}
                      {isAccepted && <button onClick={() => updateBookingStatus(b, "In Progress")} disabled={actionLoading} className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-bold disabled:opacity-50">Start Work</button>}
                      {isProgress && <button onClick={() => { setCompleting(b); setFinalAmount(b.finalAmount ?? b.price ?? 0); }} className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-bold">Mark Completed</button>}
                      {(st === "Completed") && <span className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">Completed</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Add / Edit Service Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSaveService} className="bg-white rounded-3xl p-6 w-full max-w-lg my-8">
            <h3 className="font-extrabold text-xl">{editing ? "Edit Service" : "Add New Service"}</h3>
            <p className="text-sm text-slate-500 mt-1">{editing ? "Edit korle service abar Pending e jabe." : "New service will go to admin for approval."}</p>
            <div className="flex flex-col gap-3 mt-4">
              <div><label className="text-xs font-bold text-slate-500">TITLE</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full border rounded-xl px-4 py-3 text-sm outline-none mt-1" placeholder="Laptop Screen Replacement" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-bold text-slate-500">CATEGORY</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border rounded-xl px-4 py-3 text-sm mt-1 bg-white">{CATS.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
                <div><label className="text-xs font-bold text-slate-500">SERVICE MODE</label><select value={form.serviceMode} onChange={(e) => setForm({ ...form, serviceMode: e.target.value })} className="w-full border rounded-xl px-4 py-3 text-sm mt-1 bg-white">{MODES.map((m) => <option key={m} value={m}>{m}</option>)}</select></div>
              </div>
              <div><label className="text-xs font-bold text-slate-500">DESCRIPTION - Min 20 characters</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className="w-full border rounded-xl px-4 py-3 text-sm outline-none mt-1 resize-none" placeholder="Describe the service in detail..." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-bold text-slate-500">PRICE (Tk)</label><input type="number" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })} required min={100} className="w-full border rounded-xl px-4 py-3 text-sm outline-none mt-1" /></div>
                <div><label className="text-xs font-bold text-slate-500">DURATION</label><input value={form.estimatedDuration} onChange={(e) => setForm({ ...form, estimatedDuration: e.target.value })} className="w-full border rounded-xl px-4 py-3 text-sm outline-none mt-1" placeholder="1 hour" /></div>
              </div>
              <div><label className="text-xs font-bold text-slate-500">SERVICE AREA</label><input value={form.serviceArea} onChange={(e) => setForm({ ...form, serviceArea: e.target.value })} className="w-full border rounded-xl px-4 py-3 text-sm outline-none mt-1" placeholder="Dhaka" /></div>
              <div>
                <label className="text-xs font-bold text-slate-500">SERVICE IMAGE</label>
                <input value={form.image} onChange={(e) => { setForm({ ...form, image: e.target.value }); setImagePreview(e.target.value); }} className="w-full border rounded-xl px-4 py-3 text-sm outline-none mt-1" placeholder="Paste image URL" />
                <p className="text-xs text-slate-400 my-2 text-center">OR upload from device</p>
                <input type="file" accept="image/*" onChange={handleImageFile} className="w-full border rounded-xl px-4 py-3 text-sm bg-slate-50" />
                {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-xl mt-3" />}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-full border font-bold text-sm">Cancel</button>
              <button type="submit" disabled={saving} className="flex-1 py-3 rounded-full bg-blue-600 text-white font-bold text-sm disabled:opacity-50">{saving ? "Saving..." : editing ? "Save & Send for Approval" : "Add Service"}</button>
            </div>
          </form>
        </div>
      )}

      {/* Final Amount Modal */}
      {completing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <h3 className="font-extrabold text-xl">Mark as Completed</h3>
            <p className="text-sm text-slate-500 mt-1">Enter final amount for <b className="text-slate-900">{getBookingTitle(completing)}</b>. Customer will pay this amount by card.</p>
            <label className="text-xs font-bold text-slate-500 block mt-4">FINAL AMOUNT (Tk)</label>
            <input type="number" value={finalAmount} onChange={(e) => setFinalAmount(Number(e.target.value))} min={100} className="w-full border rounded-xl px-4 py-3 text-sm outline-none mt-1 font-bold" />
            <div className="flex gap-3 mt-6">
              <button onClick={() => setCompleting(null)} className="flex-1 py-3 rounded-full border font-bold text-sm">Cancel</button>
              <button onClick={confirmComplete} disabled={actionLoading} className="flex-1 py-3 rounded-full bg-slate-900 text-white font-bold text-sm disabled:opacity-50">{actionLoading ? "Saving..." : "Complete"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleting && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <h3 className="font-extrabold text-xl">Delete Service?</h3>
            <p className="text-sm text-slate-500 mt-2">Are you sure you want to delete <b className="text-slate-900">{deleting.title}</b>?</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleting(null)} className="flex-1 py-3 rounded-full border font-bold text-sm">Keep</button>
              <button onClick={confirmDelete} className="flex-1 py-3 rounded-full bg-red-600 text-white font-bold text-sm">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
