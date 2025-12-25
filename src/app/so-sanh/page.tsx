"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCompare } from "@/contexts/compare-context";
import { Product, getProductBySlug } from "@/lib/api";
import ConfirmDialog from "@/components/common/ConfirmDialog";

interface CompareSpec {
  name: string;
  values: (string | null)[];
}

interface SpecGroup {
  groupName: string;
  specs: CompareSpec[];
}

// Combined product data - uses API data if available, falls back to compare item
interface DisplayProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  brand?: string;
  // Full product data from API (optional)
  fullData?: Product;
}

// Mobile spec row component - defined outside to prevent re-creation on each render
function MobileSpecRow({ label, values }: { label: string; values: (string | null)[] }) {
  const cols = values.length;
  return (
    <div className="border-b border-gray-100 py-3">
      <div className="text-sm font-semibold text-gray-700 mb-2">{label}</div>
      <div className={`grid gap-2 ${cols === 2 ? "grid-cols-2" : cols === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {values.map((value, idx) => (
          <div key={idx} className="text-xs text-gray-600 text-center bg-gray-50 rounded-lg py-2 px-1">
            {value || "-"}
          </div>
        ))}
      </div>
    </div>
  );
}

// Format price helper
function formatPrice(price: string | number): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("vi-VN").format(num) + "đ";
}

export default function ComparePage() {
  const { items, removeItem, clearAll, isHydrated } = useCompare();
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set()
  );
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<{
    id: string;
    name: string;
  } | null>(null);

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

  // Toggle group collapse
  const toggleGroup = (groupName: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  };

  // Fetch full product details, fall back to compare item data
  useEffect(() => {
    async function fetchProducts() {
      if (!isHydrated || items.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      // Start with basic data from compare items
      const displayProducts: DisplayProduct[] = items.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        price: item.price,
        image: item.image,
        brand: item.brand,
      }));

      // Try to fetch full details from API
      try {
        const productPromises = items.map((item) =>
          getProductBySlug(item.slug)
        );
        const results = await Promise.all(productPromises);

        // Merge API data into display products
        results.forEach((fullProduct, index) => {
          if (fullProduct) {
            displayProducts[index].fullData = fullProduct;
            // Update with API data if available
            displayProducts[index].name = fullProduct.name;
            displayProducts[index].brand = fullProduct.brand?.name;
          }
        });
      } catch (error) {
        console.error("Error fetching product details:", error);
        // Continue with basic data from compare items
      }

      setProducts(displayProducts);
      setLoading(false);
    }

    fetchProducts();
  }, [items, isHydrated]);

  // Filter out null products
  const validProducts = products.filter(
    (p): p is DisplayProduct => p !== null && p !== undefined
  );

  // Get all unique specs from products, grouped by displayGroup
  const getGroupedSpecs = (): SpecGroup[] => {
    // Map: groupName -> Map<specName, values[]>
    const groups = new Map<string, Map<string, (string | null)[]>>();

    validProducts.forEach((product, index) => {
      if (product?.fullData?.attributes) {
        product.fullData.attributes.forEach((attr) => {
          const groupName = attr.attribute.displayGroup || "Thông tin khác";
          const specName = attr.attribute.name;

          if (!groups.has(groupName)) {
            groups.set(groupName, new Map());
          }

          const groupSpecs = groups.get(groupName)!;
          if (!groupSpecs.has(specName)) {
            groupSpecs.set(specName, Array(validProducts.length).fill(null));
          }

          const values = groupSpecs.get(specName)!;
          values[index] = attr.value;
        });
      }
    });

    // Convert to array and sort
    const result: SpecGroup[] = [];

    // Define group order (prioritize important groups first)
    const groupOrder = [
      "Thông tin sản phẩm",
      "Thông tin chung",
      "Thông số cơ bản",
      "Thông số kỹ thuật",
      "Công suất & Hiệu năng",
      "Công suất",
      "Tính năng",
      "Tính năng nổi bật",
      "Thiết kế",
      "Kích thước",
      "Thông tin khác",
    ];

    // Sort groups by predefined order
    const sortedGroups = Array.from(groups.entries()).sort((a, b) => {
      const orderA = groupOrder.indexOf(a[0]);
      const orderB = groupOrder.indexOf(b[0]);
      if (orderA === -1 && orderB === -1) return a[0].localeCompare(b[0], "vi");
      if (orderA === -1) return 1;
      if (orderB === -1) return -1;
      return orderA - orderB;
    });

    sortedGroups.forEach(([groupName, specsMap]) => {
      const specs = Array.from(specsMap.entries())
        .map(([name, values]) => ({ name, values }))
        .sort((a, b) => a.name.localeCompare(b.name, "vi"));

      result.push({ groupName, specs });
    });

    return result;
  };


  // Get discount percentage
  const getDiscount = (product: DisplayProduct): number | null => {
    if (!product.fullData) return null;
    const defaultVariant =
      product.fullData.variants?.find((v) => v.isDefault) ||
      product.fullData.variants?.[0];
    if (!defaultVariant?.compareAtPrice) return null;
    const compareAt = parseFloat(defaultVariant.compareAtPrice);
    const current = parseFloat(defaultVariant.price);
    if (compareAt <= current) return null;
    return Math.round(((compareAt - current) / compareAt) * 100);
  };

  // Get display price
  const getDisplayPrice = (product: DisplayProduct): number => {
    if (product.fullData) {
      const defaultVariant =
        product.fullData.variants?.find((v) => v.isDefault) ||
        product.fullData.variants?.[0];
      return parseFloat(defaultVariant?.price || product.fullData.basePrice);
    }
    return product.price;
  };

  // Get compare at price
  const getCompareAtPrice = (product: DisplayProduct): string | null => {
    if (!product.fullData) return null;
    const defaultVariant =
      product.fullData.variants?.find((v) => v.isDefault) ||
      product.fullData.variants?.[0];
    return defaultVariant?.compareAtPrice || null;
  };

  // Get image URL
  const getImageUrl = (product: DisplayProduct): string => {
    if (product.fullData?.media) {
      return (
        product.fullData.media.find((m) => m.isPrimary)?.url ||
        product.fullData.media[0]?.url ||
        product.image
      );
    }
    return product.image;
  };

  // Loading state
  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-4 md:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-xl w-48 mb-6" />
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="aspect-square bg-gray-200 rounded-xl mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-5 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12 md:py-24 bg-white rounded-2xl shadow-lg mx-auto max-w-lg">
            <div className="w-20 h-20 md:w-28 md:h-28 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 md:w-14 md:h-14 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Chưa có sản phẩm so sánh
            </h1>
            <p className="text-gray-500 mb-6 px-4">
              Thêm sản phẩm vào danh sách để xem sự khác biệt
            </p>
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1976d2] text-white font-semibold rounded-xl hover:bg-[#1565c0] transition-colors shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Xem sản phẩm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Need at least 2 products
  if (items.length < 2) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12 md:py-24 bg-white rounded-2xl shadow-lg mx-auto max-w-lg">
            <div className="w-20 h-20 md:w-28 md:h-28 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 md:w-14 md:h-14 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Cần thêm sản phẩm
            </h1>
            <p className="text-gray-500 mb-6 px-4">
              Bạn cần ít nhất 2 sản phẩm để so sánh
            </p>
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1976d2] text-white font-semibold rounded-xl hover:bg-[#1565c0] transition-colors shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Thêm sản phẩm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const specGroups = getGroupedSpecs();
  const hasFullData = validProducts.some((p) => p?.fullData);
  const totalSpecs = specGroups.reduce((sum, g) => sum + g.specs.length, 0);

  return (
    <div className="min-h-screen bg-gray-100 py-4 md:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/#products"
              className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">So sánh</h1>
              <p className="text-xs md:text-sm text-gray-500">{items.length} sản phẩm</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="text-xs md:text-sm text-gray-500 hover:text-red-500 transition-colors px-2 py-1"
            >
              Xóa hết
            </button>
            {items.length < 3 && (
              <Link
                href="/#products"
                className="flex items-center gap-1 px-3 py-2 bg-[#1976d2] text-white text-xs md:text-sm font-medium rounded-lg hover:bg-[#1565c0] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                </svg>
                <span className="hidden md:inline">Thêm</span>
              </Link>
            )}
          </div>
        </div>

        {/* ===== MOBILE LAYOUT (< 768px) ===== */}
        <div className="lg:hidden">
          {/* Products - Horizontal scroll */}
          <div className="mb-4 -mx-4 px-4">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {validProducts.map((product) => (
                <div key={product.id} className="relative bg-white rounded-2xl p-4 shadow-sm flex-shrink-0 w-[160px] md:w-[200px]">
                  <button
                    type="button"
                    onClick={() => setItemToRemove({ id: product.id, name: product.name })}
                    className="absolute top-2 right-2 w-7 h-7 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors z-10"
                    title="Xóa"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <Link href={`/san-pham/${product.slug}`} className="block">
                    <div className="relative aspect-square mb-3 bg-gray-50 rounded-xl overflow-hidden">
                      <Image
                        src={getImageUrl(product)}
                        alt={product.name}
                        fill
                        className="object-contain p-2"
                        sizes="160px"
                      />
                      {getDiscount(product) && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded">
                          -{getDiscount(product)}%
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-medium text-gray-800 line-clamp-2 mb-2 min-h-[2rem]">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="text-sm font-bold text-red-600">
                    {formatPrice(getDisplayPrice(product))}
                  </div>
                  {getCompareAtPrice(product) && (
                    <div className="text-xs text-gray-400 line-through">
                      {formatPrice(getCompareAtPrice(product)!)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Specs comparison */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            {/* Brand */}
            <MobileSpecRow
              label="Thương hiệu"
              values={validProducts.map(p => p.fullData?.brand?.name || p.brand || null)}
            />

            {/* Category */}
            {hasFullData && (
              <MobileSpecRow
                label="Danh mục"
                values={validProducts.map(p => p.fullData?.category?.name || null)}
              />
            )}

            {/* Grouped specs */}
            {specGroups.map((group) => {
              const isCollapsed = collapsedGroups.has(group.groupName);
              return (
                <div key={`mobile-group-${group.groupName}`} className="mt-4">
                  {/* Group header */}
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.groupName)}
                    className="w-full flex items-center justify-between py-3 text-left"
                  >
                    <span className="text-base font-bold text-[#1976d2]">{group.groupName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{group.specs.length}</span>
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${isCollapsed ? "" : "rotate-180"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Specs in group */}
                  {!isCollapsed && (
                    <div className="border-t border-gray-100 pt-2">
                      {group.specs.map((spec) => (
                        <MobileSpecRow key={spec.name} label={spec.name} values={spec.values} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* No specs message */}
            {totalSpecs === 0 && !hasFullData && (
              <div className="py-8 text-center text-gray-400">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Không có thông số</span>
              </div>
            )}
          </div>
        </div>

        {/* ===== DESKTOP LAYOUT (>= 1024px) ===== */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <colgroup>
                  <col className="w-[220px]" />
                  {validProducts.map((product) => (
                    <col key={product.id} className="w-[300px]" />
                  ))}
                </colgroup>

                {/* Product Header Row */}
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="p-6 bg-gray-50 sticky left-0 z-10">
                      <span className="sr-only">Thông số</span>
                    </th>
                    {validProducts.map((product) => (
                      <th key={product.id} className="p-6 text-center align-top">
                        <div className="relative">
                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => setItemToRemove({ id: product.id, name: product.name })}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors z-10 shadow-sm"
                            title="Xóa"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>

                          {/* Product image */}
                          <Link href={`/san-pham/${product.slug}`} className="block">
                            <div className="relative w-44 h-44 xl:w-52 xl:h-52 mx-auto mb-4 bg-gray-50 rounded-xl overflow-hidden">
                              <Image
                                src={getImageUrl(product)}
                                alt={product.name}
                                fill
                                className="object-contain p-3"
                                sizes="(max-width: 1280px) 176px, 208px"
                              />
                              {getDiscount(product) && (
                                <span className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                                  -{getDiscount(product)}%
                                </span>
                              )}
                            </div>
                          </Link>

                          {/* Product name */}
                          <Link
                            href={`/san-pham/${product.slug}`}
                            className="block text-base font-semibold text-gray-800 hover:text-[#1976d2] line-clamp-2 mb-3 transition-colors min-h-[3rem]"
                          >
                            {product.name}
                          </Link>

                          {/* Price */}
                          <div className="text-xl font-bold text-red-600">
                            {formatPrice(getDisplayPrice(product))}
                          </div>
                          {getCompareAtPrice(product) && (
                            <div className="text-sm text-gray-400 line-through">
                              {formatPrice(getCompareAtPrice(product)!)}
                            </div>
                          )}

                          {/* CTA button */}
                          <Link
                            href={`/san-pham/${product.slug}`}
                            className="mt-4 inline-block px-6 py-2.5 bg-[#1976d2] text-white text-sm font-semibold rounded-xl hover:bg-[#1565c0] transition-colors shadow-sm"
                          >
                            Xem chi tiết
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {/* Brand row */}
                  <tr className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="p-4 text-sm font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10">
                      Thương hiệu
                    </td>
                    {validProducts.map((product) => (
                      <td key={product.id} className="p-4 text-center text-sm text-gray-600">
                        {product.fullData?.brand?.name || product.brand || "-"}
                      </td>
                    ))}
                  </tr>

                  {/* Category row */}
                  {hasFullData && (
                    <tr className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="p-4 text-sm font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10">
                        Danh mục
                      </td>
                      {validProducts.map((product) => (
                        <td key={product.id} className="p-4 text-center text-sm text-gray-600">
                          {product.fullData?.category?.name || "-"}
                        </td>
                      ))}
                    </tr>
                  )}

                  {/* Grouped specs */}
                  {specGroups.map((group) => {
                    const isCollapsed = collapsedGroups.has(group.groupName);
                    return (
                      <React.Fragment key={`desktop-group-${group.groupName}`}>
                        {/* Group header */}
                        <tr
                          className="bg-blue-50 cursor-pointer hover:bg-blue-100/80 transition-colors"
                          onClick={() => toggleGroup(group.groupName)}
                        >
                          <td className="p-4 bg-blue-50 sticky left-0 z-10">
                            <div className="flex items-center gap-3">
                              <svg
                                className={`w-5 h-5 text-[#1976d2] transition-transform duration-150 ${isCollapsed ? "" : "rotate-90"}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <span className="text-base font-bold text-[#1976d2]">{group.groupName}</span>
                              <span className="text-xs text-gray-500 bg-white/60 px-2 py-0.5 rounded-full">({group.specs.length})</span>
                            </div>
                          </td>
                          {validProducts.map((product) => (
                            <td key={product.id} className="p-4 bg-blue-50" />
                          ))}
                        </tr>

                        {/* Specs in group */}
                        {!isCollapsed && group.specs.map((spec, idx) => (
                          <tr
                            key={`${group.groupName}-${spec.name}`}
                            className={`border-b border-gray-100 hover:bg-gray-50/50 ${idx % 2 === 1 ? "bg-gray-50/30" : ""}`}
                          >
                            <td className="p-4 pl-10 text-sm font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10 break-words">
                              {spec.name}
                            </td>
                            {spec.values.map((value, valueIdx) => (
                              <td
                                key={validProducts[valueIdx]?.id || valueIdx}
                                className="p-4 text-center text-sm text-gray-600 break-words"
                              >
                                {value || "-"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}

                  {/* No specs message */}
                  {totalSpecs === 0 && !hasFullData && (
                    <tr>
                      <td colSpan={validProducts.length + 1} className="p-8 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm">Không thể tải thông số kỹ thuật</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            href="/#products"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm md:text-base text-[#1976d2] hover:bg-blue-50 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Tiếp tục xem sản phẩm
          </Link>
        </div>
      </div>

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
    </div>
  );
}
