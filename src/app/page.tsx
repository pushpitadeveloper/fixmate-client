"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Service = {
  _id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  duration?: string;
};

const categories = [
  { name: "Laptop Repair", icon: "💻", count: "120+ Services" },
  { name: "Mobile Repair", icon: "📱", count: "150+ Services" },
  { name: "PC Repair", icon: "🖥️", count: "80+ Services" },
  { name: "Tablet Repair", icon: "📲", count: "60+ Services" },
];

const faqs = [
  { q: "Basay ese repair korate koto somoy lage?", a: "Dhakar moddhe 30-60 min er moddhe technician pouche jay. Repair 1-2 ghontar moddhe sesh hoy." },
  { q: "Payment kivabe korbo?", a: "Kaj dekhe tarpor payment - Cash, bKash, Nagad, Card sob cholbe. Age taka dite hoy na." },
  { q: "Warranty ache?", a: "Ha, prottek repair e 30 din er service warranty paba. Parts e 90 din warranty." },
  { q: "Technician ki verified?", a: "Ha, sob technician NID + skill test diye verified. Rating dekhe booking korte parba." },
];

export default function HomePage() {
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

  const filtered = services.filter((s) =>
    (s.title + s.category).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-violet-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 md:pt-16 md:pb-20 grid lg:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex bg-white border shadow-sm px-3 py-1 rounded-full text-xs font-bold text-blue-700">⭐ 4.9/5 - 10,000+ Happy Customers</span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">Device Nosto?<br /><span className="text-blue-600">FixMate Ache.</span></h1>
            <p className="mt-4 text-slate-600 text-base md:text-lg leading-relaxed max-w-lg">Verified Technician basay ese repair korbe. Laptop, Mobile, PC - sob kichu. Age kaj, pore payment.</p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex bg-white rounded-full p-1.5 shadow-lg border max-w-lg">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ki repair korate chao? Laptop, Mobile..." className="flex-1 px-4 outline-none text-sm bg-transparent" />
              <Link href="/services" className="px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold">Search</Link>
            </form>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/services" className="px-7 py-3 rounded-full bg-blue-600 text-white font-bold text-sm shadow-lg">Services Dekho</Link>
              <Link href="/signup" className="px-7 py-3 rounded-full border-2 border-slate-200 bg-white font-bold text-sm">Free Booking Koro</Link>
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
        <h2 className="text-2xl md:text-3xl font-extrabold">Category Diye Khujo</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {categories.map((c) => (
            <Link key={c.name} href="/services" className="bg-white border rounded-2xl p-5 hover:border-blue-300 hover:-translate-y-1 transition shadow-sm">
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
            <h2 className="text-3xl md:text-4xl font-extrabold mt-1">Ki Repair Korate Chao?</h2>
          </div>
          <Link href="/services" className="hidden sm:block text-blue-600 font-bold">Sob Dekho →</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-72 bg-slate-100 rounded-3xl animate-pulse"></div>)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border">Service pawa jay nai.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((s) => (
              <div key={s._id} className="bg-white rounded-3xl overflow-hidden border hover:-translate-y-1 hover:shadow-xl transition">
                <div className="relative h-48 bg-slate-100 flex items-center justify-center text-6xl">🔧<span className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-xs font-bold">{s.category}</span><span className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">{s.price} Tk</span></div>
                <div className="p-5">
                  <h3 className="font-bold text-lg">{s.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2 min-h-10">{s.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-slate-500">⏱ {s.duration || "2 hours"} - ⭐ 4.9</span>
                    <Link href={"/services/" + s._id} className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-bold">Details →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-slate-900 text-white py-12 md:py-16 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center">Kivabe Kaj Kore?</h2>
          <p className="text-center text-slate-400 mt-2">Sudhu 3 ta step - kono jhamela nai</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-9">
            <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-3xl p-6"><div className="text-4xl">📅</div><h3 className="font-bold text-xl mt-4">1. Booking Koro</h3><p className="text-slate-300 text-sm mt-2">Service choose kore date, address dao. 30 sec e booking sesh.</p></div>
            <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-3xl p-6"><div className="text-4xl">🔧</div><h3 className="font-bold text-xl mt-4">2. Technician Asbe</h3><p className="text-slate-300 text-sm mt-2">Verified technician basay ese samne repair korbe. Parts original.</p></div>
            <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-3xl p-6"><div className="text-4xl">💳</div><h3 className="font-bold text-xl mt-4">3. Pay After Service</h3><p className="text-slate-300 text-sm mt-2">Kaj dekhe tarpor payment koro. Cash / bKash / Card sob cholbe.</p></div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US + TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid lg:grid-cols-2 gap-10">
        <div>
          <h2 className="text-3xl font-extrabold">Keno FixMate?</h2>
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex gap-3 bg-white border rounded-2xl p-4"><span className="text-2xl">✓</span><div><p className="font-bold">Verified Technician</p><p className="text-sm text-slate-500">NID + Skill Test diye verified, rating dekhe booking.</p></div></div>
            <div className="flex gap-3 bg-white border rounded-2xl p-4"><span className="text-2xl">✓</span><div><p className="font-bold">Original Parts + Warranty</p><p className="text-sm text-slate-500">30 din service warranty, 90 din parts warranty.</p></div></div>
            <div className="flex gap-3 bg-white border rounded-2xl p-4"><span className="text-2xl">✓</span><div><p className="font-bold">Transparent Price</p><p className="text-sm text-slate-500">Age price dekhe tarpor booking. Hidden charge nai.</p></div></div>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold">Customer Ra Ki Bole?</h2>
          <div className="mt-6 flex flex-col gap-4">
            <div className="bg-white border rounded-2xl p-5"><p className="text-sm">⭐⭐⭐⭐⭐</p><p className="mt-2 text-slate-700 text-sm leading-relaxed">Laptop er screen venge gesilo, 1 ghontay basay ese thik kore dise. Price o age theke jana chilo.</p><p className="font-bold text-sm mt-3">- Rahim, Mirpur</p></div>
            <div className="bg-white border rounded-2xl p-5"><p className="text-sm">⭐⭐⭐⭐⭐</p><p className="mt-2 text-slate-700 text-sm leading-relaxed">Mobile er battery change korlam, original battery dise. Onk valo service.</p><p className="font-bold text-sm mt-3">- Nusrat, Uttara</p></div>
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
          <h2 className="text-3xl md:text-4xl font-extrabold">Ajkei Booking Koro - 20 Percent Off!</h2>
          <p className="text-blue-100 mt-3">Prothom booking e discount. Technician 30 min er moddhe call dibe.</p>
          <Link href="/services" className="inline-block mt-6 bg-white text-blue-700 px-8 py-3 rounded-full font-bold">Ekhoni Booking Koro →</Link>
        </div>
      </section>
    </div>
  );
}
