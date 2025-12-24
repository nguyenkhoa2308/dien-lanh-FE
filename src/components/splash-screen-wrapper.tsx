"use client";

import dynamic from "next/dynamic";

// Dynamic import to prevent hydration mismatch
const SplashScreen = dynamic(() => import("@/components/splash-screen"), {
  ssr: false,
});

export default function SplashScreenWrapper() {
  return <SplashScreen />;
}
