"use client";

import { useState, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCompare } from "@/contexts/compare-context";

export default function CompareFloatingBar() {
  const { items, removeItem, clearAll, isHydrated } = useCompare();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const prevItemsLength = useRef<number | null>(null);

  // Auto expand when new item is added (only after initial hydration)
  useLayoutEffect(() => {
    // Skip initial load - only react to actual user additions
    if (prevItemsLength.current !== null && items.length > prevItemsLength.current) {
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
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="font-medium">So sánh ({items.length})</span>
        </button>
      )}

      {/* Expanded compare bar - centered, wide layout like DMX */}
      {!isCollapsed && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] border-t border-gray-200 animate-slide-up">
          {/* Thu gọn button - top right */}
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="absolute -top-8 right-4 flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-t-lg text-xs text-gray-600 hover:text-gray-800 transition-colors shadow-sm"
          >
            Thu gọn
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center gap-4">
              {/* Products list */}
              <div className="flex-1 flex gap-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 min-w-[220px] max-w-[280px]"
                  >
                    {/* Product image */}
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain"
                        sizes="48px"
                      />
                    </div>

                    {/* Product name */}
                    <p className="flex-1 text-xs text-gray-700 line-clamp-2 leading-tight">
                      {item.name}
                    </p>

                    {/* Remove button */}
                    <button
                      type="button"
                      aria-label="Xóa sản phẩm"
                      onClick={() => removeItem(item.id)}
                      className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex flex-col items-end gap-1">
                <Link
                  href="/so-sanh"
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    items.length >= 2
                      ? "bg-[#1976d2] text-white hover:bg-[#1565c0]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
                  }`}
                >
                  So sánh ngay
                </Link>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs text-[#1976d2] hover:text-red-500 transition-colors"
                >
                  Xóa tất cả sản phẩm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
