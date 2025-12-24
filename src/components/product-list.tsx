"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  brands,
  powerOptions,
  priceRanges,
  features,
  quickFilters,
  sortOptions,
} from "@/data/products";
import ProductCard from "./product-card";
import ProductCardSkeleton from "./product-card-skeleton";
import { parsePriceRange, cn, calculateDiscount } from "@/lib/utils";
import { Product } from "@/lib/api";

const ITEMS_PER_PAGE = 12;
const LOAD_MORE_DELAY = 500; // Simulate loading delay for better UX

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
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Show skeleton on initial load, then fade to real products
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 800); // Brief skeleton display for smooth UX
    return () => clearTimeout(timer);
  }, []);

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
    const searchText = `${product.name} ${product.shortDescription || ""}`.toLowerCase();

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
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors",
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
                Bộ lọc
                {hasActiveFilters && (
                  <span className="w-5 h-5 bg-[#d32f2f] text-white text-xs rounded-full flex items-center justify-center">
                    {filters.brand.length +
                      filters.power.length +
                      (filters.price ? 1 : 0) +
                      filters.features.length}
                  </span>
                )}
              </button>

              {/* Quick filters */}
              {quickFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => handleQuickFilter(filter.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
                    isQuickFilterActive(filter.value)
                      ? "bg-[#1976d2] text-white border-[#1976d2]"
                      : "bg-white text-gray-600 border-gray-300 hover:border-[#1976d2] hover:text-[#1976d2]"
                  )}
                >
                  {filter.label}
                </button>
              ))}

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 text-sm text-[#d32f2f] hover:underline"
                >
                  Xóa lọc
                </button>
              )}
            </div>

            {/* Expanded filters */}
            {showFilters && (
              <div className="border-t border-gray-200 pt-4 mt-3 grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Brand filter */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Hãng sản xuất
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {brands.map((brand) => (
                      <button
                        key={brand.value}
                        onClick={() => toggleArrayFilter("brand", brand.value)}
                        className={cn(
                          "px-3 py-1 rounded text-sm border transition-colors",
                          filters.brand.includes(brand.value)
                            ? "bg-[#1976d2] text-white border-[#1976d2]"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:border-[#1976d2]"
                        )}
                      >
                        {brand.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Power filter */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Công suất</h4>
                  <div className="flex flex-wrap gap-2">
                    {powerOptions.map((power) => (
                      <button
                        key={power.value}
                        onClick={() => toggleArrayFilter("power", power.value)}
                        className={cn(
                          "px-3 py-1 rounded text-sm border transition-colors",
                          filters.power.includes(power.value)
                            ? "bg-[#1976d2] text-white border-[#1976d2]"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:border-[#1976d2]"
                        )}
                      >
                        {power.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price filter */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Mức giá</h4>
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
                          "px-3 py-1 rounded text-sm border transition-colors",
                          filters.price === range.value
                            ? "bg-[#1976d2] text-white border-[#1976d2]"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:border-[#1976d2]"
                        )}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Features filter */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Tiện ích</h4>
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature) => (
                      <button
                        key={feature.value}
                        onClick={() =>
                          toggleArrayFilter("features", feature.value)
                        }
                        className={cn(
                          "px-3 py-1 rounded text-sm border transition-colors",
                          filters.features.includes(feature.value)
                            ? "bg-[#1976d2] text-white border-[#1976d2]"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:border-[#1976d2]"
                        )}
                      >
                        {feature.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sort */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-3 mt-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sắp xếp:</span>
                <div className="flex gap-1">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={cn(
                        "px-3 py-1 rounded text-sm transition-colors",
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
          {isInitialLoading ? (
            /* Skeleton grid on initial load */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <ProductCardSkeleton key={`initial-skeleton-${i}`} />
              ))}
            </div>
          ) : visibleProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
                {/* Skeleton loading when loading more */}
                {isLoadingMore && (
                  <>
                    {Array.from({ length: Math.min(ITEMS_PER_PAGE, filteredProducts.length - visibleCount) }).map((_, i) => (
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
