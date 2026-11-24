import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-blue-400">FixMate</h2>
          <p className="text-sm text-gray-400 mt-3">Verified Technician diye device repair. Basay ese repair, Pay After Service.</p>
        </div>
        <div>
          <h3 className="font-bold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/services" className="hover:text-white">Services</Link></li>
            <li><Link href="/signin" className="hover:text-white">Sign In</Link></li>
            <li><Link href="/signup" className="hover:text-white">Sign Up</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-3">Services</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Laptop Repair</li>
            <li>Mobile Repair</li>
            <li>PC Repair</li>
            <li>Tablet Repair</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-3">Contact</h3>
          <p className="text-sm text-gray-400">Dhaka, Bangladesh</p>
          <p className="text-sm text-gray-400 mt-1">support@fixmate.com</p>
          <p className="text-sm text-gray-400 mt-1">+880 1700-000000</p>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <p className="max-w-6xl mx-auto px-4 py-4 text-center text-sm text-gray-500">© 2026 FixMate - Device Repair Service | Pay After Service</p>
      </div>
    </footer>
  );
}
