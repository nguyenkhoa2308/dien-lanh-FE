"use client";

import { ReactNode } from "react";
import { useSplash } from "@/contexts/splash-context";

interface PageContentProps {
  children: ReactNode;
}

export default function PageContent({ children }: PageContentProps) {
  const { isLoading, isFading } = useSplash();

  return (
    <div
      className={`transition-opacity duration-500 ${
        isLoading && !isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      {children}
    </div>
  );
}
