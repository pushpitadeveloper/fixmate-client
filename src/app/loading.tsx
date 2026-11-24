export default function Loading() {
  return (
    <div className="min-h- flex flex-col items-center justify-center px-4 py-20">
      <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
      <h1 className="text-2xl font-extrabold mt-6">Loading FixMate...</h1>
      <p className="text-slate-500 text-sm mt-2">Please wait, we are loading your page.</p>
      <div className="flex gap-1.5 mt-5">
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></span>
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.15s]"></span>
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.3s]"></span>
      </div>
    </div>
  );
}
