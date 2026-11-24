"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 md:py-20 text-center">
      <div className="bg-white border rounded-3xl p-8 md:p-10 shadow-sm">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-100 text-red-500 flex items-center justify-center text-3xl font-bold">!</div>
        <h1 className="text-3xl font-extrabold mt-5">Something Went Wrong</h1>
        <p className="text-slate-500 mt-3 text-sm md:text-base leading-relaxed">
          Sorry, something went wrong while loading this page. Please try again.
          If the problem continues, go back to home.
        </p>

        {error?.digest && (
          <p className="text-xs text-slate-400 mt-4 font-mono">Error ID: {error.digest}</p>
        )}

        <div className="flex flex-wrap justify-center gap-3 mt-7">
          <button
            onClick={() => reset()}
            className="px-7 py-3 rounded-full bg-blue-600 text-white text-sm font-bold"
          >
            Try Again
          </button>
          <Link href="/" className="px-7 py-3 rounded-full border text-sm font-bold">
            Back to Home
          </Link>
          <Link href="/services" className="px-7 py-3 rounded-full border text-sm font-bold">
            Browse Services
          </Link>
        </div>
      </div>
    </div>
  );
}
