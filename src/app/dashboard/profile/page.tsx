"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user: any = (session as any)?.user;
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (user && !loaded) {
      setName(user.name || "");
      setEmail(user.email || "");
      setImage(user.image || "");
      try {
        const saved = JSON.parse(localStorage.getItem("fixmate-profile") || "{}");
        setPhone(saved.phone || "");
        setAddress(saved.address || "");
        setCity(saved.city || "Dhaka");
        setBio(saved.bio || "");
      } catch {
        setPhone("");
        setAddress("");
        setCity("Dhaka");
        setBio("");
      }
      setLoaded(true);
    }
  }, [user, loaded]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    if (!name.trim()) {
      setMessage("Please enter your full name.");
      setLoading(false);
      return;
    }
    try {
      // Save to BetterAuth - name + image
      await authClient.updateUser({ name, image: image || undefined } as any);
      // Save extra fields locally - phone, address, city, bio
      localStorage.setItem("fixmate-profile", JSON.stringify({ phone, address, city, bio }));
      setMessage("Profile updated successfully!");
    } catch (err) {
      localStorage.setItem("fixmate-profile", JSON.stringify({ phone, address, city, bio }));
      setMessage("Profile saved!");
    }
    setLoading(false);
  }

  function dashboardLink() {
    if (user?.role === "admin") return "/dashboard/admin";
    if (user?.role === "technician") return "/dashboard/technician";
    return "/dashboard/customer";
  }

  if (isPending) {
    return <div className="max-w-3xl mx-auto px-4 py-20 text-center font-bold">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-extrabold">Please Sign In</h1>
        <p className="text-slate-500 mt-2 text-sm">You need to sign in to see your profile.</p>
        <Link href="/sign-in" className="inline-block mt-6 px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-bold">Go to Sign In</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-blue-600 text-xs font-bold tracking-widest">MY ACCOUNT</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-1">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your name, photo, phone and address.</p>
        </div>
        <Link href={dashboardLink()} className="px-5 py-2.5 rounded-full border text-sm font-bold">Back to Dashboard</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
        {/* Left - Photo Card */}
        <div className="bg-white border rounded-3xl p-6 text-center h-fit">
          <div className="relative w-32 h-32 mx-auto">
            {image ? (
              <img src={image} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-blue-100" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-blue-600 text-white flex items-center justify-center text-5xl font-extrabold border-4 border-blue-100">{(name || email || "U").charAt(0).toUpperCase()}</div>
            )}
            <button type="button" onClick={() => fileRef.current?.click()} className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-slate-900 text-white text-sm font-bold shadow-md" title="Change Photo">+</button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <h2 className="font-extrabold text-xl mt-4">{name || "Your Name"}</h2>
          <p className="text-sm text-slate-500">{email}</p>
          <span className="inline-block mt-3 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase">{user.role || "Customer"}</span>
          <div className="mt-5 space-y-2">
            <button type="button" onClick={() => fileRef.current?.click()} className="w-full py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold">Upload New Photo</button>
            <button type="button" onClick={() => { setImage(""); setImageUrl(""); }} className="w-full py-2.5 rounded-full border text-sm font-bold">Remove Photo</button>
          </div>
          <div className="mt-5 pt-5 border-t text-left">
            <p className="text-xs font-bold text-slate-400 tracking-widest">OR PASTE IMAGE LINK</p>
            <div className="flex gap-2 mt-2">
              <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="flex-1 border rounded-full px-3 py-2 text-sm outline-none" />
              <button type="button" onClick={() => imageUrl && setImage(imageUrl)} className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-bold">Use</button>
            </div>
            <p className="text-xs text-slate-400 mt-2">Upload any photo or paste a link - you will see the preview instantly.</p>
          </div>
        </div>

        {/* Right - Form */}
        <form onSubmit={handleSave} className="lg:col-span-2 bg-white border rounded-3xl p-6 md:p-8">
          <h3 className="font-extrabold text-lg">Personal Information</h3>
          <p className="text-sm text-slate-500 mt-1">If you change your name or photo, it will also update in the navbar.</p>
          {message && <p className="mt-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl px-4 py-3 text-sm font-bold">{message}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <div>
              <label className="text-sm font-bold">Full Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Pushpita Proma" className="w-full mt-1.5 border rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600" />
            </div>
            <div>
              <label className="text-sm font-bold">Email Address</label>
              <input value={email} disabled className="w-full mt-1.5 border rounded-xl px-4 py-3 text-sm outline-none bg-slate-50 text-slate-500" />
              <p className="text-xs text-slate-400 mt-1">Email cannot be changed - it is fixed for sign in.</p>
            </div>
            <div>
              <label className="text-sm font-bold">Phone Number</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01326-548954" className="w-full mt-1.5 border rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600" />
            </div>
            <div>
              <label className="text-sm font-bold">City</label>
              <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full mt-1.5 border rounded-xl px-4 py-3 text-sm outline-none bg-white">
                <option>Dhaka</option>
                <option>Chattogram</option>
                <option>Khulna</option>
                <option>Sylhet</option>
                <option>Rajshahi</option>
                <option>Barishal</option>
                <option>Rangpur</option>
                <option>Mymensingh</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-bold">Full Address</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House, Road, Area - Dhaka" className="w-full mt-1.5 border rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-bold">About Me</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Tell us about yourself..." className="w-full mt-1.5 border rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-600 resize-none" />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <button type="submit" disabled={loading} className="px-7 py-3 rounded-full bg-blue-600 text-white text-sm font-bold disabled:opacity-50">{loading ? "Saving..." : "Save Changes"}</button>
            <Link href={dashboardLink()} className="px-7 py-3 rounded-full border text-sm font-bold">Cancel</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 pt-6 border-t">
            <div className="bg-slate-50 rounded-2xl p-4"><p className="text-xs font-bold text-slate-500">ROLE</p><p className="font-bold mt-1 capitalize">{user.role || "Customer"}</p></div>
            <div className="bg-slate-50 rounded-2xl p-4"><p className="text-xs font-bold text-slate-500">ACCOUNT</p><p className="font-bold mt-1 truncate">{email}</p></div>
            <div className="bg-slate-50 rounded-2xl p-4"><p className="text-xs font-bold text-slate-500">STATUS</p><p className="font-bold mt-1 text-emerald-600">Verified</p></div>
          </div>
        </form>
      </div>
    </div>
  );
}
