"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/api";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";
import { useCompare } from "@/contexts/compare-context";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const {
    addItem: addToCompare,
    removeItem: removeFromCompare,
    isInCompare,
    isHydrated,
    items: compareItems,
  } = useCompare();
  const [showNotification, setShowNotification] = useState(false);
  const [showCompareFullNotification, setShowCompareFullNotification] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const defaultVariant =
    product.variants.find((v) => v.isDefault) || product.variants[0];
  const primaryImage =
    product.media.find((m) => m.isPrimary) || product.media[0];
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
      image: primaryImage?.url || "/placeholder.jpg",
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
      image: primaryImage?.url || "/placeholder.jpg",
      quantity: 1,
    });

    router.push("/thanh-toan");
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isComparing) {
      removeFromCompare(product.id);
    } else {
      // Check if compare list is full (max 3 items)
      if (compareItems.length >= 3) {
        setShowCompareFullNotification(true);
        setTimeout(() => setShowCompareFullNotification(false), 3000);
        return;
      }
      addToCompare({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price,
        image: primaryImage?.url || "/placeholder.jpg",
        brand: product.brand.name,
      });
    }
  };

  return (
    <div className="group relative bg-white rounded-lg border border-gray-200 hover:border-[#1976d2] hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Image container */}
      <Link
        href={`/san-pham/${product.slug}`}
        className="block relative aspect-square p-4 bg-white"
      >
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {discount > 0 && (
            <span className="bg-[#d32f2f] text-white text-xs font-bold px-2 py-0.5 rounded">
              -{discount}%
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-[#ff6f00] text-white text-xs font-bold px-2 py-0.5 rounded">
              Nổi bật
            </span>
          )}
        </div>

        {/* Product image with loading placeholder */}
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          {/* Skeleton placeholder - shown until image loads */}
          {!isImageLoaded && (
            <div className="w-16 h-16 bg-gray-200 rounded animate-pulse" />
          )}
        </div>
        {primaryImage && (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText || product.name}
            fill
            className={`object-contain p-2 transition-opacity duration-300 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onLoad={() => setIsImageLoaded(true)}
          />
        )}
      </Link>

      {/* Content */}
      <div className="p-3">
        {/* Product name */}
        <Link href={`/san-pham/${product.slug}`}>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px] group-hover:text-[#1976d2] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-[#d32f2f]">
            {formatPrice(defaultVariant?.price || product.basePrice)}
          </span>
          {defaultVariant?.compareAtPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(defaultVariant.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Specs */}
        <div className="mt-2 flex flex-wrap gap-1">
          <span className="inline-flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
            {product.brand.name}
          </span>
          {product.shortDescription?.includes("Inverter") && (
            <span className="inline-flex items-center text-xs text-[#1976d2] bg-blue-50 px-2 py-0.5 rounded">
              Inverter
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-white border-2 border-[#1976d2] text-[#1976d2] text-xs font-semibold rounded-lg hover:bg-[#1976d2] hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Giỏ hàng
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Mua ngay
          </button>
        </div>

        {/* Rating & Compare row */}
        <div className="mt-3 pt-2 flex items-center justify-between border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <svg
              className="w-3.5 h-3.5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>4.9</span>
            <span className="text-gray-300">•</span>
            <span>Đã bán 12k</span>
          </div>
          <button
            type="button"
            onClick={handleToggleCompare}
            className={`flex items-center gap-1 text-xs transition-colors ${
              isComparing
                ? "text-[#1976d2] font-semibold"
                : "text-gray-500 hover:text-[#1976d2]"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isComparing ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              )}
            </svg>
            So sánh
          </button>
        </div>
      </div>

      {/* Add to cart notification */}
      {showNotification && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-green-600 text-white px-4 py-2 rounded-lg shadow-xl animate-fade-in">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm font-medium">Đã thêm!</span>
          </div>
        </div>
      )}

      {/* Compare full notification */}
      {showCompareFullNotification && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-amber-500 text-white px-4 py-3 rounded-lg shadow-xl animate-fade-in max-w-[200px]">
          <div className="flex flex-col items-center gap-1 text-center">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="text-sm font-medium">Đã đủ 3 sản phẩm!</span>
            <span className="text-xs opacity-90">Xóa bớt để thêm mới</span>
          </div>
        </div>
      )}
    </div>
  );
}
