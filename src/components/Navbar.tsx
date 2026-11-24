"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const user = session?.user as any;

  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/dashboard/customer", label: "My Bookings" },
  ];

  async function handleLogout() {
    await authClient.signOut();
    toast.success("Logout hoye gese");
    router.push("/");
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h- flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-600/30">F</div>
          <span className="text- font-extrabold tracking-tight">Fix<span className="text-blue-600">Mate</span></span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`text- font-medium transition ${pathname === l.href ? "text-blue-600" : "text-slate-600 hover:text-blue-600"}`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-full">
                <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{user.name?.[0] || "U"}</div>
                <span className="text-sm font-semibold max-w- truncate">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="px-5 py-2.5 rounded-full border border-slate-200 text-sm font-semibold hover:bg-slate-50">Logout</button>
            </>
          ) : (
            <>
              <Link href="/signin" className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-blue-600">Sign In</Link>
              <Link href="/signup" className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button onClick={() => setOpen(!open)} className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5">
          <span className={`w-6 h- bg-slate-800 transition ${open ? "rotate-45 translate-y-" : ""}`}></span>
          <span className={`w-6 h- bg-slate-800 transition ${open ? "opacity-0" : ""}`}></span>
          <span className={`w-6 h- bg-slate-800 transition ${open ? "-rotate-45 -translate-y-" : ""}`}></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-1 animate-fade-in">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="px-3 py-3 rounded-xl hover:bg-slate-50 font-medium">{l.label}</Link>
          ))}
          {user ? (
            <button onClick={handleLogout} className="mt-2 w-full py-3 rounded-xl bg-red-50 text-red-600 font-semibold">Logout</button>
          ) : (
            <>
              <Link href="/signin" onClick={() => setOpen(false)} className="mt-2 w-full text-center py-3 rounded-xl border font-semibold">Sign In</Link>
              <Link href="/signup" onClick={() => setOpen(false)} className="w-full text-center py-3 rounded-xl bg-blue-600 text-white font-semibold">Get Started</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
