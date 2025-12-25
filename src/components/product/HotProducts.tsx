"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Product } from "@/lib/api";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";
import { useCompare } from "@/contexts/compare-context";
import "swiper/css";

interface HotProductsProps {
  products: Product[];
}

// Product Card DMX Style
function ProductCardDMX({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { addItem: addToCompare, removeItem: removeFromCompare, isInCompare, isHydrated } = useCompare();
  const [showNotification, setShowNotification] = useState(false);

  const defaultVariant =
    product.variants?.find((v) => v.isDefault) || product.variants?.[0];
  const primaryImage =
    product.media?.find((m) => m.isPrimary) || product.media?.[0];
  const discount = calculateDiscount(
    defaultVariant?.price || "0",
    defaultVariant?.compareAtPrice
  );
  const price = parseFloat(defaultVariant?.price || product.basePrice);
  // Only show comparing state after hydration to prevent SSR mismatch
  const isComparing = isHydrated && isInCompare(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: `${product.id}-default`,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price,
      image: primaryImage?.url || '/placeholder.jpg',
      quantity: 1,
    });

    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: `${product.id}-default`,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price,
      image: primaryImage?.url || '/placeholder.jpg',
      quantity: 1,
    });

    router.push('/thanh-toan');
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isComparing) {
      removeFromCompare(product.id);
    } else {
      addToCompare({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price,
        image: primaryImage?.url || '/placeholder.jpg',
        brand: product.brand?.name,
      });
    }
  };

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden h-full border border-gray-200 hover:shadow-lg transition-all duration-200">
      {/* Top labels */}
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-100 bg-gray-50">
        <span className="text-[10px] font-semibold text-orange-500 border border-orange-500 px-1.5 py-0.5 rounded">
          Mẫu mới
        </span>
        <span className="text-[10px] text-gray-500">
          Trả chậm 0% trả trước 0đ
        </span>
      </div>

      {/* Image */}
      <Link href={`/san-pham/${product.slug}`} className="block relative bg-white p-2">
        <div className="relative w-full aspect-square bg-gray-100 rounded">
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText || product.name}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, 200px"
            />
          )}
        </div>
      </Link>

      {/* Sale badge */}
      <div className="px-2">
        <span className="inline-block bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
          TẾT SALE
        </span>
      </div>

      {/* Product name */}
      <Link href={`/san-pham/${product.slug}`} className="block px-2 mt-1.5">
        <h3 className="text-[12px] font-medium text-gray-800 line-clamp-2 min-h-[32px] leading-[16px] group-hover:text-[#1976d2] transition-colors">
          {product.name}
        </h3>
      </Link>

      {/* Price */}
      <div className="px-2 mt-1">
        <div className="text-[14px] font-bold text-red-600">
          {formatPrice(defaultVariant?.price || product.basePrice)}
        </div>
        {defaultVariant?.compareAtPrice && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-gray-400 line-through">
              {formatPrice(defaultVariant.compareAtPrice)}
            </span>
            <span className="text-[10px] font-semibold text-red-600">
              -{discount}%
            </span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="px-2 pt-1 flex gap-1.5">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center gap-0.5 px-1.5 py-1.5 bg-white border border-[#1976d2] text-[#1976d2] text-[10px] font-semibold rounded hover:bg-[#1976d2] hover:text-white transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Giỏ hàng
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 flex items-center justify-center gap-0.5 px-1.5 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-[10px] font-semibold rounded hover:from-red-700 hover:to-red-800 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Mua ngay
        </button>
      </div>

      {/* Rating & Compare row */}
      <div className="px-2 py-2 flex items-center justify-between border-t border-gray-100 mt-1.5">
        <div className="flex items-center gap-1 text-[10px] text-gray-500">
          <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>4.9</span>
          <span className="text-gray-300">•</span>
          <span>Đã bán 12,5k</span>
        </div>
        <button
          type="button"
          onClick={handleToggleCompare}
          className={`flex items-center gap-0.5 text-[10px] transition-colors ${
            isComparing
              ? 'text-[#1976d2] font-semibold'
              : 'text-gray-500 hover:text-[#1976d2]'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isComparing ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            )}
          </svg>
          So sánh
        </button>
      </div>

      {/* Add to cart notification */}
      {showNotification && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-green-600 text-white px-3 py-1.5 rounded-lg shadow-xl animate-fade-in">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs font-medium">Đã thêm!</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HotProducts({ products }: HotProductsProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // Don't render if no products
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-4">
      <div className="max-w-7xl mx-auto px-4">
        {/* Unified container - Banner + Products trong cùng 1 khung */}
        <div className="bg-gradient-to-b from-red-600 via-red-600 to-red-700 rounded-xl overflow-hidden shadow-lg">
          {/* Banner with responsive aspect ratio */}
          <div className="w-full aspect-[3/1] sm:aspect-[4/1] md:aspect-[5/1] lg:aspect-[6/1] relative bg-red-700">
            <Image
              src="/images/banners/banner.png"
              alt="Khuyến mãi Tết 2025"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>

          {/* Products Section - cùng container với banner */}
          <div className="bg-white p-4">
            <div className="relative">
                {/* Navigation buttons */}
                <button
                  type="button"
                  onClick={() => swiperRef.current?.slidePrev()}
                  disabled={isBeginning}
                  aria-label="Trước"
                  className={`absolute -left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center transition-all ${
                    isBeginning
                      ? "opacity-0 pointer-events-none"
                      : "hover:bg-gray-50 hover:shadow-lg"
                  }`}
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
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
                  className={`absolute -right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center transition-all ${
                    isEnd
                      ? "opacity-0 pointer-events-none"
                      : "hover:bg-gray-50 hover:shadow-lg"
                  }`}
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
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

                {/* Swiper */}
                <Swiper
                  modules={[Autoplay, Navigation]}
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  onSlideChange={(swiper) => {
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                  }}
                  spaceBetween={12}
                  slidesPerView={2}
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  breakpoints={{
                    480: { slidesPerView: 2, spaceBetween: 12 },
                    640: { slidesPerView: 3, spaceBetween: 14 },
                    768: { slidesPerView: 4, spaceBetween: 16 },
                    1024: { slidesPerView: 5, spaceBetween: 16 },
                    1280: { slidesPerView: 5, spaceBetween: 20 },
                  }}
                  className="!px-1"
                >
                  {products.map((product) => (
                    <SwiperSlide key={product.id} className="!h-auto">
                      <ProductCardDMX product={product} />
                    </SwiperSlide>
                  ))}
                </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
