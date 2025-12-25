'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import ProductCard from '@/components/product/ProductCard';
import type { Product } from '@/lib/api';
import 'swiper/css';

interface RelatedProductsSwiperProps {
  products: Product[];
}

export default function RelatedProductsSwiper({
  products,
}: RelatedProductsSwiperProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Sản phẩm tương tự</h2>
          <p className="text-sm text-gray-500">Lựa chọn gần với nhu cầu của bạn</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={isBeginning}
              aria-label="Sản phẩm trước"
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                isBeginning
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-md'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
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
              onClick={handleNext}
              disabled={isEnd}
              aria-label="Sản phẩm tiếp theo"
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                isEnd
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-md'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
          <Link
            href="/#products"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-dark)]"
          >
            Xem tất cả
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="relative">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          spaceBetween={16}
          slidesPerView={1.2}
          grabCursor
          breakpoints={{
            480: { slidesPerView: 1.6, spaceBetween: 12 },
            640: { slidesPerView: 2.2, spaceBetween: 14 },
            768: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 18 },
            1280: { slidesPerView: 4.4, spaceBetween: 20 },
          }}
          className="related-products-swiper !pb-2"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="h-auto">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
