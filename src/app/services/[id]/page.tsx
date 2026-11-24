"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Service = {
  _id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  technician: string;
  image: string;
};

const demoServices: Service[] = [
  { _id: "demo1", title: "Laptop Screen Replacement", category: "Laptop", description: "Cracked or flickering laptop screen replaced with original display. Full testing before delivery.", price: 2500, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo2", title: "Laptop Battery Replacement", category: "Laptop", description: "Battery drains fast. Replaced with original battery. 90 days warranty.", price: 1800, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo3", title: "Laptop Keyboard Repair", category: "Laptop", description: "Keys not working. Keyboard cleaned or replaced.", price: 1200, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo4", title: "Laptop Motherboard Repair", category: "Laptop", description: "Laptop not turning on. Chip-level motherboard repair.", price: 3500, duration: "3 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo5", title: "Laptop Charging Port Repair", category: "Laptop", description: "Not charging. Charging port fixed.", price: 900, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo6", title: "Laptop Software Setup", category: "Laptop", description: "Windows setup, virus removal, speed optimization.", price: 800, duration: "2 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo7", title: "Mobile Screen Replacement", category: "Mobile", description: "Broken mobile display replaced with original display.", price: 1800, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo8", title: "Mobile Battery Replacement", category: "Mobile", description: "Battery drains fast. Original battery replacement.", price: 1200, duration: "45 min", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo9", title: "Mobile Charging Port Repair", category: "Mobile", description: "Not charging. Port cleaned or replaced.", price: 700, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1601524909162-ae8725290836?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo10", title: "Mobile Camera Repair", category: "Mobile", description: "Blurry camera. Camera module replaced.", price: 1500, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo11", title: "Mobile Software Unlock", category: "Mobile", description: "Forgot password, hanging. Flash and unlock done.", price: 600, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo12", title: "Mobile Water Damage Repair", category: "Mobile", description: "Water damaged phone. Cleaning and full checkup.", price: 2000, duration: "3 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo13", title: "PC Motherboard Repair", category: "PC", description: "Desktop not turning on. Chip-level repair.", price: 3000, duration: "3 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo14", title: "PC Power Supply Repair", category: "PC", description: "PC shuts down suddenly. PSU repaired.", price: 1500, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo15", title: "PC RAM Upgrade", category: "PC", description: "Slow PC. RAM upgrade plus SSD setup.", price: 1000, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1541029071515-84cc9ea1b4c5?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo16", title: "PC Data Recovery", category: "PC", description: "Deleted files, photos recovered.", price: 2500, duration: "4 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo17", title: "Tablet Screen Replacement", category: "Tablet", description: "Broken tablet screen replaced.", price: 2200, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo18", title: "Tablet Battery Replacement", category: "Tablet", description: "Tablet battery replaced with original.", price: 1600, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo19", title: "Printer Repair", category: "PC", description: "Paper jam, blurry print. Full service.", price: 900, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo20", title: "WiFi Router Setup", category: "PC", description: "Router setup, slow WiFi fix.", price: 1200, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=1000&q=80" },
];

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: session } = authClient.useSession();
  const user: any = (session as any)?.user;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [timeSlot, setTimeSlot] = useState("10:00 AM - 12:00 PM");

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);

  function addDays(n: number) {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().split("T")[0];
  }

  function formatDateLabel(d: string) {
    if (!d) return "";
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  }

  useEffect(() => {
    const found = demoServices.find((s) => s._id === id);
    if (found) {
      setService(found);
      setLoading(false);
      return;
    }
    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/services/" + id)
      .then((r) => r.json())
      .then((d) => {
        const s = d.data || d.service || d;
        if (s && s.title) {
          const demo = demoServices.find((x) => x.title.toLowerCase() === (s.title || "").toLowerCase());
          setService({
            _id: s._id || id,
            title: s.title,
            category: s.category || "Laptop",
            description: s.description || "Professional repair service.",
            price: s.price ?? s.basePrice ?? 1000,
            duration: s.duration || "2 hours",
            technician: s.technician || "Verified Technician",
            image: s.image || demo?.image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80",
          });
        } else {
          setService(demoServices[0]);
        }
      })
      .catch(() => setService(demoServices[0]))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user) setName(user.name || "");
    const saved = JSON.parse(localStorage.getItem("fixmate-profile") || "{}");
    if (saved.phone) setPhone(saved.phone);
    if (saved.address) setAddress(saved.address);
  }, [user]);

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push("/signin");
      return;
    }
    if (!phone || !address || !date) {
      setMsg("Please fill phone, address and date.");
      return;
    }
    if (date < today) {
      setMsg("Past date cannot be selected. Please choose today or a future date.");
      return;
    }
    setBookingLoading(true);
    setMsg("");
    const payload = {
      serviceId: service?._id,
      serviceTitle: service?.title,
      title: service?.title,
      price: service?.price,
      name,
      phone,
      address,
      date,
      timeSlot,
      status: "Pending",
      paymentStatus: "Unpaid",
      email: user.email,
    };
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push("/dashboard/customer");
        return;
      }
      throw new Error("API failed");
    } catch {
      const old = JSON.parse(localStorage.getItem("fixmate-bookings") || "[]");
      old.push({ ...payload, _id: "local-" + Date.now() });
      localStorage.setItem("fixmate-bookings", JSON.stringify(old));
      setMsg("Booking saved! Our team will call you in 30 minutes.");
      setTimeout(() => router.push("/dashboard/customer"), 1200);
    } finally {
      setBookingLoading(false);
    }
  }

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center font-bold">Loading...</div>;
  if (!service) return <div className="max-w-7xl mx-auto px-4 py-20 text-center"><h1 className="font-bold text-2xl">Service not found</h1><Link href="/services" className="text-blue-600 font-bold">Back to Services</Link></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <style>{`input[type="date"]::-webkit-calendar-picker-indicator{opacity:0.6;cursor:pointer;padding:4px;} input[type="date"]{color-scheme:light;} input[type="date"]::-webkit-datetime-edit{color:#0f172a;font-weight:600;}`}</style>
      <p className="text-sm text-slate-500"><Link href="/" className="hover:text-blue-600">Home</Link> / <Link href="/services" className="hover:text-blue-600">Services</Link> / <span className="text-slate-900 font-bold">{service.title}</span></p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-5">
        <div>
          <div className="rounded-3xl overflow-hidden border bg-slate-100">
            <img src={service.image} alt={service.title} className="w-full h-80 md:h-96 object-cover" />
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div className="bg-white border rounded-2xl p-3 text-center"><p className="text-xs text-slate-500 font-bold">DURATION</p><p className="font-bold mt-1">{service.duration}</p></div>
            <div className="bg-white border rounded-2xl p-3 text-center"><p className="text-xs text-slate-500 font-bold">WARRANTY</p><p className="font-bold mt-1">30 Days</p></div>
            <div className="bg-white border rounded-2xl p-3 text-center"><p className="text-xs text-slate-500 font-bold">RATING</p><p className="font-bold mt-1">4.9 / 5.0</p></div>
          </div>
          <div className="bg-white border rounded-3xl p-5 mt-4">
            <h3 className="font-bold text-lg">What is included?</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>Free pickup and delivery in Dhaka</li>
              <li>Original parts with 30 days warranty</li>
              <li>Verified technician at your home</li>
              <li>Pay after repair - Cash or Online</li>
            </ul>
          </div>
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">{service.category}</span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-3 leading-tight">{service.title}</h1>
          <p className="text-slate-500 mt-2">{service.description}</p>
          <div className="flex items-center gap-3 mt-4">
            <p className="text-3xl font-extrabold">{service.price} Tk</p>
            <p className="text-sm text-slate-400 line-through">{Math.round(service.price * 1.2)} Tk</p>
            <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">20% OFF</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Technician: {service.technician} | Duration: {service.duration}</p>

          <form onSubmit={handleBooking} className="bg-white border rounded-3xl p-5 md:p-6 mt-6 shadow-sm">
            <h2 className="font-extrabold text-xl">Book This Service</h2>
            <p className="text-sm text-slate-500 mt-1">Fill the form - technician will call you in 30 minutes.</p>
            {msg && <p className="mt-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl px-4 py-3 text-sm font-bold">{msg}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div>
                <label className="text-xs font-bold text-slate-500">YOUR NAME</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required className="border rounded-xl px-4 py-3 text-sm outline-none w-full mt-1 focus:border-blue-600 bg-white font-semibold" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">PHONE NUMBER</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01326-548954" required className="border rounded-xl px-4 py-3 text-sm outline-none w-full mt-1 focus:border-blue-600 bg-white font-semibold" />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500">BOOKING DATE</label>
                <div className="flex gap-2 mt-1.5">
                  <button type="button" onClick={() => setDate(addDays(0))} className={date === addDays(0) ? "px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold" : "px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-bold"}>Today</button>
                  <button type="button" onClick={() => setDate(addDays(1))} className={date === addDays(1) ? "px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold" : "px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-bold"}>Tomorrow</button>
                  <button type="button" onClick={() => setDate(addDays(2))} className={date === addDays(2) ? "px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold" : "px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-bold"}>Day After</button>
                </div>
                <div className="relative mt-2">
                  <input value={date} onChange={(e) => setDate(e.target.value)} type="date" min={today} required className="border rounded-xl px-4 py-3 pr-12 text-sm outline-none w-full focus:border-blue-600 bg-slate-50 font-bold text-slate-900" />
                  <span className="absolute right-3 top-3 bg-blue-600 text-white px-2.5 py-1 rounded-full text-xs font-bold pointer-events-none">{formatDateLabel(date)}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Past dates are disabled. You can pick today or any future date.</p>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500">TIME SLOT</label>
                <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} className="border rounded-xl px-4 py-3 text-sm outline-none w-full bg-white mt-1 font-semibold">
                  <option>10:00 AM - 12:00 PM</option>
                  <option>12:00 PM - 02:00 PM</option>
                  <option>02:00 PM - 04:00 PM</option>
                  <option>04:00 PM - 06:00 PM</option>
                  <option>06:00 PM - 08:00 PM</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500">FULL ADDRESS</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House, Road, Area - Dhaka" required className="border rounded-xl px-4 py-3 text-sm outline-none w-full mt-1 focus:border-blue-600 bg-white font-semibold" />
              </div>
            </div>
            <button type="submit" disabled={bookingLoading} className="w-full mt-4 py-3.5 rounded-full bg-blue-600 text-white font-bold text-sm disabled:opacity-50">{bookingLoading ? "Booking..." : user ? "Confirm Booking - " + service.price + " Tk" : "Sign In to Book"}</button>
            <p className="text-xs text-center text-slate-400 mt-3">No advance payment needed. Pay after repair.</p>
          </form>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-extrabold text-2xl">Related Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {demoServices.filter((s) => s.category === service.category && s._id !== service._id).slice(0, 4).map((s) => (
            <Link key={s._id} href={"/services/" + s._id} className="bg-white border rounded-3xl overflow-hidden hover:shadow-lg transition">
              <img src={s.image} alt={s.title} className="w-full h-40 object-cover" />
              <div className="p-4"><p className="font-bold text-sm">{s.title}</p><p className="font-extrabold text-blue-600 mt-1">{s.price} Tk</p></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
