import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { HeroUIProvider } from "@heroui/react";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata = {
  title: "FixMate - Device Repair Service",
  description: "Verified Technician diye device repair, pay after service",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <body className="bg-white text-black">
        <HeroUIProvider>
          <Navbar />
          {children}
          <Footer />
          <Toaster richColors position="top-right" />
        </HeroUIProvider>
      </body>
    </html>
  );
}
