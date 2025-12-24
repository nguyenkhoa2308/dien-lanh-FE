"use client";

import { useState, useEffect } from "react";

const SPLASH_DURATION = 3000; // 3 seconds
const FADE_DURATION = 800; // 0.8 seconds fade out

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Check if splash was already shown in this session
    const splashShown = sessionStorage.getItem("splashShown");

    if (!splashShown) {
      setIsVisible(true);

      // Start fade out after duration
      const fadeTimer = setTimeout(() => {
        setIsFading(true);
      }, SPLASH_DURATION);

      // Hide completely after fade
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        sessionStorage.setItem("splashShown", "true");
      }, SPLASH_DURATION + FADE_DURATION);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-gradient-to-br from-[#1976d2] via-[#1565c0] to-[#0d47a1] flex items-center justify-center transition-opacity duration-[800ms] ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        {/* Logo */}
        <div className="relative">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20 animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-10 h-10 text-[#1976d2]"
            >
              <path d="M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.25a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l9.75-5.25Z" />
              <path d="m3.265 10.602 7.668 4.129a2.25 2.25 0 0 0 2.134 0l7.668-4.13 1.37.739a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.71 0l-9.75-5.25a.75.75 0 0 1 0-1.32l1.37-.738Z" />
              <path d="m10.933 19.231-7.668-4.13-1.37.739a.75.75 0 0 0 0 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 0 0 0-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 0 1-2.134-.001Z" />
            </svg>
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#ff5722] rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-xs font-bold">AC</span>
          </div>
        </div>

        {/* Brand name */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">
            Cool<span className="text-[#90caf9]">Mart</span>
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
