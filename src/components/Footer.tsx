import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">F</div>
            <span className="text-white text- font-extrabold">Fix<span className="text-blue-500">Mate</span></span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">Verified Technician diye device repair. Basay ese repair, Pay After Service. Dhaka soho sara Bangladesh e.</p>
          <div className="flex gap-2 mt-5">
            <span className="px-3 py-1.5 bg-white/10 rounded-full text-xs">⭐ 4.9 Rating</span>
            <span className="px-3 py-1.5 bg-white/10 rounded-full text-xs">✅ Verified</span>
          </div>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4">Quick Links</h3>
          <div className="flex flex-col gap-2.5 text-sm">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/services" className="hover:text-white">Services</Link>
            <Link href="/signin" className="hover:text-white">Sign In</Link>
            <Link href="/signup" className="hover:text-white">Sign Up</Link>
          </div>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4">Services</h3>
          <div className="flex flex-col gap-2.5 text-sm">
            <Link href="/services" className="hover:text-white">Laptop Repair</Link>
            <Link href="/services" className="hover:text-white">Mobile Repair</Link>
            <Link href="/services" className="hover:text-white">PC Repair</Link>
            <Link href="/services" className="hover:text-white">Tablet Repair</Link>
          </div>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4">Contact</h3>
          <div className="flex flex-col gap-2.5 text-sm">
            <span>Dhaka, Bangladesh</span>
            <span>support@fixmate.com</span>
            <span>+880 1700-000000</span>
            <span className="text-emerald-400">● Open: 9 AM - 9 PM</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">© 2026 FixMate - Device Repair Service | Pay After Service</div>
    </footer>
  );
}
