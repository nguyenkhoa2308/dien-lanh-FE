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

  // Format price
  const formatPrice = (price: string | number): string => {
    const num = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("vi-VN").format(num) + "đ";
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-16">
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Chưa có sản phẩm để so sánh
            </h1>
            <p className="text-gray-500 mb-6">
              Hãy thêm sản phẩm vào danh sách so sánh để xem sự khác biệt
            </p>
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1976d2] text-white font-semibold rounded-xl hover:bg-[#1565c0] transition-colors"
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-yellow-500"
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Cần thêm sản phẩm để so sánh
            </h1>
            <p className="text-gray-500 mb-6">
              Bạn cần ít nhất 2 sản phẩm để thực hiện so sánh
            </p>
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1976d2] text-white font-semibold rounded-xl hover:bg-[#1565c0] transition-colors"
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

  // Calculate column widths
  const labelColWidth = 120; // px for spec labels column
  const productColWidth = 180; // px per product column
  const tableMinWidth = labelColWidth + productColWidth * validProducts.length;

  return (
    <div className="min-h-screen bg-gray-100 py-4 md:py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/#products"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900">So sánh sản phẩm</h1>
              <p className="text-xs text-gray-500">{items.length} sản phẩm</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="text-xs text-gray-500 hover:text-red-500 transition-colors"
            >
              Xóa tất cả
            </button>
            {items.length < 3 && (
              <Link
                href="/#products"
                className="flex items-center gap-1 px-3 py-1.5 bg-[#1976d2] text-white text-xs font-medium rounded-lg hover:bg-[#1565c0] transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                </svg>
                Thêm
              </Link>
            )}
          </div>
        </div>

        {/* Compare Table - Unified design */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed" style={{ minWidth: `${tableMinWidth}px` }}>
              <colgroup>
                <col style={{ width: `${labelColWidth}px` }} />
                {validProducts.map((product) => (
                  <col key={product.id} style={{ width: `${productColWidth}px` }} />
                ))}
              </colgroup>

              {/* Product Header Row */}
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="p-3 bg-gray-50 sticky left-0 z-10">
                    <span className="sr-only">Thông số</span>
                  </th>
                  {validProducts.map((product) => (
                    <th key={product.id} className="p-3 text-center align-top">
                      <div className="relative">
                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => setItemToRemove({ id: product.id, name: product.name })}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors z-10"
                          title="Xóa"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        {/* Product image */}
                        <Link href={`/san-pham/${product.slug}`} className="block">
                          <div className="relative w-24 h-24 mx-auto mb-2 bg-gray-50 rounded-lg overflow-hidden">
                            <Image
                              src={getImageUrl(product)}
                              alt={product.name}
                              fill
                              className="object-contain p-2"
                              sizes="96px"
                            />
                            {getDiscount(product) && (
                              <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded">
                                -{getDiscount(product)}%
                              </span>
                            )}
                          </div>
                        </Link>

                        {/* Product name */}
                        <Link
                          href={`/san-pham/${product.slug}`}
                          className="block text-xs font-medium text-gray-800 hover:text-[#1976d2] line-clamp-2 mb-2 transition-colors h-8"
                        >
                          {product.name}
                        </Link>

                        {/* Price */}
                        <div className="text-sm font-bold text-red-600">
                          {formatPrice(getDisplayPrice(product))}
                        </div>
                        {getCompareAtPrice(product) && (
                          <div className="text-xs text-gray-400 line-through">
                            {formatPrice(getCompareAtPrice(product)!)}
                          </div>
                        )}

                        {/* CTA button */}
                        <Link
                          href={`/san-pham/${product.slug}`}
                          className="mt-2 inline-block px-4 py-1.5 bg-[#1976d2] text-white text-xs font-medium rounded-lg hover:bg-[#1565c0] transition-colors"
                        >
                          Chi tiết
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Brand row */}
                <tr className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="p-3 text-xs font-medium text-gray-600 bg-gray-50 sticky left-0 z-10">
                    Thương hiệu
                  </td>
                  {validProducts.map((product) => (
                    <td key={product.id} className="p-3 text-center text-xs text-gray-700">
                      {product.fullData?.brand?.name || product.brand || "-"}
                    </td>
                  ))}
                </tr>

                {/* Category row */}
                {hasFullData && (
                  <tr className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="p-3 text-xs font-medium text-gray-600 bg-gray-50 sticky left-0 z-10">
                      Danh mục
                    </td>
                    {validProducts.map((product) => (
                      <td key={product.id} className="p-3 text-center text-xs text-gray-700">
                        {product.fullData?.category?.name || "-"}
                      </td>
                    ))}
                  </tr>
                )}

                {/* Grouped specs */}
                {specGroups.map((group) => {
                  const isCollapsed = collapsedGroups.has(group.groupName);
                  return (
                    <React.Fragment key={`group-${group.groupName}`}>
                      {/* Group header */}
                      <tr
                        className="bg-blue-50 cursor-pointer hover:bg-blue-100/80 transition-colors"
                        onClick={() => toggleGroup(group.groupName)}
                      >
                        <td className="p-2.5 bg-blue-50 sticky left-0 z-10">
                          <div className="flex items-center gap-2">
                            <svg
                              className={`w-4 h-4 text-[#1976d2] transition-transform duration-150 ${isCollapsed ? "" : "rotate-90"}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-xs font-semibold text-[#1976d2] whitespace-nowrap">{group.groupName}</span>
                            <span className="text-[10px] text-gray-500">({group.specs.length})</span>
                          </div>
                        </td>
                        {validProducts.map((product) => (
                          <td key={product.id} className="p-2.5 bg-blue-50" />
                        ))}
                      </tr>

                      {/* Specs in group */}
                      {!isCollapsed && group.specs.map((spec, idx) => (
                        <tr
                          key={`${group.groupName}-${spec.name}`}
                          className={`border-b border-gray-100 hover:bg-gray-50/50 ${idx % 2 === 1 ? "bg-gray-50/30" : ""}`}
                        >
                          <td className="p-3 pl-6 text-xs font-medium text-gray-600 bg-gray-50 sticky left-0 z-10 break-words">
                            {spec.name}
                          </td>
                          {spec.values.map((value, valueIdx) => (
                            <td
                              key={validProducts[valueIdx]?.id || valueIdx}
                              className="p-3 text-center text-xs text-gray-700 break-words"
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

        {/* Footer */}
        <div className="mt-4 text-center">
          <Link
            href="/#products"
            className="inline-flex items-center gap-2 text-sm text-[#1976d2] hover:underline"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
