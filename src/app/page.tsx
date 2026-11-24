"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/services`).then(res => setServices(res.data.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <div className="bg-white text-black">
      <div className="text-center py-12 md:py-16 px-4 bg-blue-50">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Device Nosto? FixMate Ache.</h1>
        <p className="text-gray-600 mb-6 text-sm md:text-base">Verified Technician, Home Visit, Pay After Service</p>
        <Link href="/services" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">Services Dekho</Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">Popular Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s._id} className="bg-white border rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-lg">{s.title}</h3>
              <p className="text-sm text-gray-500">{s.category}</p>
              <p className="text-sm mt-2 line-clamp-2">{s.description}</p>
              <p className="font-bold mt-2">৳ {s.basePrice || s.price}</p>
              <Link href={`/services/${s._id}`} className="inline-block mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg">Details</Link>
            </div>
          ))}
        </div>
        {services.length === 0 && <p className="text-center text-gray-500">Ekhono service load hocche...</p>}
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="border p-4 rounded-lg bg-white"><h3 className="font-bold">1. Booking Koro</h3><p className="text-sm">Service choose kore date dao</p></div>
        <div className="border p-4 rounded-lg bg-white"><h3 className="font-bold">2. Technician Asbe</h3><p className="text-sm">Basay ese repair korbe</p></div>
        <div className="border p-4 rounded-lg bg-white"><h3 className="font-bold">3. Pay After Service</h3><p className="text-sm">Kaj sesh hole payment koro</p></div>
      </div>
    </div>
  );
}
