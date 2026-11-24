"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type Service = {
  _id: string;
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
  status?: string;
};

const demoServices: Service[] = [
  { _id: "demo1", title: "Laptop Screen Replacement", category: "Laptop & PC", description: "Cracked or flickering laptop screen replaced with original display.", price: 2500, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo2", title: "Laptop Battery Replacement", category: "Laptop & PC", description: "Battery drains fast. Replaced with original battery. 90 days warranty.", price: 1800, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo3", title: "Laptop Keyboard Repair", category: "Laptop & PC", description: "Keys not working. Keyboard cleaned or replaced.", price: 1200, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo4", title: "Laptop Motherboard Repair", category: "Laptop & PC", description: "Laptop not turning on. Chip-level motherboard repair.", price: 3500, duration: "3 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80", serviceMode: "Shop Drop-off", status: "Approved" },
  { _id: "demo5", title: "Laptop Charging Port Repair", category: "Laptop & PC", description: "Not charging. Charging port fixed.", price: 900, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo6", title: "Laptop Software Setup", category: "Laptop & PC", description: "Windows setup, virus removal, speed optimization.", price: 800, duration: "2 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo7", title: "Mobile Screen Replacement", category: "Smartphone", description: "Broken mobile display replaced with original display.", price: 1800, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo8", title: "Mobile Battery Replacement", category: "Smartphone", description: "Battery drains fast. Original battery replacement.", price: 1200, duration: "45 min", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo9", title: "Mobile Charging Port Repair", category: "Smartphone", description: "Not charging. Port cleaned or replaced.", price: 700, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1601524909162-ae8725290836?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo10", title: "Mobile Camera Repair", category: "Smartphone", description: "Blurry camera. Camera module replaced.", price: 1500, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80", serviceMode: "Shop Drop-off", status: "Approved" },
  { _id: "demo11", title: "Mobile Software Unlock", category: "Smartphone", description: "Forgot password, hanging. Flash and unlock done.", price: 600, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo12", title: "Mobile Water Damage Repair", category: "Smartphone", description: "Water damaged phone. Cleaning and full checkup.", price: 2000, duration: "3 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80", serviceMode: "Shop Drop-off", status: "Approved" },
  { _id: "demo13", title: "PC Motherboard Repair", category: "Laptop & PC", description: "Desktop not turning on. Chip-level repair.", price: 3000, duration: "3 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80", serviceMode: "Shop Drop-off", status: "Approved" },
  { _id: "demo14", title: "PC Power Supply Repair", category: "Laptop & PC", description: "PC shuts down suddenly. PSU repaired.", price: 1500, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo15", title: "PC RAM Upgrade", category: "Laptop & PC", description: "Slow PC. RAM upgrade plus SSD setup.", price: 1000, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1541029071515-84cc9ea1b4c5?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo16", title: "PC Data Recovery", category: "Laptop & PC", description: "Deleted files, photos recovered.", price: 2500, duration: "4 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80", serviceMode: "Shop Drop-off", status: "Approved" },
  { _id: "demo17", title: "Tablet Screen Replacement", category: "Smartphone", description: "Broken tablet screen replaced.", price: 2200, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo18", title: "Tablet Battery Replacement", category: "Smartphone", description: "Tablet battery replaced with original.", price: 1600, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo19", title: "Printer Repair", category: "Laptop & PC", description: "Paper jam, blurry print. Full service.", price: 900, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo20", title: "WiFi Router Setup", category: "Electrical", description: "Router setup, slow WiFi fix.", price: 1200, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo21", title: "AC Gas Refill", category: "AC", description: "AC not cooling. Gas check, refill and full cooling test.", price: 2500, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1631545806609-24040d63f93a?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo22", title: "AC Installation", category: "AC", description: "New AC installation with copper pipe, bracket and testing.", price: 3500, duration: "2 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo23", title: "AC Cooling Problem Repair", category: "AC", description: "AC runs but not cooling. Sensor, fan and gas checked.", price: 1800, duration: "2 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo24", title: "Refrigerator Cooling Problem", category: "Refrigerator", description: "Fridge not cooling. Thermostat, fan and gas checked.", price: 2000, duration: "2 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo25", title: "Refrigerator Compressor Repair", category: "Refrigerator", description: "Compressor sound problem or not starting. Repair or replace.", price: 3500, duration: "3 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo26", title: "Refrigerator Gas Refill", category: "Refrigerator", description: "Fridge gas refill with leak test.", price: 2200, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo27", title: "TV Display Repair", category: "TV", description: "TV display line, black screen or flicker problem repair.", price: 2800, duration: "2 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo28", title: "TV Sound Problem Repair", category: "TV", description: "No sound or low sound. Speaker and board checked.", price: 1200, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo29", title: "TV Backlight Repair", category: "TV", description: "TV sound comes but no picture. Backlight replaced.", price: 3000, duration: "2 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80", serviceMode: "Shop Drop-off", status: "Approved" },
  { _id: "demo30", title: "Washing Machine Drum Repair", category: "Washing Machine", description: "Drum noise, vibration or not spinning. Drum and bearing checked.", price: 2000, duration: "2 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo31", title: "Washing Machine Drainage Problem", category: "Washing Machine", description: "Water not draining. Pump and pipe cleaned or replaced.", price: 1200, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo32", title: "Washing Machine Motor Repair", category: "Washing Machine", description: "Machine not starting or motor sound problem. Motor checked.", price: 2500, duration: "2 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo33", title: "Ceiling Fan Repair", category: "Electrical", description: "Fan slow, sound or not working. Capacitor and winding checked.", price: 800, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
  { _id: "demo34", title: "House Wiring & Switch Repair", category: "Electrical", description: "Switch, socket, wiring and short circuit repair.", price: 1500, duration: "2 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80", serviceMode: "Home Visit", status: "Approved" },
];

const cats = ["All", "Smartphone", "Laptop & PC", "AC", "Refrigerator", "TV", "Washing Machine", "Electrical"];
const modes = ["All", "Home Visit", "Shop Drop-off"];

function applyFilters(list: Service[], search: string, cat: string, mode: string, sort: string) {
  let out = [...list];
  out = out.filter((s) => {
    if (!s.status) return true;
    return s.status.toLowerCase() === "approved";
  });
  if (cat !== "All") out = out.filter((s) => s.category === cat);
  if (mode !== "All") out = out.filter((s) => (s.serviceMode || "Home Visit") === mode);
  if (search) {
    const q = search.toLowerCase();
    out = out.filter((s) => (s.title + " " + s.description + " " + s.category).toLowerCase().includes(q));
  }
  if (sort === "low") out.sort((a, b) => (a.basePrice ?? a.price ?? 0) - (b.basePrice ?? b.price ?? 0));
  if (sort === "high") out.sort((a, b) => (b.basePrice ?? b.price ?? 0) - (a.basePrice ?? a.price ?? 0));
  return out;
}

function ServicesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const cat = searchParams.get("category") || "All";
  const mode = searchParams.get("mode") || "All";
  const sort = searchParams.get("sort") || "newest";

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => { setSearchInput(search); }, [search]);

  function updateParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (!v || v === "All" || (k === "sort" && v === "newest") || (k === "search" && v === "")) params.delete(k);
      else params.set(k, v);
    });
    const qs = params.toString();
    router.replace(qs ? pathname + "?" + qs : pathname, { scroll: false });
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      const q = new URLSearchParams();
      if (search) q.set("search", search);
      if (cat !== "All") q.set("category", cat);
      if (mode !== "All") q.set("mode", mode);
      if (sort) q.set("sort", sort);
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/services?" + q.toString());
        const d = await res.json();
        const list = Array.isArray(d) ? d : d.data || [];
        if (list.length >= 1) {
          const fixed: Service[] = list.map((s: any, i: number) => {
            const found = demoServices.find((x) => x.title.toLowerCase() === (s.title || "").toLowerCase());
            const price = s.basePrice ?? s.price ?? 1000;
            const rawTech = s.technicianName || s.technician || "Verified Technician";
            const tech = rawTech.toLowerCase().includes("test") ? "Verified Technician" : rawTech;
            return {
              _id: s._id || "api" + i,
              title: s.title || s.name || "Repair Service",
              category: s.category || "Laptop & PC",
              description: s.description || "Professional repair service.",
              price: price,
              basePrice: price,
              duration: s.estimatedDuration || s.duration || "2 hours",
              estimatedDuration: s.estimatedDuration || s.duration || "2 hours",
              technician: tech,
              technicianName: tech,
              image: s.image || s.imageUrl || found?.image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
              serviceMode: s.serviceMode || "Home Visit",
              serviceArea: s.serviceArea || "Dhaka",
              status: s.status || "Approved",
            };
          });
          // FIX - MERGE: Real + Demo eksathe, na hole 1 ta real asle demo lukay jay
          const merged = [
            ...fixed,
            ...demoServices.filter((demo) => !fixed.some((f) => f.title.toLowerCase() === demo.title.toLowerCase())),
          ];
          setServices(applyFilters(merged, search, cat, mode, sort));
        } else {
          setServices(applyFilters(demoServices, search, cat, mode, sort));
        }
      } catch {
        setServices(applyFilters(demoServices, search, cat, mode, sort));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search, cat, mode, sort]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ search: searchInput.trim() });
  }

  function clearAll() {
    router.push("/services");
  }

  const hasFilter = !!search || cat !== "All" || mode !== "All" || sort !== "newest";

  return (
    <div>
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <p className="text-blue-300 text-xs font-bold tracking-widest">ALL SERVICES</p>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-2">What Needs Repair?</h1>
          <p className="text-slate-300 mt-2 max-w-xl text-sm md:text-base">Verified technicians will come to your home. Choose a service, see the price, book in 30 seconds.</p>
          <form onSubmit={handleSearchSubmit} className="mt-6 flex bg-white rounded-full p-1.5 max-w-xl shadow-xl">
            <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search - Laptop, Mobile, Screen..." className="flex-1 px-4 outline-none text-sm text-slate-900 bg-transparent" />
            <button type="submit" className="px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold">Search</button>
          </form>
          <div className="flex gap-6 mt-6 text-sm">
            <span><b>{services.length}</b> <span className="text-slate-400">Services</span></span>
            <span><b>7</b> <span className="text-slate-400">Categories</span></span>
            <span><b>Verified</b> <span className="text-slate-400">Technicians</span></span>
          </div>
        </div>
      </section>

      <section className="sticky top-16 md:top-24 z-30 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            {cats.map((c) => (
              <button key={c} onClick={() => updateParams({ category: c })} className={cat === c ? "px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-bold whitespace-nowrap" : "px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-bold whitespace-nowrap hover:bg-slate-200"}>{c}</button>
            ))}
          </div>
          <div className="flex gap-2 ml-auto">
            <select value={mode} onChange={(e) => updateParams({ mode: e.target.value })} className="border rounded-full px-3 py-2 text-sm font-medium outline-none bg-white">
              <option value="All">All Modes</option>
              <option value="Home Visit">Home Visit</option>
              <option value="Shop Drop-off">Shop Drop-off</option>
            </select>
            <select value={sort} onChange={(e) => updateParams({ sort: e.target.value })} className="border rounded-full px-3 py-2 text-sm font-medium outline-none bg-white">
              <option value="newest">Newest</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-slate-600"><b className="text-slate-900">{services.length}</b> services found {cat !== "All" ? " in " + cat : ""}</p>
          {hasFilter && <button onClick={clearAll} className="text-sm font-bold text-red-600">Clear Filters</button>}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-80 bg-slate-100 rounded-3xl animate-pulse"></div>)}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border">
            <h3 className="font-bold text-xl">No service found</h3>
            <p className="text-slate-500 text-sm mt-2">Try another category or clear filters.</p>
            <button onClick={clearAll} className="mt-5 px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold">Show All Services</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => {
              const price = s.basePrice ?? s.price ?? 1000;
              const tech = s.technicianName || s.technician || "Verified Technician";
              const dur = s.estimatedDuration || s.duration || "2 hours";
              return (
                <div key={s._id} className="bg-white rounded-3xl overflow-hidden border hover:-translate-y-1 hover:shadow-xl transition flex flex-col">
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"; }} />
                    <span className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">{s.category}</span>
                    <span className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">{price} Tk</span>
                    <span className="absolute bottom-3 left-3 bg-white px-2.5 py-1 rounded-full text-xs font-bold">Verified Technician</span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-lg leading-snug">{s.title}</h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2 min-h-10">{s.description}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 flex-wrap">
                      <span className="bg-slate-100 px-2 py-1 rounded-full">{dur}</span>
                      <span className="bg-slate-100 px-2 py-1 rounded-full">{tech}</span>
                      <span className="bg-slate-100 px-2 py-1 rounded-full">{s.serviceMode || "Home Visit"}</span>
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-bold">{s.serviceArea || "Dhaka"}</span>
                    </div>
                    <div className="flex items-center justify-between mt-5 pt-4 border-t mt-auto">
                      <div><p className="text-xs text-slate-400">Price</p><p className="font-extrabold text-xl">{price} Tk</p></div>
                      <div className="flex gap-2">
                        <Link href={"/services/" + s._id} className="px-4 py-2 rounded-full border font-bold text-sm">Details</Link>
                        <Link href={"/services/" + s._id} className="px-4 py-2 rounded-full bg-blue-600 text-white font-bold text-sm">Book Now</Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default function ServicesPage() {
  return <Suspense fallback={<div className="text-center py-20 font-bold">Loading services...</div>}><ServicesContent /></Suspense>;
}
