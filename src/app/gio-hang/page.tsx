"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import QuantitySelector from "@/components/common/QuantitySelector";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/utils";

// Confirmation Modal Component
function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />
      {/* Modal */}
      <div className="relative bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl animate-slide-up">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useCart();
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);

  const handleRemoveItem = (itemId: string) => {
    setItemToDelete(itemId);
  };

  const confirmRemoveItem = () => {
    if (itemToDelete) {
      removeItem(itemToDelete);
      setItemToDelete(null);
    }
  };

  const handleClearAll = () => {
    setShowClearAllModal(true);
  };

  const confirmClearAll = () => {
    clearCart();
    setShowClearAllModal(false);
  };

  const itemToDeleteName = items.find((item) => item.id === itemToDelete)?.name;

  if (items.length === 0) {
    return (
      <div className="py-12 min-h-[53.2vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Giỏ hàng trống
            </h1>
            <p className="text-gray-500 mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white font-semibold rounded-xl hover:bg-[var(--primary-dark)] transition-colors"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={!!itemToDelete}
        title="Xóa sản phẩm"
        message={`Bạn có chắc muốn xóa "${itemToDeleteName}" khỏi giỏ hàng?`}
        onConfirm={confirmRemoveItem}
        onCancel={() => setItemToDelete(null)}
      />
      <ConfirmModal
        isOpen={showClearAllModal}
        title="Xóa tất cả sản phẩm"
        message={`Bạn có chắc muốn xóa tất cả ${items.length} sản phẩm khỏi giỏ hàng?`}
        onConfirm={confirmClearAll}
        onCancel={() => setShowClearAllModal(false)}
      />

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link
              href="/"
              className="text-gray-500 hover:text-[var(--primary)] transition-colors"
            >
              Trang chủ
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Giỏ hàng</span>
          </nav>

          {/* Header with title and clear all button */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Giỏ hàng ({items.length} sản phẩm)
            </h1>
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 font-medium rounded-lg transition-colors"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Xóa tất cả
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-4 flex gap-4">
                  {/* Product Image */}
                  <Link href={`/san-pham/${item.slug}`} className="flex-shrink-0">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                        sizes="128px"
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/san-pham/${item.slug}`}
                      className="text-sm sm:text-base font-medium text-gray-900 hover:text-[var(--primary)] line-clamp-2 transition-colors"
                    >
                      {item.name}
                    </Link>

                    {item.variantName && (
                      <p className="text-sm text-gray-500 mt-1">
                        {item.variantName}
                      </p>
                    )}

                    <div className="mt-2 text-lg font-bold text-red-600">
                      {formatPrice(item.price)}
                    </div>

                    {/* Quantity & Actions */}
                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(qty) => updateQuantity(item.id, qty)}
                        size="sm"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Xóa
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="hidden sm:block text-right">
                    <div className="text-sm text-gray-500">Thành tiền</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 sticky top-36">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Tóm tắt đơn hàng
                </h2>

                <div className="space-y-3 pb-4 border-b border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium text-green-600">Miễn phí</span>
                  </div>
                </div>

                <div className="flex justify-between py-4">
                  <span className="text-base font-semibold text-gray-900">
                    Tổng cộng
                  </span>
                  <span className="text-xl font-bold text-red-600">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <Link
                  href="/thanh-toan"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                  Tiến hành thanh toán
                </Link>

                <Link
                  href="/#products"
                  className="w-full flex items-center justify-center gap-2 mt-3 px-6 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
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
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Tiếp tục mua sắm
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Sản phẩm chính hãng 100%
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Bảo hành 24 tháng
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Miễn phí lắp đặt nội thành
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
