import Link from "next/link";
export default function PaymentCancelPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-red-500">Payment Cancel</h1>
      <p className="text-gray-600 mt-3">Payment cancel hoise, pore abar try koro.</p>
      <Link href="/dashboard/customer" className="inline-block mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-lg">Dashboard e Jao</Link>
    </div>
  );
}
