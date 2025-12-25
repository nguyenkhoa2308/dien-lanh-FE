"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Mock ad banners data - replace with API data later
const adBanners = [
  {
    id: "1",
    image: "/images/banners/banner.png",
    alt: "Khuyến mãi Panasonic",
    link: "/khuyen-mai/panasonic",
  },
  {
    id: "2",
    image: "/images/banners/banner.png",
    alt: "Máy lạnh Casper giá tốt",
    link: "/khuyen-mai/casper",
  },
  {
    id: "3",
    image: "/images/banners/banner.png",
    alt: "Daikin chính hãng",
    link: "/khuyen-mai/daikin",
  },
  {
    id: "4",
    image: "/images/banners/banner.png",
    alt: "LG Inverter tiết kiệm điện",
    link: "/khuyen-mai/lg",
  },
];

export default function AdBannersSwiper() {
  const [isVisible, setIsVisible] = useState(true);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  if (!isVisible) return null;

  return (
    <section className="py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative">
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="absolute -top-2 -right-2 z-40 w-7 h-7 rounded-full bg-gray-800/80 hover:bg-gray-800 text-white flex items-center justify-center transition-colors shadow-md"
            aria-label="Đóng quảng cáo"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Navigation buttons */}
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={isBeginning}
            aria-label="Trước"
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center transition-all ${
              isBeginning
                ? "opacity-0 pointer-events-none"
                : "hover:bg-white hover:shadow-lg"
            }`}
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            disabled={isEnd}
            aria-label="Tiếp"
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center transition-all ${
              isEnd
                ? "opacity-0 pointer-events-none"
                : "hover:bg-white hover:shadow-lg"
            }`}
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Swiper - 2 banners at a time */}
          <Swiper
            modules={[Autoplay, Navigation]}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            spaceBetween={16}
            slidesPerView={1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 16 },
            }}
            className="ad-banners-swiper rounded-xl overflow-hidden"
          >
            {adBanners.map((banner) => (
              <SwiperSlide key={banner.id}>
                <Link
                  href={banner.link}
                  className="block rounded-xl overflow-hidden hover:opacity-95 transition-opacity"
                >
                  <div className="relative w-full overflow-hidden aspect-[16/5]">
                    <Image
                      src={banner.image}
                      alt={banner.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
