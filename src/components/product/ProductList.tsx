"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  brands,
  priceRanges,
  features,
  popularBrands,
  quickFilters,
  sortOptions,
} from "@/data/products";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { parsePriceRange, cn, calculateDiscount } from "@/lib/utils";
import { Product } from "@/lib/api";

const ITEMS_PER_PAGE = 12;
const LOAD_MORE_DELAY = 500; // Brief delay for load more skeleton

interface Filters {
  brand: string[];
  power: string[];
  price: string;
  features: string[];
}

interface ProductListProps {
  initialProducts: Product[];
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products] = useState<Product[]>(initialProducts);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Track if user has manually changed filters (to override URL params)
  const [manualFilters, setManualFilters] = useState<Filters | null>(null);

  // Get filters from URL or manual state
  const filters: Filters = useMemo(() => {
    if (manualFilters) return manualFilters;

    const brandParam = searchParams.get("brand");
    const powerParam = searchParams.get("power");
    const priceParam = searchParams.get("price");
    const featureParam = searchParams.get("feature");

    return {
      brand: brandParam ? [brandParam] : [],
      power: powerParam ? [powerParam] : [],
      price: priceParam || "",
      features: featureParam ? [featureParam] : [],
    };
  }, [searchParams, manualFilters]);

  // Wrapper to set filters manually
  const setFilters = (newFilters: Filters | ((prev: Filters) => Filters)) => {
    if (typeof newFilters === "function") {
      setManualFilters(newFilters(filters));
    } else {
      setManualFilters(newFilters);
    }
  };

  // Helper: Get power from product name or attributes
  const getProductPower = (product: Product): string | null => {
    // Check in name: "1 HP", "1.5 HP", "2 HP", etc.
    const nameMatch = product.name.match(/(\d+\.?\d*)\s*HP/i);
    if (nameMatch) return nameMatch[1];

    // Check in attributes for "Công suất"
    const powerAttr = product.attributes?.find(
      (a) =>
        a.attribute.name.toLowerCase().includes("công suất") ||
        a.attribute.name.toLowerCase().includes("power")
    );
    if (powerAttr) {
      const attrMatch = powerAttr.value.match(/(\d+\.?\d*)/);
      if (attrMatch) return attrMatch[1];
    }

    return null;
  };

  // Helper: Check if product has a feature
  const hasFeature = (product: Product, feature: string): boolean => {
    const searchText = `${product.name} ${
      product.shortDescription || ""
    }`.toLowerCase();

    switch (feature) {
      case "inverter":
        return searchText.includes("inverter");
      case "fast-cooling":
        return (
          searchText.includes("làm lạnh nhanh") ||
          searchText.includes("turbo") ||
          searchText.includes("powerful")
        );
      case "air-filter":
        return (
          searchText.includes("lọc bụi") ||
          searchText.includes("nanoe") ||
          searchText.includes("pm2.5")
        );
      case "antibacterial":
        return (
          searchText.includes("kháng khuẩn") ||
          searchText.includes("diệt khuẩn") ||
          searchText.includes("anti-bacteria")
        );
      case "self-clean":
        return (
          searchText.includes("tự làm sạch") ||
          searchText.includes("self clean") ||
          searchText.includes("auto clean")
        );
      case "wifi":
        return (
          searchText.includes("wifi") ||
          searchText.includes("wi-fi") ||
          searchText.includes("điều khiển qua app")
        );
      default:
        return searchText.includes(feature);
    }
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply brand filter (check both slug and name)
    if (filters.brand.length > 0) {
      result = result.filter((p) => {
        const brandSlug = (p.brand?.slug || "").toLowerCase();
        const brandName = (p.brand?.name || "").toLowerCase();
        // Also check in product name for brand
        const productName = p.name.toLowerCase();

        return filters.brand.some((b) => {
          const filterBrand = b.toLowerCase();
          return (
            brandSlug === filterBrand ||
            brandSlug.includes(filterBrand) ||
            brandName === filterBrand ||
            brandName.includes(filterBrand) ||
            productName.includes(filterBrand)
          );
        });
      });
    }

    // Apply power filter (check in name and attributes)
    if (filters.power.length > 0) {
      result = result.filter((p) => {
        const productPower = getProductPower(p);
        return productPower && filters.power.includes(productPower);
      });
    }

    // Apply price filter
    if (filters.price) {
      const { min, max } = parsePriceRange(filters.price);
      result = result.filter((p) => {
        const price = parseFloat(p.basePrice);
        return price >= min && price <= max;
      });
    }

    // Apply features filter
    if (filters.features.length > 0) {
      result = result.filter((p) =>
        filters.features.every((f) => hasFeature(p, f))
      );
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort(
          (a, b) => parseFloat(a.basePrice) - parseFloat(b.basePrice)
        );
        break;
      case "price-desc":
        result.sort(
          (a, b) => parseFloat(b.basePrice) - parseFloat(a.basePrice)
        );
        break;
      case "discount":
        result.sort((a, b) => {
          const aVariant = a.variants.find((v) => v.isDefault) || a.variants[0];
          const bVariant = b.variants.find((v) => v.isDefault) || b.variants[0];
          const aDiscount = calculateDiscount(
            aVariant?.price || "0",
            aVariant?.compareAtPrice
          );
          const bDiscount = calculateDiscount(
            bVariant?.price || "0",
            bVariant?.compareAtPrice
          );
          return bDiscount - aDiscount;
        });
        break;
      default:
        // featured - keep isFeatured first
        result.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        });
    }

    return result;
  }, [products, filters, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // Handle quick filter click
  const handleQuickFilter = (value: string) => {
    const [type, val] = value.split(":");
    if (type === "brand") {
      setFilters((prev) => ({
        ...prev,
        brand: prev.brand.includes(val)
          ? prev.brand.filter((b) => b !== val)
          : [...prev.brand, val],
      }));
    } else if (type === "power") {
      setFilters((prev) => ({
        ...prev,
        power: prev.power.includes(val)
          ? prev.power.filter((p) => p !== val)
          : [...prev.power, val],
      }));
    } else if (type === "price") {
      setFilters((prev) => ({
        ...prev,
        price: prev.price === val ? "" : val,
      }));
    }
  };

  // Check if quick filter is active
  const isQuickFilterActive = (value: string) => {
    const [type, val] = value.split(":");
    if (type === "brand") return filters.brand.includes(val);
    if (type === "power") return filters.power.includes(val);
    if (type === "price") return filters.price === val;
    return false;
  };

  // Toggle array filter
  const toggleArrayFilter = (
    key: "brand" | "power" | "features",
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setManualFilters(null);
    setVisibleCount(ITEMS_PER_PAGE);
    // Clear URL params
    router.replace("/#products", { scroll: false });
  };

  const hasActiveFilters =
    filters.brand.length > 0 ||
    filters.power.length > 0 ||
    filters.price ||
    filters.features.length > 0;

  return (
    <section id="products" className="py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              MÁY LẠNH
            </h2>
            <span className="text-sm text-gray-500">
              ({filteredProducts.length} sản phẩm)
            </span>
          </div>

          {/* Filter bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            {/* Filter button and quick filters */}
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border text-sm font-medium transition-colors flex-shrink-0",
                  showFilters
                    ? "bg-[#1976d2] text-white border-[#1976d2]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#1976d2]"
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                  />
                </svg>
                <span className="hidden sm:inline">Bộ lọc</span>
                {hasActiveFilters && (
                  <span className="w-5 h-5 bg-[#d32f2f] text-white text-xs rounded-full flex items-center justify-center">
                    {filters.brand.length +
                      filters.power.length +
                      (filters.price ? 1 : 0) +
                      filters.features.length}
                  </span>
                )}
              </button>

              {/* Quick filters - scrollable on mobile */}
              <div className="flex-1 overflow-x-auto scrollbar-hide">
                <div className="flex items-center gap-2 pb-1">
                  {/* Popular brand logos */}
                  {popularBrands.map((brand) => (
                    <button
                      type="button"
                      key={brand.value}
                      onClick={() => handleQuickFilter(brand.value)}
                      className={cn(
                        "h-8 px-3 rounded-full border transition-all flex items-center justify-center flex-shrink-0 cursor-pointer",
                        isQuickFilterActive(brand.value)
                          ? "border-[#1976d2] border-2 bg-blue-50 shadow-sm"
                          : "border-gray-300 bg-white hover:border-[#1976d2] hover:bg-blue-50/50 hover:shadow-md hover:scale-105"
                      )}
                      title={brand.label}
                    >
                      <div className="relative w-14 h-5">
                        <Image
                          src={brand.image || ""}
                          alt={brand.label}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </button>
                  ))}

                  {/* Other quick filters (power, price) */}
                  {quickFilters.map((filter) => (
                    <button
                      type="button"
                      key={filter.value}
                      onClick={() => handleQuickFilter(filter.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all whitespace-nowrap flex-shrink-0 cursor-pointer",
                        isQuickFilterActive(filter.value)
                          ? "bg-[#1976d2] text-white border-[#1976d2] shadow-sm"
                          : "bg-white text-gray-600 border-gray-300 hover:border-[#1976d2] hover:text-[#1976d2] hover:bg-blue-50/50 hover:shadow-md hover:scale-105"
                      )}
                    >
                      {filter.label}
                    </button>
                  ))}

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="px-3 py-1.5 text-xs sm:text-sm text-[#d32f2f] hover:underline whitespace-nowrap flex-shrink-0"
                    >
                      Xóa lọc
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded filters */}
            {showFilters && (
              <div className="border-t border-gray-200 pt-4 mt-3 space-y-6">
                {/* Brand filter */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Hãng</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                    {brands.map((brand) => (
                      <button
                        key={brand.value}
                        onClick={() => toggleArrayFilter("brand", brand.value)}
                        className={cn(
                          "h-12 px-3 rounded-lg border transition-all flex items-center justify-center bg-white cursor-pointer",
                          filters.brand.includes(brand.value)
                            ? "border-[#1976d2] border-2 shadow-sm"
                            : "border-gray-200 hover:border-[#1976d2] hover:bg-blue-50/30 hover:shadow-md hover:scale-105"
                        )}
                        title={brand.label}
                      >
                        <div className="relative w-full h-7">
                          <Image
                            src={brand.image || ""}
                            alt={brand.label}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Power filter */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Công suất làm lạnh
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                    {[
                      { value: "1", label: "1 HP", room: "Phòng 15m²" },
                      { value: "1.5", label: "1.5 HP", room: "15 - 20m²" },
                      { value: "2", label: "2 HP", room: "20 - 30m²" },
                      { value: "2.5", label: "2.5 HP", room: "30 - 40m²" },
                    ].map((power) => (
                      <button
                        key={power.value}
                        onClick={() => toggleArrayFilter("power", power.value)}
                        className={cn(
                          "p-3 rounded-lg border transition-all flex flex-col items-center gap-1 bg-white cursor-pointer group",
                          filters.power.includes(power.value)
                            ? "border-[#1976d2] border-2 shadow-sm"
                            : "border-gray-200 hover:border-[#1976d2] hover:bg-blue-50/30 hover:shadow-md hover:scale-[1.02]"
                        )}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className={cn(
                            "w-8 h-8 transition-colors",
                            filters.power.includes(power.value)
                              ? "text-[#1976d2]"
                              : "text-gray-400 group-hover:text-[#1976d2]"
                          )}
                        >
                          <rect x="2" y="6" width="20" height="12" rx="2" />
                          <path d="M6 10h2M6 14h4" />
                          <path d="M16 9v6" strokeLinecap="round" />
                          <path
                            d="M14 11l2-2 2 2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span
                          className={cn(
                            "text-sm font-semibold transition-colors",
                            filters.power.includes(power.value)
                              ? "text-[#1976d2]"
                              : "text-gray-700 group-hover:text-[#1976d2]"
                          )}
                        >
                          {power.label}
                        </span>
                        <span className="text-xs text-gray-500">
                          {power.room}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price and Features in row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Price filter */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Mức giá
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {priceRanges.map((range) => (
                        <button
                          key={range.value}
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              price:
                                prev.price === range.value ? "" : range.value,
                            }))
                          }
                          className={cn(
                            "px-4 py-2 rounded-lg border text-sm transition-all bg-white cursor-pointer",
                            filters.price === range.value
                              ? "border-[#1976d2] border-2 text-[#1976d2] font-medium shadow-sm"
                              : "border-gray-200 text-gray-700 hover:border-[#1976d2] hover:text-[#1976d2] hover:bg-blue-50/30 hover:shadow-md"
                          )}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Features filter */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Tiện ích
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {features.map((feature) => (
                        <button
                          key={feature.value}
                          onClick={() =>
                            toggleArrayFilter("features", feature.value)
                          }
                          className={cn(
                            "px-4 py-2 rounded-lg border text-sm transition-all bg-white cursor-pointer",
                            filters.features.includes(feature.value)
                              ? "border-[#1976d2] border-2 text-[#1976d2] font-medium shadow-sm"
                              : "border-gray-200 text-gray-700 hover:border-[#1976d2] hover:text-[#1976d2] hover:bg-blue-50/30 hover:shadow-md"
                          )}
                        >
                          {feature.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 pt-3 mt-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  Sắp xếp:
                </span>
                <div className="flex flex-wrap gap-1">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={cn(
                        "px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors whitespace-nowrap",
                        sortBy === option.value
                          ? "bg-[#1976d2] text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products grid */}
          {visibleProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
                {/* Skeleton loading when loading more */}
                {isLoadingMore && (
                  <>
                    {Array.from({
                      length: Math.min(
                        ITEMS_PER_PAGE,
                        filteredProducts.length - visibleCount
                      ),
                    }).map((_, i) => (
                      <ProductCardSkeleton key={`skeleton-${i}`} />
                    ))}
                  </>
                )}
              </div>

              {/* Load more */}
              {hasMore && !isLoadingMore && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => {
                      setIsLoadingMore(true);
                      // Simulate loading delay for skeleton effect
                      setTimeout(() => {
                        setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
                        setIsLoadingMore(false);
                      }, LOAD_MORE_DELAY);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[#1976d2] text-[#1976d2] font-medium rounded-lg hover:bg-[#1976d2] hover:text-white transition-colors"
                  >
                    Xem thêm {filteredProducts.length - visibleCount} sản phẩm
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
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <div className="text-6xl mb-4">😕</div>
              <p className="text-gray-600 mb-4">
                Không tìm thấy sản phẩm phù hợp với bộ lọc
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-[#1976d2] text-white rounded-lg hover:bg-[#1565c0]"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
