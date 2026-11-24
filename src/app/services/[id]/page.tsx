"use client";
import axios from "axios";
import { useSession } from "@/lib/auth-client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ServiceDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { data: session } = useSession();
  const [service, setService] = useState<any>(null);
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`).then(res => setService(res.data)).catch(() => {});
  }, [id]);

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!session) {
      toast.error("Age login koro");
      router.push("/signin");
      return;
    }
    if (!date || !address || !phone) {
      toast.error("Date, Address, Phone dao");
      return;
    }
    setLoading(true);
    try {
      const tokenRes = await fetch("/api/auth/token");
      const tokenData = await tokenRes.json();
      const token = tokenData.token;
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
        { serviceId: id, date, address, phone, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Booking hoye gese!");
      router.push("/dashboard/customer");
    } catch {
      toast.error("Booking hoy nai");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500";

  if (!service) return <p className="text-center py-20">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <div className="bg-white border rounded-xl shadow-sm p-5 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold">{service.title}</h1>
        <p className="text-gray-500 mt-1 text-sm">{service.category} - {service.serviceArea || "Dhaka"}</p>
        <p className="mt-4 text-sm md:text-base">{service.description}</p>
        <p className="font-bold text-xl mt-4">Price: ৳ {service.basePrice || service.price}</p>
        <p className="text-sm text-gray-500 mt-1">Duration: {service.estimatedDuration || service.duration || "2 hours"}</p>
        <p className="text-sm text-gray-500">Technician: {service.technicianName || "Verified Technician"}</p>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-5 md:p-6">
        <h2 className="text-xl font-bold mb-4">Booking Koro</h2>
        <form onSubmit={handleBooking} className="flex flex-col gap-3">
          <div><label className="text-sm block mb-1">Date</label><input className={inputClass} type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></div>
          <div><label className="text-sm block mb-1">Address</label><input className={inputClass} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Basar address" required /></div>
          <div><label className="text-sm block mb-1">Phone</label><input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" required /></div>
          <div><label className="text-sm block mb-1">Note (optional)</label><textarea className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ki problem?" rows={3} /></div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg mt-2">{loading ? "Loading..." : "Confirm Booking"}</button>
        </form>
        {!session && <p className="text-sm text-red-500 mt-2">Booking er jonno age login korte hobe</p>}
      </div>
    </div>
  );
}
