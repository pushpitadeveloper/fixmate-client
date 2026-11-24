"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Service = {
  _id: string;
  title: string;
  category: string;
  description: string;
  price?: number;
  basePrice?: number;
  duration?: string;
  technician?: string;
};

const cats = ["All", "Laptop", "Mobile", "PC", "Tablet"];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
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
        setServices(list);
      })
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  const getPrice = (s: Service) => s.price ?? s.basePrice ?? 0;

  const filtered = useMemo(() => {
    let list = services.filter((s) => {
      const matchSearch = (s.title + " " + s.category + " " + s.description).toLowerCase().includes(search.toLowerCase());
      const matchCat = cat === "All" || s.category.toLowerCase().includes(cat.toLowerCase()) || s.title.toLowerCase().includes(cat.toLowerCase());
      const p = getPrice(s);
      let matchPrice = true;
      if (price === "low") matchPrice = p < 500;
      if (price === "mid") matchPrice = p >= 500 && p <= 1000;
      if (price === "high") matchPrice = p > 1000;
      return matchSearch && matchCat && matchPrice;
    });
    if (sort === "low") list = [...list].sort((a, b) => getPrice(a) - getPrice(b));
    if (sort === "high") list = [...list].sort((a, b) => getPrice(b) - getPrice(a));
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
              <button key={c} onClick={() => setCat(c)} className={cat === c ? "px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-bold whitespace-nowrap" : "px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-bold whitespace-nowrap hover:bg-slate-200"}>
                {c === "All" ? "All" : c}
              </button>
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
          <p className="text-sm text-slate-600"><b className="text-slate-900">{filtered.length}</b> services found {cat !== "All" ? " - " + cat : ""}</p>
          {(search || cat !== "All" || price !== "all") && <button onClick={clearAll} className="text-sm font-bold text-red-600">Clear Filters</button>}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-80 bg-slate-100 rounded-3xl animate-pulse"></div>)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border">
            <p className="text-5xl">Search</p>
            <h3 className="font-bold text-xl mt-4">No service found</h3>
            <p className="text-slate-500 text-sm mt-1">Try another keyword or clear filters. Or seed services from Admin.</p>
            <Link href="/dashboard/admin" className="inline-block mt-5 px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold">Go to Admin - Seed Services</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((s) => (
              <div key={s._id} className="bg-white rounded-3xl overflow-hidden border hover:-translate-y-1 hover:shadow-xl transition">
                <div className="relative h-48 bg-gradient-to-br from-blue-50 to-violet-50 flex items-center justify-center text-6xl">
                  <span>Tools</span>
                  <span className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">{s.category}</span>
                  <span className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">{getPrice(s) > 0 ? getPrice(s) + " Tk" : "Contact for Price"}</span>
                  <span className="absolute bottom-3 left-3 bg-white px-2.5 py-1 rounded-full text-xs font-bold">4.9 Rating - 120+ reviews</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg leading-snug">{s.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2 min-h-10">{s.description}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 flex-wrap">
                    <span className="bg-slate-100 px-2 py-1 rounded-full">{s.duration || "2 hours"}</span>
                    <span className="bg-slate-100 px-2 py-1 rounded-full">{s.technician || "Verified Tech"}</span>
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-bold">30 Days Warranty</span>
                  </div>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t">
                    <div><p className="text-xs text-slate-400">Price</p><p className="font-extrabold text-xl">{getPrice(s) > 0 ? getPrice(s) + " Tk" : "On Inspection"}</p></div>
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
