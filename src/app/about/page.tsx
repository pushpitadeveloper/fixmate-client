import Link from "next/link";

const CATEGORIES = [
  { title: "Smartphone", desc: "Screen, battery, charging port, software and water damage repair." },
  { title: "Laptop & PC", desc: "Screen, keyboard, battery, overheating, software and upgrade service." },
  { title: "AC", desc: "AC installation, gas refill, cooling problem and full servicing." },
  { title: "Refrigerator", desc: "Cooling problem, compressor, gas and door gasket repair." },
  { title: "TV", desc: "Display, sound, backlight and board level TV repair." },
  { title: "Washing Machine", desc: "Drum, motor, drainage, vibration and control panel repair." },
  { title: "Electrical", desc: "Wiring, switch, fan, light and home electrical work." },
];

const WHY_US = [
  { title: "Verified Technicians", desc: "Every technician is reviewed and approved before they can accept bookings." },
  { title: "Transparent Pricing", desc: "You see the estimated price before you book. Final amount is confirmed before payment." },
  { title: "Doorstep Service", desc: "Book from home. Technician visits your address at your selected date and time." },
  { title: "Secure Card Payment", desc: "Pay safely by card only. No cash handling, no hidden charges." },
  { title: "Booking Tracking", desc: "Track every booking from Requested to Completed in your dashboard." },
  { title: "Service Quality", desc: "Technician services are approved by admin, so quality stays consistent." },
];

const STEPS = [
  { no: "01", title: "Book a Service", desc: "Choose a service, pick your date and time, and describe the problem." },
  { no: "02", title: "Technician Accepts", desc: "A verified technician accepts your booking and starts the work." },
  { no: "03", title: "Repair & Pay by Card", desc: "After the work is done, the technician marks it completed and you pay securely by card." },
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-blue-600 text-xs font-bold tracking-widest">ABOUT FIXMATE</p>
        <h1 className="text-4xl md:text-5xl font-extrabold mt-3 leading-tight">
          Repair Made Simple, Safe & Transparent
        </h1>
        <p className="text-slate-500 mt-4 text-base md:text-lg leading-relaxed">
          FixMate connects you with verified technicians for smartphone, laptop, AC, refrigerator, TV,
          washing machine and electrical repair - at your home, on your schedule, with secure card payment.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-7">
          <Link href="/services" className="px-7 py-3 rounded-full bg-blue-600 text-white text-sm font-bold">Browse Services</Link>
          <Link href="/services" className="px-7 py-3 rounded-full border text-sm font-bold">Book a Repair</Link>
        </div>
      </div>

      {/* Stats - No fake numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
        <div className="bg-white border rounded-3xl p-5 text-center"><p className="text-3xl font-extrabold">7</p><p className="text-sm text-slate-500 mt-1">Service Categories</p></div>
        <div className="bg-white border rounded-3xl p-5 text-center"><p className="text-3xl font-extrabold">100%</p><p className="text-sm text-slate-500 mt-1">Verified Technicians</p></div>
        <div className="bg-white border rounded-3xl p-5 text-center"><p className="text-3xl font-extrabold">Card Only</p><p className="text-sm text-slate-500 mt-1">Secure Payment</p></div>
        <div className="bg-white border rounded-3xl p-5 text-center"><p className="text-3xl font-extrabold">Dhaka</p><p className="text-sm text-slate-500 mt-1">Service Coverage</p></div>
      </div>

      {/* Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-10">
          <p className="text-blue-300 text-xs font-bold tracking-widest">OUR MISSION</p>
          <h2 className="text-3xl font-extrabold mt-3 leading-snug">No More Random Repair Shops. No More Guesswork.</h2>
          <p className="text-slate-300 mt-4 leading-relaxed text-sm md:text-base">
            Finding a trusted technician should not be hard. FixMate gives you verified technicians,
            clear pricing, booking tracking and secure card payment - all in one place.
          </p>
          <p className="text-slate-300 mt-3 leading-relaxed text-sm md:text-base">
            Customers book in minutes. Technicians manage their services and bookings. Admins approve
            services and keep quality under control.
          </p>
        </div>
        <div className="bg-white border rounded-3xl p-8 md:p-10">
          <p className="text-blue-600 text-xs font-bold tracking-widest">WHAT WE DO</p>
          <h2 className="text-3xl font-extrabold mt-3">One Platform for Every Repair</h2>
          <ul className="mt-5 space-y-3 text-sm md:text-base text-slate-600">
            <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span> Book a verified technician for home visit or shop drop-off</li>
            <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span> Track booking status - Requested, Accepted, In Progress, Completed</li>
            <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span> Pay only after work is completed, securely by card</li>
            <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span> Manage everything from your dashboard - Customer, Technician or Admin</li>
          </ul>
        </div>
      </div>

      {/* How It Works */}
      <div className="mt-14">
        <p className="text-blue-600 text-xs font-bold tracking-widest text-center">HOW IT WORKS</p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mt-2">Three Simple Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {STEPS.map((s) => (
            <div key={s.no} className="bg-white border rounded-3xl p-6">
              <p className="text-4xl font-extrabold text-blue-100">{s.no}</p>
              <h3 className="font-bold text-lg mt-3">{s.title}</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Us */}
      <div className="mt-14">
        <p className="text-blue-600 text-xs font-bold tracking-widest text-center">WHY FIXMATE</p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mt-2">Why People Choose FixMate</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {WHY_US.map((w) => (
            <div key={w.title} className="bg-white border rounded-3xl p-6">
              <h3 className="font-bold">{w.title}</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mt-14">
        <p className="text-blue-600 text-xs font-bold tracking-widest text-center">WHAT WE REPAIR</p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mt-2">Services We Cover</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {CATEGORIES.map((c) => (
            <Link key={c.title} href="/services" className="bg-white border rounded-3xl p-6 hover:shadow-md transition">
              <h3 className="font-bold">{c.title}</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{c.desc}</p>
              <p className="text-sm font-bold text-blue-600 mt-3">View Services →</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Roles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-14">
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6"><h3 className="font-bold text-lg">For Customers</h3><p className="text-sm text-slate-600 mt-2 leading-relaxed">Book, track and pay for repairs. Manage all bookings from one dashboard.</p><Link href="/sign-up" className="inline-block mt-4 px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold">Sign Up as Customer</Link></div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6"><h3 className="font-bold text-lg">For Technicians</h3><p className="text-sm text-slate-600 mt-2 leading-relaxed">Add your services, accept bookings, complete work and get paid by card.</p><Link href="/sign-up" className="inline-block mt-4 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-bold">Join as Technician</Link></div>
        <div className="bg-slate-900 text-white rounded-3xl p-6"><h3 className="font-bold text-lg">For Admins</h3><p className="text-sm text-slate-300 mt-2 leading-relaxed">Approve services, manage users, view bookings and track revenue.</p><Link href="/sign-in" className="inline-block mt-4 px-5 py-2.5 rounded-full bg-white text-slate-900 text-sm font-bold">Sign In as Admin</Link></div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-center text-white mt-14">
        <h2 className="text-3xl md:text-4xl font-extrabold">Need a Repair Today?</h2>
        <p className="text-blue-100 mt-3">Browse verified services and book in minutes.</p>
        <Link href="/services" className="inline-block mt-6 px-8 py-3.5 rounded-full bg-white text-blue-600 text-sm font-bold">Browse Services</Link>
      </div>
    </div>
  );
}
