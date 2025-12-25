"use client";

import { useState, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCompare } from "@/contexts/compare-context";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function CompareFloatingBar() {
  const { items, removeItem, clearAll, isHydrated } = useCompare();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<{ id: string; name: string } | null>(null);
  const prevItemsLength = useRef<number | null>(null);

  // Handle clear all with confirmation
  const handleClearAll = () => {
    clearAll();
    setShowClearConfirm(false);
  };

  // Handle remove single item with confirmation
  const handleRemoveItem = () => {
    if (itemToRemove) {
      removeItem(itemToRemove.id);
      setItemToRemove(null);
    }
  };

  // Auto expand when new item is added (only after initial hydration)
  useLayoutEffect(() => {
    // Skip initial load - only react to actual user additions
    if (
      prevItemsLength.current !== null &&
      items.length > prevItemsLength.current
    ) {
      setIsCollapsed(false);
    }
    // Update ref after hydration is complete
    if (isHydrated) {
      prevItemsLength.current = items.length;
    }
  }, [items.length, isHydrated]);

  // Don't render until hydrated (prevents SSR mismatch)
  // Don't show if no items
  if (!isHydrated || items.length === 0) {
    return null;
  }

  return (
    <>
      {/* Toggle button - bottom left */}
      {isCollapsed && (
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-white border border-gray-200 text-[#1976d2] px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:border-[#1976d2] transition-all"
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span className="font-medium">So sánh ({items.length})</span>
        </button>
      )}

      {/* Expanded compare bar - centered, wide layout like DMX */}
      {!isCollapsed && (
        <div className="fixed bottom-0 left-0 right-0 z-100 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] border-t border-gray-200 animate-slide-up">
          {/* Thu gọn button - top right */}
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="absolute -top-8 right-4 flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-t-lg text-xs text-gray-600 hover:text-gray-800 transition-colors shadow-sm"
          >
            Thu gọn
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              {/* Products list */}
              <div className="flex-1 flex flex-row gap-2 overflow-x-auto pb-2 md:pb-0">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 min-w-[calc(100%-1rem)] min-[400px]:min-w-[calc(50%-0.5rem)] sm:min-w-[200px] sm:max-w-[280px] flex-shrink-0"
                  >
                    {/* Product image */}
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain"
                        sizes="48px"
                      />
                    </div>

                    {/* Product name */}
                    <p className="flex-1 text-xs text-gray-700 line-clamp-2 leading-tight min-w-0">
                      {item.name}
                    </p>

                    {/* Remove button */}
                    <button
                      type="button"
                      aria-label="Xóa sản phẩm"
                      onClick={() => setItemToRemove({ id: item.id, name: item.name })}
                      className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 md:gap-1 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="text-xs text-[#1976d2] hover:text-red-500 transition-colors order-2 md:order-2"
                >
                  Xóa tất cả
                </button>
                <Link
                  href="/so-sanh"
                  onClick={() => setIsCollapsed(true)}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm font-semibold transition-colors order-1 md:order-1 ${
                    items.length >= 2
                      ? "bg-[#1976d2] text-white hover:bg-[#1565c0]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
                  }`}
                >
                  So sánh ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear all confirmation dialog */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearAll}
        title="Xóa tất cả sản phẩm?"
        message={`Bạn có chắc muốn xóa ${items.length} sản phẩm khỏi danh sách so sánh?`}
        confirmText="Xóa tất cả"
        variant="danger"
      />

      {/* Remove single item confirmation dialog */}
      <ConfirmDialog
        isOpen={!!itemToRemove}
        onClose={() => setItemToRemove(null)}
        onConfirm={handleRemoveItem}
        title="Xóa sản phẩm?"
        message={
          <>
            Bạn có chắc muốn xóa <strong>{itemToRemove?.name}</strong> khỏi danh sách so sánh?
          </>
        }
        confirmText="Xóa"
        variant="warning"
      />
    </>
  );
}
