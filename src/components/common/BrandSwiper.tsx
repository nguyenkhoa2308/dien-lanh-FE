"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import { allBrandLogos } from "@/data/products";

interface BrandSwiperProps {
  className?: string;
  showGrayscale?: boolean;
}

export default function BrandSwiper({
  className = "",
  showGrayscale = true,
}: BrandSwiperProps) {
  return (
    <div className={className}>
      <Swiper
        modules={[Autoplay, FreeMode]}
        spaceBetween={16}
        slidesPerView={3}
        loop={true}
        freeMode={true}
        speed={3000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        breakpoints={{
          480: {
            slidesPerView: 4,
            spaceBetween: 16,
          },
          640: {
            slidesPerView: 5,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 6,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 7,
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 8,
            spaceBetween: 24,
          },
        }}
        className="brand-swiper"
      >
        {allBrandLogos.map((brand, index) => (
          <SwiperSlide key={`${brand.value}-${index}`} className="pb-4">
            <div
              className={`flex items-center justify-center p-4 sm:p-5 bg-white rounded-xl sm:rounded-2xl border border-gray-100 hover:shadow-lg hover:border-[var(--primary)]/20 transition-all duration-300 ${
                showGrayscale ? "grayscale hover:grayscale-0" : ""
              }`}
            >
              <div className="relative w-16 h-10 sm:w-20 sm:h-12">
                <Image
                  src={brand.image || ""}
                  alt={brand.label}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
