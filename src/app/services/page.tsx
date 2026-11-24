"use client";
import { Button, Card, CardBody, Input } from "@heroui/react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/services`).then(res => setServices(res.data)).catch(() => {});
  }, []);

  const filtered = services.filter(s => s.title?.toLowerCase().includes(search.toLowerCase()) || s.category?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Sob Services</h1>
      <Input label="Search" placeholder="Laptop, Mobile..." value={search} onValueChange={setSearch} className="mb-6 max-w-md" />
      <div className="grid md:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <Card key={s._id}>
            <CardBody>
              <h3 className="font-bold text-lg">{s.title}</h3>
              <p className="text-sm text-gray-500">{s.category} - {s.serviceArea || "Dhaka"}</p>
              <p className="text-sm mt-2 line-clamp-2">{s.description}</p>
              <p className="font-bold mt-2">৳ {s.basePrice || s.price} | {s.estimatedDuration || s.duration || ""}</p>
              <Link href={`/services/${s._id}`}><Button size="sm" color="primary" className="mt-3">Book Koro</Button></Link>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
