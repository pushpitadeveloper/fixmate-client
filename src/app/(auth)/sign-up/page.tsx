"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (errorParam === "account_not_linked") {
      setAuthError("This email already has an account. Please Sign In instead of Sign Up, or use a different Gmail.");
    } else if (errorParam) {
      setAuthError("Google sign up failed. Please try again or use email and password.");
    }
  }, [errorParam]);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill all required fields");
      return;
    }
    if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      toast.error("Password must be at least 6 characters with 1 uppercase and 1 lowercase letter");
      return;
    }
    setLoading(true);
    const { error } = await (authClient.signUp.email as any)({
      name, email, password, role, phone,
      callbackURL: role === "technician" ? "/dashboard/technician" : "/dashboard/customer",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Sign up failed. Please try again.");
    } else {
      toast.success("Account created successfully!");
      router.push(role === "technician" ? "/dashboard/technician" : "/dashboard/customer");
    }
  }

  async function handleGoogle() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard/customer",
      newUserCallbackURL: "/dashboard/customer",
      // FIX: Eita na thaklei /api/auth/error page asto
      errorCallbackURL: "/sign-up",
    });
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white border rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-center mb-1">FixMate Sign Up</h1>
        <p className="text-center text-sm text-gray-500 mb-4">Open an account, get service</p>
        {authError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2.5 mb-4">
            {authError}
          </div>
        )}
        <form onSubmit={handleSignUp} className="flex flex-col gap-3">
          <div>
            <label className="text-sm block mb-1">Full Name</label>
            <input className={inputClass} value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm block mb-1">Email</label>
            <input className={inputClass} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm block mb-1">Password</label>
            <input className={inputClass} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <p className="text-xs text-gray-500 mt-1">Min 6 characters, 1 uppercase and 1 lowercase letter</p>
          </div>
          <div>
            <label className="text-sm block mb-1">Phone</label>
            <input className={inputClass} value={phone} onChange={e => setPhone(e.target.value)} placeholder="01XXXXXXXXX" />
          </div>
          <div>
            <label className="text-sm block mb-1">Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} className={inputClass}>
              <option value="customer">Customer</option>
              <option value="technician">Technician</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg mt-2">
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        </form>
        <div className="flex items-center gap-2 my-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>
        <button onClick={handleGoogle} className="w-full border border-gray-300 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">
          Continue with Google
        </button>
        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-blue-600">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
}
