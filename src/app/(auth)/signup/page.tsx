"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Sob field puron koro");
      return;
    }
    if (password.length < 8) {
      toast.error("Password minimum 8 character hote hobe");
      return;
    }
    setLoading(true);
    const { error } = await (authClient.signUp.email as any)({
      name, email, password, role, phone,
      callbackURL: "/",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Sign up hoy nai");
    } else {
      toast.success("Account hoye gese!");
      router.push("/");
    }
  }

  async function handleGoogle() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white border rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-center mb-1">FixMate Sign Up</h1>
        <p className="text-center text-sm text-gray-500 mb-4">Open an account, get service</p>
        <form onSubmit={handleSignUp} className="flex flex-col gap-3">
          <div>
            <label className="text-sm block mb-1">Full Name</label>
            <input
              className={inputClass}
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Email</label>
            <input
              className={inputClass}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Password</label>
            <input
              className={inputClass}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Phone</label>
            <input
              className={inputClass}
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} className={inputClass}>
              <option value="customer">Customer</option>
              <option value="technician">Technician</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg mt-2"
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        </form>
        <div className="flex items-center gap-2 my-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>
        <button
          onClick={handleGoogle}
          className="w-full border border-gray-300 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          Continue with Google
        </button>
        <p className="text-center text-sm mt-4">
          Account ache?{' '}
          <Link href="/signin" className="text-blue-600">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
