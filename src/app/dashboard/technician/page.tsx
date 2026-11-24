"use client";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TechnicianDashboard() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);

  async function load() {
    const tokenRes = await fetch("/api/auth/token");
    const tokenData = await tokenRes.json();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/technician`, {
      headers: { Authorization: `Bearer ${tokenData.token}` },
    });
    const data = await res.json();
    setBookings(data);
  }

  useEffect(() => {
    if (isPending) return;
    if (!session) { router.push("/signin"); return; }
    load();
  }, [session, isPending, router]);

  async function updateStatus(id: string, status: string) {
    const tokenRes = await fetch("/api/auth/token");
    const tokenData = await tokenRes.json();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenData.token}` },
      body: JSON.stringify({ status }),
    });
    toast.success("Status update hoise");
    load();
  }

  if (isPending) return <p className="text-center py-20">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold">Technician Dashboard</h1>
      <p className="text-sm text-gray-500 mt-1">Welcome, {session?.user?.name}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {bookings.map((b) => (
          <div key={b._id} className="border rounded-xl p-4 bg-white shadow-sm">
            <h3 className="font-bold">{b.serviceTitle}</h3>
            <p className="text-sm text-gray-500">Date: {b.date} | {b.address}</p>
            <p className="text-sm text-gray-500">Phone: {b.phone}</p>
            <p className="text-sm mt-2">Status: <span className="font-bold">{b.status}</span></p>
            <div className="flex gap-2 mt-3 flex-wrap">
              <button onClick={() => updateStatus(b._id, "assigned")} className="bg-gray-200 text-sm px-3 py-1.5 rounded-lg">Assigned</button>
              <button onClick={() => updateStatus(b._id, "in-progress")} className="bg-yellow-200 text-sm px-3 py-1.5 rounded-lg">In Progress</button>
              <button onClick={() => updateStatus(b._id, "completed")} className="bg-green-600 text-white text-sm px-3 py-1.5 rounded-lg">Completed</button>
            </div>
          </div>
        ))}
      </div>
      {bookings.length === 0 && <p className="text-center text-gray-500 mt-10">Ekhono kono kaj assign hoy nai.</p>}
    </div>
  );
}
