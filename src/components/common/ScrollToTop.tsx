"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Component to scroll to top of page on route change
 * Uses instant scroll for immediate page position reset
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Instant scroll to top when route changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
