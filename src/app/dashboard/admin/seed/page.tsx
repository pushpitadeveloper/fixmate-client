"use client";
import Link from "next/link";
import { useState } from "react";

const seedList = [
  { title: "Laptop Screen Replacement", category: "Laptop", description: "Cracked or flickering laptop screen replaced with original display. Tested before delivery.", price: 2500, duration: "1 hour", technician: "Verified Technician" },
  { title: "Laptop Battery Replacement", category: "Laptop", description: "Battery drains fast or swollen. Replaced with original battery. 90 days warranty.", price: 1800, duration: "1 hour", technician: "Verified Technician" },
  { title: "Laptop Keyboard Repair", category: "Laptop", description: "Keys not working or water damage. Keyboard cleaned or replaced.", price: 1200, duration: "1 hour", technician: "Verified Technician" },
  { title: "Laptop Motherboard Repair", category: "Laptop", description: "Laptop not turning on. Chip-level motherboard repair by experts.", price: 3500, duration: "3 hours", technician: "Verified Technician" },
  { title: "Laptop Charging Port Repair", category: "Laptop", description: "Not charging. Charging port and adapter pin fixed.", price: 900, duration: "1 hour", technician: "Verified Technician" },
  { title: "Laptop Software Setup", category: "Laptop", description: "Windows setup, virus removal, software install and speed optimization.", price: 800, duration: "2 hours", technician: "Verified Technician" },
  { title: "Mobile Screen Replacement", category: "Mobile", description: "Broken mobile display replaced with original OLED / LCD. Touch tested.", price: 1800, duration: "1 hour", technician: "Verified Technician" },
  { title: "Mobile Battery Replacement", category: "Mobile", description: "Battery drains fast. Replaced with original battery. Health 100 percent.", price: 1200, duration: "45 min", technician: "Verified Technician" },
  { title: "Mobile Charging Port Repair", category: "Mobile", description: "Not charging or loose cable. Port cleaned or replaced.", price: 700, duration: "1 hour", technician: "Verified Technician" },
  { title: "Mobile Camera Repair", category: "Mobile", description: "Blurry camera, black screen, no focus. Camera module replaced.", price: 1500, duration: "1 hour", technician: "Verified Technician" },
  { title: "Mobile Software Unlock", category: "Mobile", description: "Forgot password, hanging, software issue. Flash and unlock done.", price: 600, duration: "1 hour", technician: "Verified Technician" },
  { title: "Mobile Water Damage Repair", category: "Mobile", description: "Water damaged phone. Ultrasonic cleaning, drying and full checkup.", price: 2000, duration: "3 hours", technician: "Verified Technician" },
  { title: "PC Motherboard Repair", category: "PC", description: "Desktop not turning on. Chip-level motherboard repair.", price: 3000, duration: "3 hours", technician: "Verified Technician" },
  { title: "PC Power Supply Repair", category: "PC", description: "PC shuts down suddenly. PSU repaired or replaced.", price: 1500, duration: "1 hour", technician: "Verified Technician" },
  { title: "PC RAM Upgrade", category: "PC", description: "Slow PC. RAM upgrade plus SSD setup for faster speed.", price: 1000, duration: "1 hour", technician: "Verified Technician" },
  { title: "PC Data Recovery", category: "PC", description: "Deleted or formatted files, photos, documents recovered.", price: 2500, duration: "4 hours", technician: "Verified Technician" },
  { title: "Tablet Screen Replacement", category: "Tablet", description: "Broken tablet screen replaced with original display.", price: 2200, duration: "1 hour", technician: "Verified Technician" },
  { title: "Tablet Battery Replacement", category: "Tablet", description: "Tablet battery drains fast. Replaced with original battery.", price: 1600, duration: "1 hour", technician: "Verified Technician" },
  { title: "Printer Repair", category: "PC", description: "Paper jam, blurry print. Full service and cartridge fix.", price: 900, duration: "1 hour", technician: "Verified Technician" },
  { title: "WiFi Router Setup", category: "PC", description: "Router setup, slow WiFi, coverage issue. Full setup and config.", price: 1200, duration: "1 hour", technician: "Verified Technician" },
];

export default function SeedPage() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(0);

  async function handleSeed() {
    setLoading(true);
    setStatus("Seeding started...");
    setDone(0);
    let ok = 0;
    let firstError = "";
    for (const s of seedList) {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(s),
        });
        const text = await res.text();
        if (res.ok) ok++;
        else if (!firstError) firstError = "Status " + res.status + " - " + text.slice(0, 300);
        setDone(ok);
      } catch (e: any) {
        if (!firstError) firstError = e.message;
      }
    }
    setLoading(false);
    if (ok > 0) setStatus(ok + " services added successfully! Now check Services page.");
    else setStatus("Failed! Error: " + firstError);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <p className="text-blue-600 text-xs font-bold tracking-widest">ADMIN - SEED DATA</p>
      <h1 className="text-3xl md:text-4xl font-extrabold mt-2">Seed All Services</h1>
      <p className="text-slate-500 mt-2 text-sm md:text-base">This will add 20 services - Laptop, Mobile, PC, Tablet - in one click using the same API the website uses.</p>

      <div className="bg-white border rounded-3xl p-6 mt-6 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold">Laptop - 6</span>
          <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold">Mobile - 6</span>
          <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold">PC - 6</span>
          <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold">Tablet - 2</span>
        </div>
        <button onClick={handleSeed} disabled={loading} className="mt-5 px-6 py-3 rounded-full bg-blue-600 text-white font-bold text-sm disabled:opacity-50 hover:bg-blue-700">
          {loading ? "Adding... " + done + " / 20" : "Seed 20 Services Now"}
        </button>
        {status && <p className="mt-4 text-sm font-bold text-slate-800 bg-slate-50 border rounded-xl p-3">{status}</p>}
        <Link href="/services" className="block mt-4 text-blue-600 font-bold text-sm">View Services Page -&gt;</Link>
        <Link href="/dashboard/admin" className="block mt-2 text-slate-500 font-bold text-sm">Back to Admin Dashboard</Link>
      </div>

      <div className="bg-white border rounded-3xl p-6 mt-5">
        <h2 className="font-bold">Services that will be added:</h2>
        <div className="mt-3 flex flex-col gap-2">
          {seedList.map((s, i) => (
            <div key={i} className="flex justify-between gap-3 text-sm border-b pb-2 last:border-0">
              <span className="font-medium">{i + 1}. {s.title} <span className="text-slate-400">- {s.category}</span></span>
              <span className="font-bold shrink-0">{s.price} Tk</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
