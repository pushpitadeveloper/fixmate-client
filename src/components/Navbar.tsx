"use client";
import { authClient, useSession } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
        <Link href="/" className="text-2xl font-bold text-blue-600">FixMate</Link>
        <div className="hidden md:flex gap-5 items-center">
          <Link href="/">Home</Link>
          <Link href="/services">Services</Link>
          {session ? (
            <>
              <span className="text-sm">{session.user?.name}</span>
              <button onClick={async () => { await authClient.signOut(); window.location.reload(); }} className="bg-gray-200 px-3 py-1.5 rounded-lg text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link href="/signin" className="text-sm">Sign In</Link>
              <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Sign Up</Link>
            </>
          )}
        </div>
        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>☰</button>
      </div>
      {open && (
        <div className="md:hidden flex flex-col gap-3 px-4 pb-4 bg-white border-t">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/services" onClick={() => setOpen(false)}>Services</Link>
          {!session && (
            <>
              <Link href="/signin" onClick={() => setOpen(false)}>Sign In</Link>
              <Link href="/signup" onClick={() => setOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
