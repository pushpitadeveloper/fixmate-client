"use client";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [description, setDescription] = useState("");

  async function load() {
    const tokenRes = await fetch("/api/auth/token");
    const tokenData = await tokenRes.json();
    const headers = { Authorization: `Bearer ${tokenData.token}` };
    const bRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, { headers });
    const bData = await bRes.json();
    const sRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`);
    const sData = await sRes.json();
    setBookings(bData);
    setServices(sData);
  }

  useEffect(() => {
    if (isPending) return;
    if (!session) { router.push("/signin"); return; }
    load();
  }, [session, isPending, router]);

  async function createService(e: React.FormEvent) {
    e.preventDefault();
    const tokenRes = await fetch("/api/auth/token");
    const tokenData = await tokenRes.json();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenData.token}` },
      body: JSON.stringify({ title, category, price: Number(basePrice), basePrice: Number(basePrice), description }),
    });
    toast.success("Service banano hoise");
    setTitle(""); setCategory(""); setBasePrice(""); setDescription("");
    load();
  }

  if (isPending) return <p className="text-center py-20">Loading...</p>;
  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm";

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="border rounded-xl p-4 bg-white"><p className="text-sm text-gray-500">Total Services</p><p className="text-2xl font-bold">{services.length}</p></div>
        <div className="border rounded-xl p-4 bg-white"><p className="text-sm text-gray-500">Total Bookings</p><p className="text-2xl font-bold">{bookings.length}</p></div>
        <div className="border rounded-xl p-4 bg-white"><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold">{bookings.filter(b => b.status === "pending").length}</p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="border rounded-xl p-5 bg-white">
          <h2 className="font-bold mb-3">Notun Service Banao</h2>
          <form onSubmit={createService} className="flex flex-col gap-3">
            <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title - Laptop Repair" required />
            <input className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category - Laptop & PC" required />
            <input className={inputClass} value={basePrice} onChange={(e) => setBasePrice(e.target.value)} placeholder="Price - 1000" type="number" required />
            <textarea className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={3} required />
            <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg">Create Service</button>
          </form>
        </div>
        <div className="border rounded-xl p-5 bg-white">
          <h2 className="font-bold mb-3">Sob Bookings</h2>
          <div className="flex flex-col gap-3 max-h- overflow-y-auto">
            {bookings.map((b) => (
              <div key={b._id} className="border rounded-lg p-3 text-sm">
                <p className="font-bold">{b.serviceTitle} - {b.status}</p>
                <p className="text-gray-500">{b.customerEmail} | {b.date} | ৳ {b.price}</p>
              </div>
            ))}
            {bookings.length === 0 && <p className="text-gray-500">Kono booking nai.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
