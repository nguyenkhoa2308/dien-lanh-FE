"use client";

import Image from "next/image";
import { useSplash } from "@/contexts/splash-context";

export default function SplashScreen() {
  const { isLoading, isFading } = useSplash();

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-gradient-to-br from-[#1976d2] via-[#1565c0] to-[#0d47a1] flex items-center justify-center transition-opacity duration-200 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        {/* Logo */}
        <div className="relative">
          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20 p-3">
            <Image
              src="/images/logos/logo.png"
              alt="Hùng Thành Logo"
              width={80}
              height={80}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>

        {/* Brand name */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">
            Hùng <span className="text-[#90caf9]">Thành</span>
          </h1>
          <p className="text-sm text-white/70 uppercase tracking-widest mt-1">
            Mát lạnh tận nhà
          </p>
        </div>

        {/* Loading indicator */}
        <div className="flex items-center gap-1.5 mt-4">
          <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
