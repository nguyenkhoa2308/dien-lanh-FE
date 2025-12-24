"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import {
  FreeMode,
  Keyboard,
  Thumbs,
  Navigation,
  Pagination,
  Autoplay,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface GalleryImage {
  src: string;
  alt: string;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [isMounted, setIsMounted] = useState(false);
  const mainSwiperRef = useRef<SwiperType | null>(null);
  const lightboxMainSwiperRef = useRef<SwiperType | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [lightboxThumbsSwiper, setLightboxThumbsSwiper] =
    useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const hasMultiple = images.length > 1;

  const safeThumbsSwiper = useMemo(() => {
    if (!thumbsSwiper) return null;
    if (thumbsSwiper.destroyed) return null;
    return thumbsSwiper;
  }, [thumbsSwiper]);

  const safeLightboxThumbsSwiper = useMemo(() => {
    if (!lightboxThumbsSwiper) return null;
    if (lightboxThumbsSwiper.destroyed) return null;
    return lightboxThumbsSwiper;
  }, [lightboxThumbsSwiper]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
  };

  const handleOpenLightbox = (index?: number) => {
    const nextIndex = index ?? activeIndex;
    setActiveIndex(nextIndex);
    setIsLightboxOpen(true);
    setTimeout(() => {
      lightboxMainSwiperRef.current?.slideTo(nextIndex);
    }, 100);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isLightboxOpen) {
        handleCloseLightbox();
      }
    };

    if (isLightboxOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isLightboxOpen]);

  return (
    <div className="space-y-4">
      {/* Main Gallery */}
      {isMounted ? (
        <div className="relative group">
          <Swiper
            modules={[Keyboard, Thumbs, Navigation, Pagination, Autoplay]}
            thumbs={{ swiper: safeThumbsSwiper }}
            keyboard={{ enabled: true }}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            slidesPerView={1}
            spaceBetween={0}
            loop={hasMultiple}
            className="rounded-2xl bg-gradient-to-br from-white to-gray-50 overflow-hidden shadow-lg"
            onSwiper={(swiper) => {
              mainSwiperRef.current = swiper;
              setActiveIndex(swiper.realIndex ?? 0);
            }}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.realIndex ?? 0);
            }}
          >
            {images.map((image, index) => (
              <SwiperSlide key={`${image.src}-${index}`}>
                <button
                  type="button"
                  onClick={() => handleOpenLightbox(index)}
                  className="relative w-full aspect-square cursor-zoom-in group/img"
                  aria-label={`Xem ảnh lớn: ${image.alt || productName}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt || productName}
                    fill
                    priority={index === 0}
                    className="object-contain p-8 transition-transform duration-500 group-hover/img:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  {/* Zoom hint overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/5 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/70 backdrop-blur-sm rounded-full p-3">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              </SwiperSlide>
            ))}

            {/* Custom Navigation Buttons */}
            {hasMultiple && (
              <>
                <button
                  type="button"
                  className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/95 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                  aria-label="Ảnh trước"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5 8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/95 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                  aria-label="Ảnh tiếp theo"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Zoom button */}
            {/* <button
              type="button"
              onClick={() => handleOpenLightbox(index)}
              className="absolute right-4 bottom-4 z-10 rounded-xl bg-black/70 backdrop-blur-md px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-black/80 transition-all duration-200 flex items-center gap-2 hover:scale-105"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
                />
              </svg>
              Phóng to
            </button> */}
          </Swiper>
        </div>
      ) : (
        <div className="relative rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg">
          <button
            type="button"
            onClick={() => handleOpenLightbox()}
            className="relative w-full aspect-square cursor-zoom-in"
            aria-label={`Xem ảnh lớn: ${
              images[activeIndex]?.alt || productName
            }`}
          >
            <Image
              src={images[activeIndex]?.src}
              alt={images[activeIndex]?.alt || productName}
              fill
              priority
              className="object-contain p-8"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </button>
        </div>
      )}

      {/* Thumbnails */}
      <div className="relative">
        {isMounted && hasMultiple ? (
          <Swiper
            onSwiper={setThumbsSwiper}
            modules={[FreeMode, Thumbs, Navigation]}
            freeMode
            watchSlidesProgress
            slideToClickedSlide
            spaceBetween={12}
            slidesPerView={4}
            breakpoints={{
              640: {
                slidesPerView: 5,
              },
              1024: {
                slidesPerView: 6,
              },
            }}
            navigation={{
              nextEl: ".thumb-button-next",
              prevEl: ".thumb-button-prev",
            }}
            className="product-thumbs-swiper"
          >
            {images.map((image, index) => (
              <SwiperSlide key={`thumb-${index}`}>
                <button
                  type="button"
                  className={`relative aspect-square w-full overflow-hidden rounded-xl border-2 bg-white transition-all duration-300 ${
                    index === activeIndex
                      ? "border-[var(--primary)] ring-4 ring-[var(--primary)]/20 shadow-lg scale-105"
                      : "border-gray-200 hover:border-[var(--primary)] hover:shadow-md"
                  }`}
                  onClick={() => {
                    setActiveIndex(index);
                    mainSwiperRef.current?.slideTo(index);
                  }}
                  aria-label={`Chọn ảnh ${index + 1}: ${
                    image.alt || productName
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt || productName}
                    fill
                    className="object-contain p-2"
                    sizes="120px"
                  />
                  {index === activeIndex && (
                    <div className="absolute inset-0 bg-[var(--primary)]/5 pointer-events-none" />
                  )}
                </button>
              </SwiperSlide>
            ))}

            {/* Thumbnail Navigation */}
            <button
              type="button"
              className="thumb-button-prev absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:scale-110 transition-all"
              aria-label="Thumbnails trước"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              type="button"
              className="thumb-button-next absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:scale-110 transition-all"
              aria-label="Thumbnails tiếp theo"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </Swiper>
        ) : !hasMultiple && isMounted ? (
          <div className="flex justify-center">
            <div className="relative aspect-square w-24 overflow-hidden rounded-xl border-2 border-[var(--primary)] ring-4 ring-[var(--primary)]/20 shadow-lg bg-white">
              <Image
                src={images[0].src}
                alt={images[0].alt || productName}
                fill
                className="object-contain p-2"
                sizes="120px"
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* Enhanced Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label={`Xem ảnh lớn của ${productName}`}
          onClick={handleCloseLightbox}
        >
          <div className="h-full flex flex-col p-4 md:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </div>
                <div className="text-white">
                  <div className="font-semibold text-sm">Hình ảnh sản phẩm</div>
                  <div className="text-xs text-gray-400">
                    {activeIndex + 1} / {images.length}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseLightbox}
                className="h-10 px-4 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium transition-all flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
                <span className="hidden sm:inline">Đóng</span>
                <span className="text-xs text-gray-400">(Esc)</span>
              </button>
            </div>

            {/* Main Image - Centered */}
            <div
              className="flex-1 flex items-center justify-center relative mb-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full h-full flex items-center justify-center">
                <Swiper
                  modules={[Keyboard, Thumbs, Navigation]}
                  thumbs={{ swiper: safeLightboxThumbsSwiper }}
                  keyboard={{ enabled: true }}
                  navigation={{
                    nextEl: ".lightbox-main-next",
                    prevEl: ".lightbox-main-prev",
                  }}
                  initialSlide={activeIndex}
                  loop={hasMultiple}
                  className="w-full h-full"
                  onSwiper={(swiper) => {
                    lightboxMainSwiperRef.current = swiper;
                  }}
                  onSlideChange={(swiper) => {
                    setActiveIndex(swiper.realIndex);
                  }}
                >
                  {images.map((image, index) => (
                    <SwiperSlide
                      key={`lightbox-main-${index}`}
                      className="!flex !items-center !justify-center"
                    >
                      <div className="relative w-full h-full max-w-5xl max-h-[70vh]">
                        <Image
                          src={image.src}
                          alt={image.alt || productName}
                          fill
                          className="object-contain"
                          sizes="90vw"
                          priority={index === activeIndex}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Navigation Arrows */}
              {hasMultiple && (
                <>
                  <button
                    type="button"
                    className="lightbox-main-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 h-14 w-14 rounded-full bg-white/90 backdrop-blur-sm shadow-2xl flex items-center justify-center text-gray-800 hover:bg-white hover:scale-110 transition-all"
                    aria-label="Ảnh trước"
                  >
                    <svg
                      className="w-7 h-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5 8.25 12l7.5-7.5"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="lightbox-main-next absolute right-4 top-1/2 -translate-y-1/2 z-10 h-14 w-14 rounded-full bg-white/90 backdrop-blur-sm shadow-2xl flex items-center justify-center text-gray-800 hover:bg-white hover:scale-110 transition-all"
                    aria-label="Ảnh tiếp theo"
                  >
                    <svg
                      className="w-7 h-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails at bottom - Limited view with slide, centered */}
            <div
              className="w-full max-w-4xl mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center">
                <Swiper
                  onSwiper={setLightboxThumbsSwiper}
                  modules={[FreeMode, Thumbs, Navigation]}
                  freeMode
                  watchSlidesProgress
                  slideToClickedSlide
                  spaceBetween={12}
                  slidesPerView={4}
                  breakpoints={{
                    640: {
                      slidesPerView: 5,
                    },
                    1024: {
                      slidesPerView: 6,
                    },
                  }}
                  centeredSlides={false}
                  navigation={{
                    nextEl: ".lightbox-thumb-next",
                    prevEl: ".lightbox-thumb-prev",
                  }}
                  className="lightbox-thumbs-swiper relative px-12"
                  style={{ maxWidth: "100%" }}
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={`lightbox-thumb-${index}`}>
                      <button
                        type="button"
                        className={`relative aspect-square w-full overflow-hidden rounded-lg border-2 bg-white transition-all duration-300 ${
                          index === activeIndex
                            ? "border-blue-500 ring-4 ring-blue-500/50 shadow-lg shadow-blue-500/50"
                            : "border-white/30 hover:border-white/60"
                        }`}
                        onClick={() => {
                          lightboxMainSwiperRef.current?.slideTo(index);
                        }}
                        aria-label={`Chọn ảnh ${index + 1}`}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt || productName}
                          fill
                          className="object-contain p-1"
                          sizes="120px"
                        />
                        {index === activeIndex && (
                          <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
                        )}
                      </button>
                    </SwiperSlide>
                  ))}

                  {/* Thumbnail Navigation */}
                  {hasMultiple && (
                    <>
                      <button
                        type="button"
                        className="lightbox-thumb-prev absolute -left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center text-gray-800 hover:bg-white hover:scale-110 transition-all"
                        aria-label="Thumbnails trước"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5 8.25 12l7.5-7.5"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="lightbox-thumb-next absolute -right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center text-gray-800 hover:bg-white hover:scale-110 transition-all"
                        aria-label="Thumbnails tiếp theo"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m8.25 4.5 7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
