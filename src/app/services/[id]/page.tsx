"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Service = {
  _id: string;
  slug?: string;
  title: string;
  category: string;
  description: string;
  price?: number;
  basePrice?: number;
  duration?: string;
  estimatedDuration?: string;
  technician?: string;
  technicianName?: string;
  image: string;
  serviceMode?: string;
  serviceArea?: string;
};

function toSlug(title: string) {
  return String(title || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const demoServices: Service[] = [
  { _id: "demo1", title: "Laptop Screen Replacement", category: "Laptop & PC", description: "Cracked or flickering laptop screen replaced with original display. Full testing before delivery.", price: 2500, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo2", title: "Laptop Battery Replacement", category: "Laptop & PC", description: "Battery drains fast. Replaced with original battery. 90 days warranty.", price: 1800, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo3", title: "Laptop Keyboard Repair", category: "Laptop & PC", description: "Keys not working. Keyboard cleaned or replaced.", price: 1200, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo4", title: "Laptop Motherboard Repair", category: "Laptop & PC", description: "Laptop not turning on. Chip-level motherboard repair.", price: 3500, duration: "3 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo5", title: "Laptop Charging Port Repair", category: "Laptop & PC", description: "Not charging. Charging port fixed.", price: 900, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo6", title: "Laptop Software Setup", category: "Laptop & PC", description: "Windows setup, virus removal, speed optimization.", price: 800, duration: "2 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo7", title: "Mobile Screen Replacement", category: "Smartphone", description: "Broken mobile display replaced with original display.", price: 1800, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo8", title: "Mobile Battery Replacement", category: "Smartphone", description: "Battery drains fast. Original battery replacement.", price: 1200, duration: "45 min", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo9", title: "Mobile Charging Port Repair", category: "Smartphone", description: "Not charging. Port cleaned or replaced.", price: 700, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1601524909162-ae8725290836?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo10", title: "Mobile Camera Repair", category: "Smartphone", description: "Blurry camera. Camera module replaced.", price: 1500, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo11", title: "Mobile Software Unlock", category: "Smartphone", description: "Forgot password, hanging. Flash and unlock done.", price: 600, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo12", title: "Mobile Water Damage Repair", category: "Smartphone", description: "Water damaged phone. Cleaning and full checkup.", price: 2000, duration: "3 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo13", title: "PC Motherboard Repair", category: "Laptop & PC", description: "Desktop not turning on. Chip-level repair.", price: 3000, duration: "3 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo14", title: "PC Power Supply Repair", category: "Laptop & PC", description: "PC shuts down suddenly. PSU repaired.", price: 1500, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo15", title: "PC RAM Upgrade", category: "Laptop & PC", description: "Slow PC. RAM upgrade plus SSD setup.", price: 1000, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1541029071515-84cc9ea1b4c5?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo16", title: "PC Data Recovery", category: "Laptop & PC", description: "Deleted files, photos recovered.", price: 2500, duration: "4 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo17", title: "Tablet Screen Replacement", category: "Smartphone", description: "Broken tablet screen replaced.", price: 2200, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo18", title: "Tablet Battery Replacement", category: "Smartphone", description: "Tablet battery replaced with original.", price: 1600, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo19", title: "Printer Repair", category: "Laptop & PC", description: "Paper jam, blurry print. Full service.", price: 900, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo20", title: "WiFi Router Setup", category: "Electrical", description: "Router setup, slow WiFi fix.", price: 1200, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo21", title: "AC Gas Refill", category: "AC", description: "AC not cooling. Gas check, refill and full cooling test.", price: 2500, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1631545806609-24040d63f93a?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo22", title: "AC Installation", category: "AC", description: "New AC installation with copper pipe, bracket and testing.", price: 3500, duration: "2 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo23", title: "AC Cooling Problem Repair", category: "AC", description: "AC runs but not cooling. Sensor, fan and gas checked.", price: 1800, duration: "2 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo24", title: "Refrigerator Cooling Problem", category: "Refrigerator", description: "Fridge not cooling. Thermostat, fan and gas checked.", price: 2000, duration: "2 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo25", title: "Refrigerator Compressor Repair", category: "Refrigerator", description: "Compressor sound problem or not starting. Repair or replace.", price: 3500, duration: "3 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo26", title: "Refrigerator Gas Refill", category: "Refrigerator", description: "Fridge gas refill with leak test.", price: 2200, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo27", title: "TV Display Repair", category: "TV", description: "TV display line, black screen or flicker problem repair.", price: 2800, duration: "2 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo28", title: "TV Sound Problem Repair", category: "TV", description: "No sound or low sound. Speaker and board checked.", price: 1200, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo29", title: "TV Backlight Repair", category: "TV", description: "TV sound comes but no picture. Backlight replaced.", price: 3000, duration: "2 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo30", title: "Washing Machine Drum Repair", category: "Washing Machine", description: "Drum noise, vibration or not spinning. Drum and bearing checked.", price: 2000, duration: "2 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo31", title: "Washing Machine Drainage Problem", category: "Washing Machine", description: "Water not draining. Pump and pipe cleaned or replaced.", price: 1200, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo32", title: "Washing Machine Motor Repair", category: "Washing Machine", description: "Machine not starting or motor sound problem. Motor checked.", price: 2500, duration: "2 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo33", title: "Ceiling Fan Repair", category: "Electrical", description: "Fan slow, sound or not working. Capacitor and winding checked.", price: 800, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80" },
  { _id: "demo34", title: "House Wiring & Switch Repair", category: "Electrical", description: "Switch, socket, wiring and short circuit repair.", price: 1500, duration: "2 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1000&q=80" },
];

function getLocalDateStr(d: Date) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

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
  const [errMsg, setErrMsg] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [problem, setProblem] = useState("");
  const [timeSlot, setTimeSlot] = useState("10:00 AM - 12:00 PM");
  const [hasActiveBooking, setHasActiveBooking] = useState(false);

  const today = getLocalDateStr(new Date());
  const [date, setDate] = useState(today);

  const isNonCustomer = !!user && user.role !== "customer";
  const price = service?.basePrice ?? service?.price ?? 1000;
  const duration = service?.estimatedDuration || service?.duration || "2 hours";
  const technician = service?.technicianName || service?.technician || "Verified Technician";

  function addDays(n: number) {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return getLocalDateStr(d);
  }

  function formatDateLabel(d: string) {
    if (!d) return "";
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      const found = demoServices.find((s) => toSlug(s.title) === id || s._id === id);
      if (found) {
        setService({ ...found, _id: toSlug(found.title), slug: toSlug(found.title) });
        setLoading(false);
        return;
      }
      try {
        const listRes = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/services");
        const listData = await listRes.json();
        const list = Array.isArray(listData) ? listData : listData.data || [];
        const match = list.find((s: any) => toSlug(s.title || s.name || "") === id || String(s._id) === id || s.slug === id);
        if (match) {
          const p = match.basePrice ?? match.price ?? 1000;
          const demo = demoServices.find((x) => x.title.toLowerCase() === (match.title || "").toLowerCase());
          setService({
            _id: match._id || id,
            slug: toSlug(match.title || ""),
            title: match.title,
            category: match.category || "Laptop & PC",
            description: match.description || "Professional repair service.",
            price: p,
            basePrice: p,
            duration: match.estimatedDuration || match.duration || "2 hours",
            estimatedDuration: match.estimatedDuration || match.duration || "2 hours",
            technician: match.technicianName || match.technician || "Verified Technician",
            technicianName: match.technicianName || match.technician || "Verified Technician",
            image: match.image || match.imageUrl || demo?.image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80",
            serviceMode: match.serviceMode || "Home Visit",
            serviceArea: match.serviceArea || "Dhaka",
          });
          setLoading(false);
          return;
        }
        const r = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/services/" + id);
        const d = await r.json();
        const s = d.data || d.service || d;
        if (s && s.title) {
          const demo = demoServices.find((x) => x.title.toLowerCase() === (s.title || "").toLowerCase());
          const p = s.basePrice ?? s.price ?? 1000;
          setService({
            _id: s._id || id,
            slug: toSlug(s.title),
            title: s.title,
            category: s.category || "Laptop & PC",
            description: s.description || "Professional repair service.",
            price: p,
            basePrice: p,
            duration: s.estimatedDuration || s.duration || "2 hours",
            estimatedDuration: s.estimatedDuration || s.duration || "2 hours",
            technician: s.technicianName || s.technician || "Verified Technician",
            technicianName: s.technicianName || s.technician || "Verified Technician",
            image: s.image || s.imageUrl || demo?.image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80",
            serviceMode: s.serviceMode || "Home Visit",
            serviceArea: s.serviceArea || "Dhaka",
          });
        } else {
          setService(null);
        }
      } catch {
        setService(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // FIX - Profile theke auto-fill, kintu user chaile change korte parbe
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("fixmate-profile") || "{}");
      setName((prev) => prev || saved.name || saved.fullName || user?.name || "");
      setEmail((prev) => prev || saved.email || user?.email || "");
      setPhone((prev) => prev || saved.phone || saved.phoneNumber || user?.phone || user?.phoneNumber || "");
      setAddress((prev) => prev || saved.address || saved.fullAddress || user?.address || "");
    } catch {
      if (user) {
        setName((prev) => prev || user.name || "");
        setEmail((prev) => prev || user.email || "");
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user || !service) return;
    async function checkDuplicate() {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/bookings", { credentials: "include" });
        const d = await res.json();
        const list = Array.isArray(d) ? d : d.data || d.bookings || [];
        const active = ["Pending", "Requested", "Accepted", "In Progress", "In-Progress", "Confirmed"];
        const found = list.some((b: any) => {
          const sid = b.serviceId?._id || b.serviceId || b.service?._id || b.service;
          const sameService = String(sid) === String(service?._id) || b.serviceTitle === service?.title || b.title === service?.title;
          const sameUser = !b.email || b.email === user.email || b.userEmail === user.email;
          return sameService && sameUser && active.includes(b.status);
        });
        if (found) setHasActiveBooking(true);
      } catch {
        const old = JSON.parse(localStorage.getItem("fixmate-bookings") || "[]");
        const found = old.some((b: any) => (b.serviceId === service?._id || b.serviceTitle === service?.title) && ["Pending", "Requested", "Accepted", "In Progress"].includes(b.status));
        if (found) setHasActiveBooking(true);
      }
    }
    checkDuplicate();
  }, [user, service]);

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault();
    setErrMsg("");
    setMsg("");
    if (!user) {
      router.push("/sign-in");
      return;
    }
    if (isNonCustomer) {
      setErrMsg("Only customers can request a service. Please sign in as a customer.");
      return;
    }
    if (hasActiveBooking) {
      setErrMsg("You already have an active request for this service. Please check your dashboard.");
      return;
    }
    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim() || !date) {
      setErrMsg("Please fill name, email, phone, address and date.");
      return;
    }
    // FIX - Kono limit nai, je kono text dilei booking confirm hobe
    // Sudhu ekdom khali rakhle atke dibe
    if (!problem || !problem.trim()) {
      setErrMsg("Please describe your problem in a few words.");
      return;
    }
    if (date < today) {
      setErrMsg("Past date cannot be selected. Please choose today or a future date.");
      return;
    }
    setBookingLoading(true);
    const payload = {
      serviceId: service?._id,
      serviceTitle: service?.title,
      title: service?.title,
      price: price,
      basePrice: price,
      name: name.trim(),
      email: email.trim(),
      userEmail: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      date,
      scheduledDate: date,
      timeSlot,
      scheduledTime: timeSlot,
      problem: problem.trim(),
      status: "Pending",
      paymentStatus: "Unpaid",
    };
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        const bookingId = data._id || data.booking?._id || data.data?._id || "local-" + Date.now();
        router.push("/payment?bookingId=" + bookingId);
        return;
      }
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "API failed");
    } catch (err: any) {
      if (err?.message?.toLowerCase().includes("already") || err?.message?.toLowerCase().includes("active")) {
        setErrMsg("You already have an active request for this service.");
        setBookingLoading(false);
        return;
      }
      const newId = "local-" + Date.now();
      const old = JSON.parse(localStorage.getItem("fixmate-bookings") || "[]");
      old.push({ ...payload, _id: newId });
      localStorage.setItem("fixmate-bookings", JSON.stringify(old));
      router.push("/payment?bookingId=" + newId);
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
            <div className="bg-white border rounded-2xl p-3 text-center"><p className="text-xs text-slate-500 font-bold">DURATION</p><p className="font-bold mt-1">{duration}</p></div>
            <div className="bg-white border rounded-2xl p-3 text-center"><p className="text-xs text-slate-500 font-bold">WARRANTY</p><p className="font-bold mt-1">30 Days</p></div>
            <div className="bg-white border rounded-2xl p-3 text-center"><p className="text-xs text-slate-500 font-bold">RATING</p><p className="font-bold mt-1">4.9 / 5.0</p></div>
          </div>
          <div className="bg-white border rounded-3xl p-5 mt-4">
            <h3 className="font-bold text-lg">What is included?</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>Free pickup and delivery in Dhaka</li>
              <li>Original parts with 30 days warranty</li>
              <li>Verified technician at your home</li>
              <li>Secure card payment after booking</li>
            </ul>
          </div>
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">{service.category}</span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-3 leading-tight">{service.title}</h1>
          <p className="text-slate-500 mt-2">{service.description}</p>
          <div className="flex items-center gap-3 mt-4">
            <p className="text-3xl font-extrabold">{price} Tk</p>
            <p className="text-sm text-slate-400 line-through">{Math.round(price * 1.2)} Tk</p>
            <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">20% OFF</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Technician: {technician} | Duration: {duration} | {service.serviceMode || "Home Visit"} | {service.serviceArea || "Dhaka"}</p>

          <form onSubmit={handleBooking} className="bg-white border rounded-3xl p-5 md:p-6 mt-6 shadow-sm">
            <h2 className="font-extrabold text-xl">Book This Service</h2>
            <p className="text-sm text-slate-500 mt-1">Fill the form - technician will call you in 30 minutes.</p>
            {isNonCustomer && <p className="mt-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl px-4 py-3 text-sm font-bold">Only customers can request a service. Please sign in as a customer.</p>}
            {hasActiveBooking && !isNonCustomer && (
              <div className="mt-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl px-4 py-3 text-sm font-bold">
                You already have an active request for this service. <Link href="/dashboard/customer" className="text-blue-600 underline">View in Dashboard</Link>
              </div>
            )}
            {errMsg && <p className="mt-3 bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 text-sm font-bold">{errMsg}</p>}
            {msg && <p className="mt-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl px-4 py-3 text-sm font-bold">{msg}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div>
                <label className="text-xs font-bold text-slate-500">YOUR NAME</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required disabled={isNonCustomer || hasActiveBooking} className="border rounded-xl px-4 py-3 text-sm outline-none w-full mt-1 focus:border-blue-600 bg-white font-semibold disabled:bg-slate-50" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">EMAIL</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your Email" required disabled={isNonCustomer || hasActiveBooking} className="border rounded-xl px-4 py-3 text-sm outline-none w-full mt-1 focus:border-blue-600 bg-white font-semibold disabled:bg-slate-50" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">PHONE NUMBER</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01326-548954" required disabled={isNonCustomer || hasActiveBooking} className="border rounded-xl px-4 py-3 text-sm outline-none w-full mt-1 focus:border-blue-600 bg-white font-semibold disabled:bg-slate-50" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">FULL ADDRESS</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House, Road, Area - Dhaka" required disabled={isNonCustomer || hasActiveBooking} className="border rounded-xl px-4 py-3 text-sm outline-none w-full mt-1 focus:border-blue-600 bg-white font-semibold disabled:bg-slate-50" />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500">DESCRIBE YOUR PROBLEM <span className="text-red-500">*</span></label>
                <textarea value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="Example: My laptop screen is cracked on the right side and flickering when I open it..." rows={3} required disabled={isNonCustomer || hasActiveBooking} className="border rounded-xl px-4 py-3 text-sm outline-none w-full mt-1 focus:border-blue-600 bg-white font-medium resize-none disabled:bg-slate-50" />
                <p className="text-xs text-slate-400 mt-1">Please write in a few words - what happened, when it started, any sound or error.</p>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500">BOOKING DATE</label>
                <div className="flex gap-2 mt-1.5">
                  <button type="button" disabled={isNonCustomer || hasActiveBooking} onClick={() => setDate(addDays(0))} className={date === addDays(0) ? "px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold" : "px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-bold"}>Today</button>
                  <button type="button" disabled={isNonCustomer || hasActiveBooking} onClick={() => setDate(addDays(1))} className={date === addDays(1) ? "px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold" : "px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-bold"}>Tomorrow</button>
                  <button type="button" disabled={isNonCustomer || hasActiveBooking} onClick={() => setDate(addDays(2))} className={date === addDays(2) ? "px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold" : "px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-bold"}>Day After</button>
                </div>
                <div className="relative mt-2">
                  <input value={date} onChange={(e) => setDate(e.target.value)} type="date" min={today} required disabled={isNonCustomer || hasActiveBooking} className="border rounded-xl px-4 py-3 pr-12 text-sm outline-none w-full focus:border-blue-600 bg-slate-50 font-bold text-slate-900 disabled:opacity-60" />
                  <span className="absolute right-3 top-3 bg-blue-600 text-white px-2.5 py-1 rounded-full text-xs font-bold pointer-events-none">{formatDateLabel(date)}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Past dates are disabled. You can pick today or any future date.</p>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500">TIME SLOT</label>
                <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} disabled={isNonCustomer || hasActiveBooking} className="border rounded-xl px-4 py-3 text-sm outline-none w-full bg-white mt-1 font-semibold disabled:bg-slate-50">
                  <option>10:00 AM - 12:00 PM</option>
                  <option>12:00 PM - 02:00 PM</option>
                  <option>02:00 PM - 04:00 PM</option>
                  <option>04:00 PM - 06:00 PM</option>
                  <option>06:00 PM - 08:00 PM</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={bookingLoading || isNonCustomer || hasActiveBooking} className="w-full mt-4 py-3.5 rounded-full bg-blue-600 text-white font-bold text-sm disabled:opacity-50 disabled:bg-slate-400">
              {bookingLoading ? "Booking..." : isNonCustomer ? "Only customers can request" : hasActiveBooking ? "Already Requested - View Dashboard" : user ? "Confirm Booking - " + price + " Tk" : "Sign In to Book"}
            </button>
            <p className="text-xs text-center text-slate-400 mt-3">You will be redirected to secure card payment after booking.</p>
          </form>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-extrabold text-2xl">Related Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {demoServices.filter((s) => s.category === service.category && toSlug(s.title) !== toSlug(service.title)).slice(0, 4).map((s) => (
            <Link key={toSlug(s.title)} href={"/services/" + toSlug(s.title)} className="bg-white border rounded-3xl overflow-hidden hover:shadow-lg transition">
              <img src={s.image} alt={s.title} className="w-full h-40 object-cover" />
              <div className="p-4"><p className="font-bold text-sm">{s.title}</p><p className="font-extrabold text-blue-600 mt-1">{s.basePrice ?? s.price} Tk</p></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
