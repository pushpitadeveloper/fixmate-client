import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-16 md:py-20 text-center">
      <div className="bg-white border rounded-3xl p-8 md:p-10 shadow-sm">
        <p className="text-7xl md:text-8xl font-extrabold text-blue-100">404</p>
        <h1 className="text-3xl font-extrabold mt-2">Page Not Found</h1>
        <p className="text-slate-500 mt-3 text-sm md:text-base leading-relaxed">
          Sorry, the page you are looking for does not exist or has been moved.
          Please check the link or go back to home.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mt-7">
          <Link href="/" className="px-7 py-3 rounded-full bg-blue-600 text-white text-sm font-bold">
            Back to Home
          </Link>
          <Link href="/services" className="px-7 py-3 rounded-full border text-sm font-bold">
            Browse Services
          </Link>
          <Link href="/dashboard/customer" className="px-7 py-3 rounded-full border text-sm font-bold">
            My Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t text-left">
          <div><p className="text-xs font-bold text-slate-400">NEED HELP?</p><p className="font-bold text-sm mt-1">Book a Repair</p></div>
          <div><p className="text-xs font-bold text-slate-400">EXPLORE</p><p className="font-bold text-sm mt-1">All Services</p></div>
          <div><p className="text-xs font-bold text-slate-400">ACCOUNT</p><p className="font-bold text-sm mt-1">My Profile</p></div>
        </div>
      </div>
    </div>
  );
}
