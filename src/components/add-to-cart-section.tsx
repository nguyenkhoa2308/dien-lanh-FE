"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/contexts/cart-context";
import QuantitySelector from "@/components/quantity-selector";

interface AddToCartSectionProps {
  productId: string;
  productName: string;
  productSlug: string;
  price: number;
  image: string;
  variantId?: string;
  variantName?: string;
}

export default function AddToCartSection({
  productId,
  productName,
  productSlug,
  price,
  image,
  variantId,
  variantName,
}: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    addItem({
      id: `${productId}-${variantId || "default"}`,
      productId,
      name: productName,
      slug: productSlug,
      price,
      image,
      quantity,
      variantId,
      variantName,
    });

    // Show notification
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleBuyNow = () => {
    addItem({
      id: `${productId}-${variantId || "default"}`,
      productId,
      name: productName,
      slug: productSlug,
      price,
      image,
      quantity,
      variantId,
      variantName,
    });

    router.push("/thanh-toan");
  };

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Số lượng:</span>
        <QuantitySelector value={quantity} onChange={setQuantity} size="lg" />
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 min-w-[200px] px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
        >
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
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Mua ngay
        </button>

        <button
          type="button"
          onClick={handleAddToCart}
          className="px-8 py-4 bg-white border-2 border-[var(--primary)] text-[var(--primary)] font-bold rounded-xl hover:bg-[var(--primary)] hover:text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-lg"
        >
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Thêm vào giỏ
        </button>

        <Link
          href="/lien-he"
          className="px-8 py-4 bg-gray-100 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
        >
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
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Tư vấn
        </Link>
      </div>

      {/* Success notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
          <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div>
              <p className="font-semibold">Đã thêm vào giỏ hàng!</p>
              <p className="text-sm text-green-100">
                {quantity} x {productName}
              </p>
            </div>
            <Link
              href="/gio-hang"
              className="ml-4 px-3 py-1.5 bg-white text-green-600 font-semibold rounded-lg text-sm hover:bg-green-50 transition-colors"
            >
              Xem giỏ
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
