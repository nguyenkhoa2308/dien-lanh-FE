"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Component to scroll to top of page on route change
 * Uses smooth scroll behavior from CSS
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
}
