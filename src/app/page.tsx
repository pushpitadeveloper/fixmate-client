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
  technician?: string;
};

function getImage(title: string, category: string) {
  const t = (title + category).toLowerCase();
  if (t.includes("laptop") || t.includes("pc")) return "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80";
  if (t.includes("mobile") || t.includes("phone")) return "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80";
  if (t.includes("tablet")) return "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80";
  return "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80";
}

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`)
      .then((r) => r.json())
      .then((d) => setServices(Array.isArray(d) ? d.slice(0, 6) : d.data?.slice(0, 6) || []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-violet-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 md:pt-16 md:pb-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-white border shadow-sm px-3 py-1.5 rounded-full text-xs font-semibold text-blue-700 animate-fade-up">⭐ 4.9/5 • 10,000+ Happy Customers</span>
            <h1 className="mt-5 text- leading-[1.05] sm:text-5xl lg:text- font-extrabold tracking-tight animate-fade-up delay-100">
              Device Nosto?<br /><span className="text-gradient">FixMate Ache.</span>
            </h1>
            <p className="mt-4 text-slate-600 text- md:text-lg leading-relaxed max-w- animate-fade-up delay-200">Verified Technician basay ese repair korbe. Laptop, Mobile, PC - sob kichu. Age kaj, pore payment.</p>
            <div className="mt-7 flex flex-wrap gap-3 animate-fade-up delay-300">
              <Link href="/services" className="btn-primary px-7 py-3.5 text-">Services Dekho →</Link>
              <Link href="/signup" className="px-7 py-3.5 rounded-full border-2 border-slate-200 bg-white font-semibold text- hover:border-blue-200">Free Booking Koro</Link>
            </div>
            <div className="mt-8 flex gap-6 md:gap-10 animate-fade-up delay-400">
              <div><p className="text-2xl font-extrabold">500+</p><p className="text-xs text-slate-500">Technicians</p></div>
              <div><p className="text-2xl font-extrabold">10k+</p><p className="text-xs text-slate-500">Repairs Done</p></div>
              <div><p className="text-2xl font-extrabold">30 min</p><p className="text-xs text-slate-500">Avg. Response</p></div>
            </div>
          </div>
          <div className="relative animate-fade-in">
            <img src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1000&q=80" alt="Technician repairing" className="w-full h- sm:h- lg:h- object-cover rounded- shadow-2xl" />
            <div className="absolute -bottom-4 left-4 md:left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 animate-float">
              <div className="w-11 h-11 bg-emerald-100 rounded-full flex items-center justify-center text-xl">✅</div>
              <div><p className="font-bold text-sm">Repair Complete!</p><p className="text-xs text-slate-500">Laptop • 45 min • ৳1000</p></div>
            </div>
            <div className="absolute top-4 right-4 bg-white rounded-full shadow-lg px-4 py-2 text-sm font-bold">📍 Dhaka • Available Now</div>
          </div>
        </div>
      </section>

      {/* POPULAR SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex items-end justify-between mb-7">
          <div>
            <p className="text-blue-600 font-bold text-sm tracking-wider">POPULAR SERVICES</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-1">Ki Repair Korate Chao?</h2>
          </div>
          <Link href="/services" className="hidden sm:block text-blue-600 font-semibold hover:underline">Sob Dekho →</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (<div key={i} className="h- bg-slate-100 rounded- animate-pulse"></div>))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 bg-white rounded- border">Service pawa jay nai. Pore abar try koro.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <div key={s._id} className="bg-white rounded- overflow-hidden border card-hover animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="relative h- overflow-hidden">
                  <img src={getImage(s.title, s.category)} alt={s.title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                  <span className="absolute top-3 left-3 bg-white/95 px-3 py-1 rounded-full text-xs font-bold">{s.category}</span>
                  <span className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">৳{s.price}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg">{s.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mt-1 min-h-">{s.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-slate-500">⏱ {s.duration || "2 hours"}</span>
                    <Link href={`/services/${s._id}`} className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">Details →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-slate-950 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center">Kivabe Kaj Kore?</h2>
          <p className="text-center text-slate-400 mt-2">Sudhu 3 ta step - ar kono jhamela nai</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-9">
            {[
              { n: "1", t: "Booking Koro", d: "Service choose kore date, address dao. 30 sec e booking sesh.", e: "📅" },
              { n: "2", t: "Technician Asbe", d: "Verified technician basay ese samne repair korbe. Parts original.", e: "🔧" },
              { n: "3", t: "Pay After Service", d: "Kaj dekhe tarpor payment koro. Cash / Card / bKash sob cholbe.", e: "💳" },
            ].map((x) => (
              <div key={x.n} className="bg-white/10 border border-white/10 rounded- p-6 hover:bg-white/15 transition">
                <div className="text-4xl">{x.e}</div>
                <h3 className="font-bold text-xl mt-4">{x.n}. {x.t}</h3>
                <p className="text-slate-300 text-sm mt-2 leading-relaxed">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded- p-8 md:p-12 text-center text-white relative overflow-hidden">
          <h2 className="text-3xl md:text-4xl font-extrabold">Ajkei Booking Koro - 20% Off!</h2>
          <p className="text-blue-100 mt-3">Prothom booking e discount. Technician 30 min er moddhe call dibe.</p>
          <Link href="/services" className="inline-block mt-6 bg-white text-blue-700 px-8 py-3.5 rounded-full font-bold hover:scale-105 transition">Ekhoni Booking Koro →</Link>
        </div>
      </section>
    </div>
  );
}
