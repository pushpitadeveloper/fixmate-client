"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Service = {
  _id: string;
  title: string;
  category: string;
  description: string;
  price?: number;
  basePrice?: number;
  image?: string;
  duration?: string;
  estimatedDuration?: string;
  serviceMode?: string;
  technicianName?: string;
};

const categories = [
  { name: "Smartphone", icon: "📱", count: "150+ Services" },
  { name: "Laptop & PC", icon: "💻", count: "120+ Services" },
  { name: "AC", icon: "❄️", count: "90+ Services" },
  { name: "Refrigerator", icon: "🧊", count: "70+ Services" },
  { name: "TV", icon: "📺", count: "80+ Services" },
  { name: "Washing Machine", icon: "🧺", count: "60+ Services" },
  { name: "Electrical", icon: "⚡", count: "100+ Services" },
];

const faqs = [
  { q: "How long does a home repair take?", a: "Our technician reaches you within 30-60 minutes inside Dhaka. Most repairs are completed within 1-2 hours." },
  { q: "How do I pay?", a: "You pay only after the work is completed, by secure card payment. No advance payment is needed." },
  { q: "Is there a warranty?", a: "Yes, every repair comes with a 30-day service warranty and a 90-day parts warranty." },
  { q: "Are technicians verified?", a: "Yes, all technicians are verified with ID and skill tests. You can check ratings before booking." },
];

export default function HomePage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/services")
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d) ? d : d.data || [];
        setServices(list.slice(0, 6));
      })
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  function handleHeroSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) router.push("/services?search=" + encodeURIComponent(search.trim()));
    else router.push("/services");
  }

  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-violet-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 md:pt-16 md:pb-20 grid lg:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex bg-white border shadow-sm px-3 py-1 rounded-full text-xs font-bold text-blue-700">⭐ 4.9/5 - 10,000+ Happy Customers</span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">Device Broken?<br /><span className="text-blue-600">FixMate Is Here.</span></h1>
            <p className="mt-4 text-slate-600 text-base md:text-lg leading-relaxed max-w-lg">A verified technician will visit your home and repair it. Laptop, Mobile, PC, AC and more. Work first, pay after.</p>
            <form onSubmit={handleHeroSearch} className="mt-6 flex bg-white rounded-full p-1.5 shadow-lg border max-w-lg">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="What do you want to repair? Laptop, Mobile..." className="flex-1 px-4 outline-none text-sm bg-transparent" />
              <button type="submit" className="px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold">Search</button>
            </form>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/services" className="px-7 py-3 rounded-full bg-blue-600 text-white font-bold text-sm shadow-lg">View Services</Link>
              <Link href="/signup" className="px-7 py-3 rounded-full border-2 border-slate-200 bg-white font-bold text-sm">Book For Free</Link>
            </div>
            <div className="mt-8 flex gap-8">
              <div><p className="text-2xl font-extrabold">500+</p><p className="text-xs text-slate-500">Technicians</p></div>
              <div><p className="text-2xl font-extrabold">10k+</p><p className="text-xs text-slate-500">Repairs Done</p></div>
              <div><p className="text-2xl font-extrabold">30 min</p><p className="text-xs text-slate-500">Avg Response</p></div>
            </div>
          </div>
          <div className="relative animate-fade-in">
            <img src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1000&q=80" alt="Technician" className="w-full h-72 sm:h-96 object-cover rounded-3xl shadow-2xl" />
            <div className="absolute -bottom-4 left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
              <div className="w-11 h-11 bg-emerald-100 rounded-full flex items-center justify-center text-xl">✓</div>
              <div><p className="font-bold text-sm">Repair Complete!</p><p className="text-xs text-slate-500">Laptop - 45 min - 1000 Tk</p></div>
            </div>
            <div className="absolute top-4 right-4 bg-white rounded-full shadow-lg px-4 py-2 text-sm font-bold">Dhaka - Available Now</div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl md:text-3xl font-extrabold">Browse By Category</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {categories.map((c) => (
            <Link key={c.name} href={"/services?category=" + encodeURIComponent(c.name)} className="bg-white border rounded-2xl p-5 hover:border-blue-300 hover:-translate-y-1 transition shadow-sm">
              <div className="text-3xl">{c.icon}</div>
              <p className="font-bold mt-3">{c.name}</p>
              <p className="text-xs text-slate-500 mt-1">{c.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* POPULAR SERVICES - Assignment Main Part */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-blue-600 font-bold text-sm">POPULAR SERVICES</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-1">What Do You Want To Repair?</h2>
          </div>
          <Link href="/services" className="hidden sm:block text-blue-600 font-bold">View All →</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-72 bg-slate-100 rounded-3xl animate-pulse"></div>)}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border">No service found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => {
              const price = s.basePrice ?? s.price ?? 0;
              return (
                <div key={s._id} className="bg-white rounded-3xl overflow-hidden border hover:-translate-y-1 hover:shadow-xl transition flex flex-col">
                  <div className="relative h-48 bg-slate-100 flex items-center justify-center text-6xl overflow-hidden">
                    {s.image ? <img src={s.image} alt={s.title} className="w-full h-full object-cover" /> : "🔧"}
                    <span className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-xs font-bold">{s.category}</span>
                    <span className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">{price} Tk</span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-lg">{s.title}</h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2 min-h-10">{s.description}</p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t mt-auto">
                      <span className="text-sm text-slate-500">⏱ {s.estimatedDuration || s.duration || "2 hours"} - ⭐ 4.9</span>
                      <Link href={"/services/" + s._id} className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-bold">Details →</Link>
                    </div>
                    {s.technicianName && <p className="text-xs text-slate-400 mt-2">By {s.technicianName} • {s.serviceMode || "Home Visit"}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-slate-900 text-white py-12 md:py-16 mt-8 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center">How FixMate Works</h2>
          <p className="text-center text-slate-400 mt-2">Only 4 steps - no hassle at all</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-9">
            <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-3xl p-6"><div className="text-4xl">🔍</div><h3 className="font-bold text-xl mt-4">1. Find a Service</h3><p className="text-slate-300 text-sm mt-2">Browse verified services and compare price, rating and area.</p></div>
            <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-3xl p-6"><div className="text-4xl">📅</div><h3 className="font-bold text-xl mt-4">2. Send a Request</h3><p className="text-slate-300 text-sm mt-2">Choose date, address and describe the problem. Booking takes 30 seconds.</p></div>
            <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-3xl p-6"><div className="text-4xl">🔧</div><h3 className="font-bold text-xl mt-4">3. Technician Fixes It</h3><p className="text-slate-300 text-sm mt-2">Verified technician visits your home and repairs in front of you with original parts.</p></div>
            <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-3xl p-6"><div className="text-4xl">💳</div><h3 className="font-bold text-xl mt-4">4. Pay After Service</h3><p className="text-slate-300 text-sm mt-2">Check the work first, then pay securely by card. No advance payment.</p></div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US + TESTIMONIALS */}
      <section id="why-us" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid lg:grid-cols-2 gap-10 scroll-mt-24">
        <div>
          <p className="text-blue-600 font-bold text-sm">WHY CHOOSE US</p>
          <h2 className="text-3xl font-extrabold mt-1">Why FixMate?</h2>
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex gap-3 bg-white border rounded-2xl p-4"><span className="text-2xl">✓</span><div><p className="font-bold">Verified Technician</p><p className="text-sm text-slate-500">Verified with ID and skill test. Book after checking ratings.</p></div></div>
            <div className="flex gap-3 bg-white border rounded-2xl p-4"><span className="text-2xl">✓</span><div><p className="font-bold">Original Parts + Warranty</p><p className="text-sm text-slate-500">30-day service warranty, 90-day parts warranty.</p></div></div>
            <div className="flex gap-3 bg-white border rounded-2xl p-4"><span className="text-2xl">✓</span><div><p className="font-bold">Transparent Price</p><p className="text-sm text-slate-500">See the price before booking. No hidden charge.</p></div></div>
            <div className="flex gap-3 bg-white border rounded-2xl p-4"><span className="text-2xl">✓</span><div><p className="font-bold">Pay After Service</p><p className="text-sm text-slate-500">Pay only after the work is done, by secure card payment.</p></div></div>
          </div>
        </div>
        <div>
          <p className="text-blue-600 font-bold text-sm">TESTIMONIALS</p>
          <h2 className="text-3xl font-extrabold mt-1">What Customers Say</h2>
          <div className="mt-6 flex flex-col gap-4">
            <div className="bg-white border rounded-2xl p-5"><p className="text-sm">⭐⭐⭐⭐⭐</p><p className="mt-2 text-slate-700 text-sm leading-relaxed">My laptop screen was broken, they fixed it at my home within 1 hour. Price was known in advance.</p><p className="font-bold text-sm mt-3">- Rahim, Mirpur</p></div>
            <div className="bg-white border rounded-2xl p-5"><p className="text-sm">⭐⭐⭐⭐⭐</p><p className="mt-2 text-slate-700 text-sm leading-relaxed">Changed my mobile battery, they used an original battery. Very good service.</p><p className="font-bold text-sm mt-3">- Nusrat, Uttara</p></div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-3xl font-extrabold text-center">Common Questions</h2>
        <div className="mt-6 flex flex-col gap-3">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white border rounded-2xl overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex justify-between items-center px-5 py-4 text-left font-bold text-sm md:text-base">{f.q}<span>{openFaq === i ? "-" : "+"}</span></button>
              {openFaq === i && <p className="px-5 pb-4 text-sm text-slate-600">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold">Book Today - 20 Percent Off!</h2>
          <p className="text-blue-100 mt-3">Discount on your first booking. A technician will call you within 30 minutes.</p>
          <Link href="/services" className="inline-block mt-6 bg-white text-blue-700 px-8 py-3 rounded-full font-bold">Book Now →</Link>
        </div>
      </section>
    </div>
  );
}
