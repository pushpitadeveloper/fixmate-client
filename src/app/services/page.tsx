"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
  { _id: "demo1", title: "Laptop Screen Replacement", category: "Laptop", description: "Cracked or flickering laptop screen replaced with original display.", price: 2500, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80" },
  { _id: "demo2", title: "Laptop Battery Replacement", category: "Laptop", description: "Battery drains fast. Replaced with original battery. 90 days warranty.", price: 1800, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=800&q=80" },
  { _id: "demo3", title: "Laptop Keyboard Repair", category: "Laptop", description: "Keys not working. Keyboard cleaned or replaced.", price: 1200, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80" },
  { _id: "demo4", title: "Laptop Motherboard Repair", category: "Laptop", description: "Laptop not turning on. Chip-level motherboard repair.", price: 3500, duration: "3 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" },
  { _id: "demo5", title: "Laptop Charging Port Repair", category: "Laptop", description: "Not charging. Charging port fixed.", price: 900, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80" },
  { _id: "demo6", title: "Laptop Software Setup", category: "Laptop", description: "Windows setup, virus removal, speed optimization.", price: 800, duration: "2 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80" },
  { _id: "demo7", title: "Mobile Screen Replacement", category: "Mobile", description: "Broken mobile display replaced with original display.", price: 1800, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80" },
  { _id: "demo8", title: "Mobile Battery Replacement", category: "Mobile", description: "Battery drains fast. Original battery replacement.", price: 1200, duration: "45 min", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80" },
  { _id: "demo9", title: "Mobile Charging Port Repair", category: "Mobile", description: "Not charging. Port cleaned or replaced.", price: 700, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1601524909162-ae8725290836?auto=format&fit=crop&w=800&q=80" },
  { _id: "demo10", title: "Mobile Camera Repair", category: "Mobile", description: "Blurry camera. Camera module replaced.", price: 1500, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80" },
  { _id: "demo11", title: "Mobile Software Unlock", category: "Mobile", description: "Forgot password, hanging. Flash and unlock done.", price: 600, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80" },
  { _id: "demo12", title: "Mobile Water Damage Repair", category: "Mobile", description: "Water damaged phone. Cleaning and full checkup.", price: 2000, duration: "3 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80" },
  { _id: "demo13", title: "PC Motherboard Repair", category: "PC", description: "Desktop not turning on. Chip-level repair.", price: 3000, duration: "3 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80" },
  { _id: "demo14", title: "PC Power Supply Repair", category: "PC", description: "PC shuts down suddenly. PSU repaired.", price: 1500, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80" },
  { _id: "demo15", title: "PC RAM Upgrade", category: "PC", description: "Slow PC. RAM upgrade plus SSD setup.", price: 1000, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1541029071515-84cc9ea1b4c5?auto=format&fit=crop&w=800&q=80" },
  { _id: "demo16", title: "PC Data Recovery", category: "PC", description: "Deleted files, photos recovered.", price: 2500, duration: "4 hours", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80" },
  { _id: "demo17", title: "Tablet Screen Replacement", category: "Tablet", description: "Broken tablet screen replaced.", price: 2200, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80" },
  { _id: "demo18", title: "Tablet Battery Replacement", category: "Tablet", description: "Tablet battery replaced with original.", price: 1600, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80" },
  { _id: "demo19", title: "Printer Repair", category: "PC", description: "Paper jam, blurry print. Full service.", price: 900, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80" },
  { _id: "demo20", title: "WiFi Router Setup", category: "PC", description: "Router setup, slow WiFi fix.", price: 1200, duration: "1 hour", technician: "Verified Technician", image: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=800&q=80" },
];

const cats = ["All", "Laptop", "Mobile", "PC", "Tablet"];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(demoServices);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("popular");
  const [price, setPrice] = useState("all");

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/services")
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d) ? d : d.data || [];
        if (list.length >= 5) {
          const fixed = list.map((s: any, i: number) => {
            const found = demoServices.find((x) => x.title.toLowerCase() === (s.title || "").toLowerCase());
            return {
              _id: s._id || "api" + i,
              title: s.title || s.name || "Repair Service",
              category: s.category || "Laptop",
              description: s.description || "Professional repair service.",
              price: s.price ?? s.basePrice ?? 1000,
              duration: s.duration || "2 hours",
              technician: s.technician || "Verified Technician",
              image: s.image || s.imageUrl || found?.image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
            };
          });
          setServices(fixed);
        } else {
          setServices(demoServices);
        }
      })
      .catch(() => setServices(demoServices))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = services.filter((s) => {
      const matchSearch = (s.title + " " + s.category).toLowerCase().includes(search.toLowerCase());
      const matchCat = cat === "All" || s.category.toLowerCase().includes(cat.toLowerCase()) || s.title.toLowerCase().includes(cat.toLowerCase());
      let matchPrice = true;
      if (price === "low") matchPrice = s.price < 500;
      if (price === "mid") matchPrice = s.price >= 500 && s.price <= 1000;
      if (price === "high") matchPrice = s.price > 1000;
      return matchSearch && matchCat && matchPrice;
    });
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [services, search, cat, sort, price]);

  function clearAll() {
    setSearch("");
    setCat("All");
    setSort("popular");
    setPrice("all");
  }

  return (
    <div>
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <p className="text-blue-300 text-xs font-bold tracking-widest">ALL SERVICES</p>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-2">What Needs Repair?</h1>
          <p className="text-slate-300 mt-2 max-w-xl text-sm md:text-base">Verified technicians will come to your home. Choose a service, see the price, book in 30 seconds.</p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex bg-white rounded-full p-1.5 max-w-xl shadow-xl">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search - Laptop, Mobile, Screen..." className="flex-1 px-4 outline-none text-sm text-slate-900 bg-transparent" />
            <button className="px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold">Search</button>
          </form>
          <div className="flex gap-6 mt-6 text-sm">
            <span><b>{services.length}</b> <span className="text-slate-400">Services</span></span>
            <span><b>500+</b> <span className="text-slate-400">Technicians</span></span>
            <span><b>4.9</b> <span className="text-slate-400">Rating</span></span>
          </div>
        </div>
      </section>

      <section className="sticky top-16 md:top-24 z-30 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={cat === c ? "px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-bold whitespace-nowrap" : "px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-bold whitespace-nowrap hover:bg-slate-200"}>{c}</button>
            ))}
          </div>
          <div className="flex gap-2 ml-auto">
            <select value={price} onChange={(e) => setPrice(e.target.value)} className="border rounded-full px-3 py-2 text-sm font-medium outline-none bg-white">
              <option value="all">All Prices</option>
              <option value="low">Under 500 Tk</option>
              <option value="mid">500 - 1000 Tk</option>
              <option value="high">Above 1000 Tk</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="border rounded-full px-3 py-2 text-sm font-medium outline-none bg-white">
              <option value="popular">Most Popular</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-slate-600"><b className="text-slate-900">{filtered.length}</b> services found</p>
          {(search || cat !== "All" || price !== "all") && <button onClick={clearAll} className="text-sm font-bold text-red-600">Clear Filters</button>}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-80 bg-slate-100 rounded-3xl animate-pulse"></div>)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border">
            <h3 className="font-bold text-xl">No service found</h3>
            <button onClick={clearAll} className="mt-5 px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold">Show All Services</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((s) => (
              <div key={s._id} className="bg-white rounded-3xl overflow-hidden border hover:-translate-y-1 hover:shadow-xl transition">
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"; }} />
                  <span className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">{s.category}</span>
                  <span className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">{s.price} Tk</span>
                  <span className="absolute bottom-3 left-3 bg-white px-2.5 py-1 rounded-full text-xs font-bold">4.9 Rating - 120+ reviews</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg leading-snug">{s.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2 min-h-10">{s.description}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 flex-wrap">
                    <span className="bg-slate-100 px-2 py-1 rounded-full">{s.duration}</span>
                    <span className="bg-slate-100 px-2 py-1 rounded-full">{s.technician}</span>
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-bold">30 Days Warranty</span>
                  </div>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t">
                    <div><p className="text-xs text-slate-400">Price</p><p className="font-extrabold text-xl">{s.price} Tk</p></div>
                    <div className="flex gap-2">
                      <Link href={"/services/" + s._id} className="px-4 py-2 rounded-full border font-bold text-sm">Details</Link>
                      <Link href={"/services/" + s._id} className="px-4 py-2 rounded-full bg-blue-600 text-white font-bold text-sm">Book Now</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
