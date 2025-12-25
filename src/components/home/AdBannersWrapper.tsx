"use client";

import dynamic from "next/dynamic";

// Dynamic import to prevent hydration mismatch (Swiper needs client-side JS)
const AdBannersSwiper = dynamic(
  () => import("@/components/home/AdBannersSwiper"),
  {
    ssr: false,
    loading: () => (
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4">
            <div className="flex-1 rounded-xl aspect-[16/5] skeleton" />
            <div className="hidden sm:block flex-1 rounded-xl aspect-[16/5] skeleton" />
          </div>
        </div>
      </section>
    ),
  }
);

export default function AdBannersWrapper() {
  return <AdBannersSwiper />;
}
