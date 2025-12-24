"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

const SPLASH_DURATION = 1500; // 0.8 seconds
const FADE_DURATION = 300; // 0.2 seconds fade out

interface SplashContextType {
  isLoading: boolean;
  isFading: boolean;
}

const SplashContext = createContext<SplashContextType>({
  isLoading: true,
  isFading: false,
});

export function useSplash() {
  return useContext(SplashContext);
}

export function SplashProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fade out after duration
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
      // Also start fading the CSS overlay
      document.body.classList.add("splash-hidden");
    }, SPLASH_DURATION);

    // Hide completely after fade
    const hideTimer = setTimeout(() => {
      setIsLoading(false);
    }, SPLASH_DURATION + FADE_DURATION);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <SplashContext.Provider value={{ isLoading, isFading }}>
      {children}
    </SplashContext.Provider>
  );
}
