"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = session?.user as any;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/services", label: "Laptop Repair" },
    { href: "/services", label: "Mobile Repair" },
  ];

  async function handleLogout() {
    await authClient.signOut();
    toast.success("Logout hoye gese");
    setUserMenu(false);
    setOpen(false);
    router.push("/");
  }

  const isActive = (href: string, label: string) => {
    if (label === "Home") return pathname === "/";
    if (label === "Services") return pathname.startsWith("/services");
    return false;
  };

  return (
    <header className="sticky top-0 z-50">
      {/* TOP BAR - Real website er moto */}
      <div className="bg-[#0B1B3A] text-white hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h- flex items-center justify-between text-[12.5px]">
          <p className="flex items-center gap-2">
            <span className="bg-yellow-400 text-black px-2 py- rounded-full font-bold text-">20% OFF</span>
            <span className="text-slate-200">Prothom booking e 20% discount - Code: FIX20</span>
          </p>
          <div className="flex items-center gap-5 text-slate-300">
            <span>📞 +880 1700-000000</span>
            <span className="hidden lg:inline">📍 Dhaka, Bangladesh</span>
            <span className="text-emerald-400 font-semibold">● Open Now</span>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <div className={`bg-white/95 backdrop-blur-md border-b transition-shadow ${scrolled ? "shadow-[0_8px_30px_rgba(0,0,0,0.08)]" : "shadow-sm"}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h- flex items-center justify-between gap-4">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w- h- bg-gradient-to-br from-blue-600 to-violet-600 rounded- flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <span className="text-">🔧</span>
            </div>
            <div className="leading-none">
              <span className="block text- font-extrabold tracking-tight text-slate-900">Fix<span className="text-blue-600">Mate</span></span>
              <span className="block text- tracking-[0.18em] text-slate-400 font-semibold mt-">REPAIR • AT HOME</span>
            </div>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full">
            {links.slice(0, 2).map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={`px-5 py-2 rounded-full text- font-semibold transition ${isActive(l.href, l.label) ? "bg-white shadow text-blue-600" : "text-slate-600 hover:text-slate-900"}`}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/#how-it-works" className="px-5 py-2 rounded-full text- font-semibold text-slate-600 hover:text-slate-900">How it Works</Link>
            <Link href="/#why-us" className="px-5 py-2 rounded-full text- font-semibold text-slate-600 hover:text-slate-900">Why Us</Link>
          </div>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2.5 bg-white border border-slate-200 pl-1.5 pr-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="text-left leading-tight">
                    <p className="text- font-bold text-slate-900 max-w- truncate">{user.name || "My Account"}</p>
                    <p className="text- text-slate-400">View Profile ▾</p>
                  </div>
                </button>

                {userMenu && (
                  <div className="absolute right-0 top- w- bg-white rounded-2xl shadow-2xl border p-2 animate-fade-in">
                    <div className="px-3 py-3 border-b">
                      <p className="font-bold text-sm truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <Link href="/dashboard/customer" onClick={() => setUserMenu(false)} className="block px-3 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-medium">📅 My Bookings</Link>
                    <Link href="/dashboard/customer" onClick={() => setUserMenu(false)} className="block px-3 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-medium">👤 Dashboard</Link>
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-red-50 text-sm font-medium text-red-600">🚪 Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/signin" className="px-4 py-2.5 text- font-semibold text-slate-700 hover:text-blue-600">Sign In</Link>
                <Link href="/signup" className="px-5 py-2.5 rounded-full bg-blue-600 text-white text- font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/25 hover:-translate-y- transition">Book Repair →</Link>
              </>
            )}
          </div>

          {/* MOBILE HAMBURGER */}
          <button onClick={() => setOpen(!open)} className="lg:hidden w-11 h-11 rounded-full bg-slate-100 flex flex-col items-center justify-center gap-">
            <span className={`w- h- bg-slate-900 rounded transition ${open ? "rotate-45 translate-y-" : ""}`}></span>
            <span className={`w- h- bg-slate-900 rounded transition ${open ? "opacity-0" : ""}`}></span>
            <span className={`w- h- bg-slate-900 rounded transition ${open ? "-rotate-45 -translate-y-" : ""}`}></span>
          </button>
        </nav>

        {/* MOBILE MENU */}
        {open && (
          <div className="lg:hidden bg-white border-t px-4 py-4 animate-fade-in">
            <Link href="/" onClick={() => setOpen(false)} className="block px-4 py-3.5 rounded-2xl bg-blue-50 text-blue-700 font-bold">🏠 Home</Link>
            <Link href="/services" onClick={() => setOpen(false)} className="block px-4 py-3.5 rounded-2xl hover:bg-slate-50 font-semibold mt-1">🛠️ All Services</Link>
            <Link href="/services" onClick={() => setOpen(false)} className="block px-4 py-3.5 rounded-2xl hover:bg-slate-50 font-semibold">💻 Laptop Repair</Link>
            <Link href="/services" onClick={() => setOpen(false)} className="block px-4 py-3.5 rounded-2xl hover:bg-slate-50 font-semibold">📱 Mobile Repair</Link>
            <div className="mt-4 pt-4 border-t">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-2 mb-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">{user.name?.[0] || "U"}</div>
                    <div><p className="font-bold text-sm">{user.name}</p><p className="text-xs text-slate-500">{user.email}</p></div>
                  </div>
                  <Link href="/dashboard/customer" onClick={() => setOpen(false)} className="block w-full text-center py-3.5 rounded-xl bg-slate-900 text-white font-bold">My Bookings</Link>
                  <button onClick={handleLogout} className="w-full mt-2 py-3.5 rounded-xl bg-red-50 text-red-600 font-bold">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/signin" onClick={() => setOpen(false)} className="block w-full text-center py-3.5 rounded-xl border-2 font-bold">Sign In</Link>
                  <Link href="/signup" onClick={() => setOpen(false)} className="block w-full text-center py-3.5 rounded-xl bg-blue-600 text-white font-bold mt-2">Book Repair →</Link>
                </>
              )}
            </div>
            <p className="text-center text-xs text-slate-400 mt-4">📞 +880 1700-000000 • Dhaka</p>
          </div>
        )}
      </div>
    </header>
  );
}
