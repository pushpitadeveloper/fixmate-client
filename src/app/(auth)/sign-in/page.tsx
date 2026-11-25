"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Google error hole sundor message dekhabe, kalo ERROR page na
  const [authError, setAuthError] = useState("");
  useEffect(() => {
    if (errorParam === "account_not_linked") {
      setAuthError("This email already has an account with password. Please sign in with password first. Or use a different Gmail to sign up.");
    } else if (errorParam === "access_denied") {
      setAuthError("Google login was cancelled. Please try again.");
    } else if (errorParam) {
      setAuthError("Google login failed. Please try again or sign in with password.");
    }
  }, [errorParam]);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill email and password");
      return;
    }
    setLoading(true);
    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/dashboard/customer",
    });
    if (error) {
      setLoading(false);
      toast.error(error.message || "Login failed. Please try again.");
      return;
    }
    toast.success("Welcome back!");
    const { data } = await authClient.getSession();
    const role = (data as any)?.user?.role;
    setLoading(false);
    if (role === "admin") router.push("/dashboard/admin");
    else if (role === "technician") router.push("/dashboard/technician");
    else router.push("/dashboard/customer");
  }

  async function handleGoogle() {
    setLoading(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard/customer",
      newUserCallbackURL: "/dashboard/customer",
      // FIX: Error hole /api/auth/error na, /sign-in e asbe
      errorCallbackURL: "/sign-in",
    });
    if (error) {
      setLoading(false);
      toast.error(error.message || "Google login failed. Please try again.");
    }
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white border rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-center mb-1">FixMate Sign In</h1>
        <p className="text-center text-sm text-gray-500 mb-4">Log in and get service.</p>
        {authError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2.5 mb-4">
            {authError}
          </div>
        )}
        <form onSubmit={handleSignIn} className="flex flex-col gap-3">
          <div>
            <label className="text-sm block mb-1">Email</label>
            <input className={inputClass} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm block mb-1">Password</label>
            <input className={inputClass} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg mt-2">
            {loading ? 'Loading...' : 'Sign In'}
          </button>
        </form>
        <div className="flex items-center gap-2 my-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>
        <button onClick={handleGoogle} disabled={loading} className="w-full border border-gray-300 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">
          Continue with Google
        </button>
        <p className="text-center text-sm mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-blue-600">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
