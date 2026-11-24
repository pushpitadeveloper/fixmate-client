"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Why FixMate", href: "/#why-us" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = authClient.useSession();
  const user: any = (session as any)?.user;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleLogout() {
    await authClient.signOut();
    setUserMenu(false);
    setOpen(false);
    router.push("/signin");
    router.refresh();
  }

  function dashboardLink() {
    if (!user) return "/signin";
    if (user.role === "admin") return "/dashboard/admin";
    if (user.role === "technician") return "/dashboard/technician";
    return "/dashboard/customer";
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between text-xs">
          <p className="font-medium tracking-wide hidden sm:block">Free Home Pickup in Dhaka | 30 Days Service Warranty</p>
          <p className="font-medium tracking-wide sm:hidden">Free Pickup in Dhaka</p>
          <div className="flex items-center gap-4">
            <a href="tel:01326548954" className="font-bold hover:text-blue-300">Hotline: 01326-548954</a>
            <span className="hidden md:inline text-slate-400">Mon - Sun: 9 AM - 9 PM</span>
          </div>
        </div>
      </div>

      <div className={scrolled ? "bg-white shadow-md border-b" : "bg-white border-b"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setOpen(false)}>
              <span className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md">F</span>
              <span className="leading-none">
                <span className="block text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">Fix<span className="text-blue-600">Mate</span></span>
                <span className="block text-xs font-bold tracking-widest text-slate-500 mt-0.5">REPAIR EXPERTS</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {links.map((l) => {
                const active = pathname === l.href || (l.href === "/services" && pathname.startsWith("/services"));
                return (
                  <Link key={l.href} href={l.href} className={active ? "px-4 py-2 rounded-full text-sm font-bold text-blue-600 bg-blue-50" : "px-4 py-2 rounded-full text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50"}>
                    {l.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
              <Link href="/services" className="hidden md:inline-flex px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-slate-800">Book Repair</Link>
              {user ? (
                <div className="relative">
                  <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border hover:shadow-md bg-white">
                    {user.image ? (
                      <img src={user.image} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">{(user.name || user.email || "U").charAt(0).toUpperCase()}</span>
                    )}
                    <span className="hidden sm:block text-sm font-bold text-slate-800 max-w-24 truncate">{user.name || "My Account"}</span>
                    <span className="text-slate-500 text-xs">▼</span>
                  </button>
                  {userMenu && (
                    <div className="absolute right-0 top-12 w-56 bg-white border rounded-2xl shadow-xl p-2">
                      <p className="px-3 py-2 text-xs font-bold text-slate-500 border-b truncate">{user.email}</p>
                      <Link href={dashboardLink()} onClick={() => setUserMenu(false)} className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50">My Dashboard</Link>
                      <Link href="/profile" onClick={() => setUserMenu(false)} className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50">My Profile</Link>
                      {user.role !== "customer" && (
                        <Link href="/dashboard/customer" onClick={() => setUserMenu(false)} className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">My Bookings</Link>
                      )}
                      <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50">Log Out</button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/signin" className="hidden sm:inline-flex px-4 py-2.5 rounded-full border text-sm font-bold text-slate-800 hover:bg-slate-50">Sign In</Link>
                  <Link href="/signup" className="px-4 md:px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-sm">Get Started</Link>
                </>
              )}

              <button onClick={() => setOpen(!open)} className="lg:hidden w-10 h-10 rounded-full border flex flex-col items-center justify-center gap-1 bg-white" aria-label="Menu">
                <span className="w-5 h-0.5 bg-slate-900 block"></span>
                <span className="w-5 h-0.5 bg-slate-900 block"></span>
                <span className="w-5 h-0.5 bg-slate-900 block"></span>
              </button>
            </div>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t bg-white px-4 py-4">
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={pathname === l.href ? "px-4 py-3 rounded-xl text-sm font-bold text-blue-600 bg-blue-50" : "px-4 py-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50"}>
                  {l.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link href={dashboardLink()} onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl text-sm font-bold text-slate-800 bg-slate-50 mt-2">My Dashboard</Link>
                  <Link href="/profile" onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl text-sm font-bold text-slate-800 bg-slate-50 mt-1">My Profile</Link>
                  <button onClick={handleLogout} className="px-4 py-3 rounded-xl text-sm font-bold text-red-600 bg-red-50 text-left mt-1">Log Out</button>
                </>
              ) : (
                <Link href="/signin" onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl text-sm font-bold text-slate-800 bg-slate-50 mt-2">Sign In</Link>
              )}
              <Link href="/services" onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 text-center mt-2">Book Repair Now</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
