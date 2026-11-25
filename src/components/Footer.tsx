"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";

const socials = [
  { name: "Facebook", short: "f" },
  { name: "Instagram", short: "IG" },
  { name: "YouTube", short: "YT" },
  { name: "LinkedIn", short: "IN" },
];

const services = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  // FIX - Login thakle Sign In dekhabe na, My Dashboard dekhabe
  const { data: session } = authClient.useSession();
  const user: any = (session as any)?.user;

  const dashboardHref =
    user?.role === "admin"
      ? "/dashboard/admin"
      : user?.role === "technician"
        ? "/dashboard/technician"
        : "/dashboard/customer";

  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-10 md:p-12 md:flex items-center justify-between gap-8">
          <div className="relative">
            <p className="text-blue-300 text-xs font-bold tracking-widest">LIMITED OFFER - ENDS SOON</p>
            <h3 className="text-white text-3xl md:text-4xl font-extrabold leading-tight mt-2">Device Broken? Fix It Today.<br className="hidden md:block" /> Get 20 Percent Discount.</h3>
            <p className="text-slate-300 text-sm md:text-base mt-2 max-w-lg">A verified technician will call you within 30 minutes. Home repair, pay only after you see the work.</p>
          </div>
          <div className="relative mt-6 md:mt-0 flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <Link href="/services" className="px-7 py-3 rounded-full bg-white text-slate-900 font-bold text-sm text-center hover:scale-105 transition">Book Repair Now</Link>
            {user ? (
              <Link href={dashboardHref} className="px-7 py-3 rounded-full border border-white border-opacity-30 text-white font-bold text-sm text-center hover:bg-white hover:bg-opacity-10 transition">My Dashboard</Link>
            ) : (
              <Link href="/sign-in" className="px-7 py-3 rounded-full border border-white border-opacity-30 text-white font-bold text-sm text-center hover:bg-white hover:bg-opacity-10 transition">Sign In</Link>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-10 border-b border-slate-200">
            <div>
              <h4 className="text-xl font-extrabold text-slate-900">Get Offers And Tips By Email</h4>
              <p className="text-slate-500 text-sm mt-1">Once a month, no spam. Unsubscribe anytime.</p>
            </div>
            {done ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 rounded-full text-sm font-bold">Subscribed! Check your email.</div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="flex w-full md:w-96 bg-white border border-slate-200 rounded-full p-1 shadow-sm">
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@email.com" className="flex-1 px-4 bg-transparent outline-none text-sm" />
                <button className="px-5 py-2 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-blue-600 transition">Subscribe</button>
              </form>
            )}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 pt-10">
            <div className="col-span-2 lg:col-span-2 pr-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white text-xl font-extrabold">F</div>
                <span className="text-2xl font-extrabold tracking-tight text-slate-900">Fix<span className="text-blue-600">Mate</span></span>
              </Link>
              <p className="text-slate-500 text-sm leading-relaxed mt-4 max-w-xs">The most trusted device repair service in Bangladesh. Verified technicians, original parts, 30 days service warranty.</p>
              <div className="flex gap-2 mt-5">
                {socials.map((s) => (
                  <a key={s.name} href="#" aria-label={s.name} className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition text-xs font-bold">
                    {s.short}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-bold text-slate-900 text-sm tracking-wide">SERVICES</h5>
              <div className="flex flex-col gap-2 mt-4 text-sm text-slate-500">
                {services.map((s) => (
                  <Link key={s} href={"/services?category=" + encodeURIComponent(s)} className="hover:text-blue-600">{s}</Link>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-bold text-slate-900 text-sm tracking-wide">COMPANY</h5>
              <div className="flex flex-col gap-2 mt-4 text-sm text-slate-500">
                <Link href="/about" className="hover:text-blue-600">About Us</Link>
                <Link href="/services" className="hover:text-blue-600">All Services</Link>
                <Link href="/dashboard/customer" className="hover:text-blue-600">My Bookings</Link>
                <Link href="/sign-up" className="hover:text-blue-600">Join as Technician</Link>
                <Link href="/about" className="hover:text-blue-600">Careers</Link>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-slate-900 text-sm tracking-wide">CONTACT</h5>
              <div className="flex flex-col gap-3 mt-4 text-sm text-slate-500">
                <p>Dhaka, Bangladesh<br /><span className="text-xs">Mirpur - Uttara - Banani</span></p>
                <p className="font-semibold text-slate-900">+880 1326-548954</p>
                <p>support@fixmate.com</p>
                <p className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold w-fit"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Open Now - 9 AM to 9 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">© 2026 FixMate. Made in Dhaka, Bangladesh.</p>
            <div className="flex items-center gap-2">
              <span className="h-7 px-2 bg-slate-900 text-white rounded-md text-xs font-bold flex items-center">CARD</span>
              <span className="h-7 px-2 bg-slate-100 rounded-md text-xs font-bold flex items-center">SECURE</span>
              <span className="h-7 px-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-bold flex items-center">SSL SECURED</span>
            </div>
            <div className="flex gap-5 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-900">Privacy</a>
              <a href="#" className="hover:text-slate-900">Terms</a>
              <a href="#" className="hover:text-slate-900">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
