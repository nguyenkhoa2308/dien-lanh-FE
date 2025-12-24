"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";
import { searchProducts, Product, calculateDiscount } from "@/lib/api";
import ProductCard from "@/components/product-card";
import ProductCardSkeleton from "@/components/product-card-skeleton";
import SearchBar from "@/components/search-bar";
import { brands, priceRanges, powerOptions } from "@/data/products";
import { cn, parsePriceRange } from "@/lib/utils";

const ITEMS_PER_PAGE = 12;

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState("relevant");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Filters
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedPower, setSelectedPower] = useState<string[]>([]);

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchProducts(query, 100);
        setProducts(results);
      } catch {
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by brand - compare with slug or name (lowercase)
    if (selectedBrands.length > 0) {
      result = result.filter((p) => {
        const brandSlug = p.brand?.slug?.toLowerCase() || "";
        const brandName = p.brand?.name?.toLowerCase() || "";
        return selectedBrands.some(
          (selected) =>
            brandSlug === selected.toLowerCase() ||
            brandName === selected.toLowerCase() ||
            brandSlug.includes(selected.toLowerCase()) ||
            brandName.includes(selected.toLowerCase())
        );
      });
    }

    // Filter by price
    if (selectedPrice) {
      const { min, max } = parsePriceRange(selectedPrice);
      result = result.filter((p) => {
        // Get the best price from variants or base price
        const defaultVariant = p.variants?.find((v) => v.isDefault);
        const price = parseFloat(
          defaultVariant?.price || p.variants?.[0]?.price || p.basePrice
        );
        return price >= min && price <= max;
      });
    }

    // Filter by power (from attributes or product name)
    if (selectedPower.length > 0) {
      result = result.filter((p) => {
        // Check in attributes
        const powerAttr = p.attributes?.find(
          (a) =>
            a.attribute.name === "Công suất" ||
            a.attribute.name.toLowerCase().includes("hp") ||
            a.attribute.name.toLowerCase().includes("btu")
        );

        // Check in product name for power info (e.g., "1HP", "1.5 HP", "9000BTU")
        const productName = p.name.toLowerCase();

        return selectedPower.some((power) => {
          // Match patterns like "1hp", "1 hp", "1.0hp", "9000btu", etc.
          const powerNum = power.replace(/[^0-9.]/g, "");
          const powerRegex = new RegExp(
            `\\b${powerNum}\\s*hp|${powerNum}hp`,
            "i"
          );
          const btuMap: Record<string, string> = {
            "1": "9000",
            "1.5": "12000",
            "2": "18000",
            "2.5": "24000",
          };
          const btuValue = btuMap[powerNum];
          const btuRegex = btuValue
            ? new RegExp(`\\b${btuValue}\\s*btu|${btuValue}btu`, "i")
            : null;

          // Check attribute value
          if (powerAttr) {
            const attrValue = powerAttr.value.toLowerCase();
            if (
              attrValue.includes(powerNum) ||
              attrValue.includes(`${powerNum}hp`) ||
              attrValue.includes(`${powerNum} hp`) ||
              (btuValue && attrValue.includes(btuValue))
            ) {
              return true;
            }
          }

          // Check product name
          if (
            powerRegex.test(productName) ||
            (btuRegex && btuRegex.test(productName))
          ) {
            return true;
          }

          return false;
        });
      });
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => {
          const priceA = parseFloat(a.variants?.[0]?.price || a.basePrice);
          const priceB = parseFloat(b.variants?.[0]?.price || b.basePrice);
          return priceA - priceB;
        });
        break;
      case "price-desc":
        result.sort((a, b) => {
          const priceA = parseFloat(a.variants?.[0]?.price || a.basePrice);
          const priceB = parseFloat(b.variants?.[0]?.price || b.basePrice);
          return priceB - priceA;
        });
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "discount":
        result.sort((a, b) => {
          const discountA = calculateDiscount(
            a.variants?.[0]?.price || a.basePrice,
            a.variants?.[0]?.compareAtPrice
          );
          const discountB = calculateDiscount(
            b.variants?.[0]?.price || b.basePrice,
            b.variants?.[0]?.compareAtPrice
          );
          return discountB - discountA;
        });
        break;
    }

    return result;
  }, [products, selectedBrands, selectedPrice, selectedPower, sortBy]);

  // Get visible products (for pagination)
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const hasMore = visibleCount < filteredProducts.length;

  // Reset visible count when filters or query change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [query, selectedBrands, selectedPrice, selectedPower, sortBy]);

  // Load more products
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simulate loading delay for skeleton effect
    setTimeout(() => {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 500);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedPrice("");
    setSelectedPower([]);
  };

  const hasActiveFilters =
    selectedBrands.length > 0 || selectedPrice || selectedPower.length > 0;

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            {query ? (
              <>Kết quả tìm kiếm cho &quot;{query}&quot;</>
            ) : (
              "Tìm kiếm sản phẩm"
            )}
          </h1>
          <div className="max-w-2xl">
            <SearchBar
              placeholder="Nhập từ khóa tìm kiếm..."
              className="[&_input]:bg-white/10 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder-white/70 [&_input:focus]:bg-white [&_input:focus]:text-[var(--gray-900)] [&_input:focus]:placeholder-[var(--gray-500)]"
            />
          </div>
          {/* Reserve space for product count to prevent layout shift */}
          <div className="mt-4 h-6">
            {query &&
              (isLoading ? (
                <div className="h-5 w-48 bg-white/20 rounded animate-pulse" />
              ) : (
                <p className="text-white/80">
                  Tìm thấy{" "}
                  <span className="font-bold text-white">
                    {filteredProducts.length}
                  </span>{" "}
                  sản phẩm
                  {filteredProducts.length > ITEMS_PER_PAGE && (
                    <span className="ml-2">
                      • Đang hiển thị{" "}
                      <span className="font-bold text-white">
                        {Math.min(visibleCount, filteredProducts.length)}
                      </span>
                    </span>
                  )}
                </p>
              ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Toolbar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filter toggle (mobile) */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-[var(--gray-50)] rounded-lg text-sm font-medium"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Bộ lọc
              {hasActiveFilters && (
                <span className="w-5 h-5 bg-[var(--primary)] text-white text-xs rounded-full flex items-center justify-center">
                  {selectedBrands.length +
                    (selectedPrice ? 1 : 0) +
                    selectedPower.length}
                </span>
              )}
            </button>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--gray-500)] hidden sm:block">
                Sắp xếp:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sắp xếp sản phẩm"
                className="px-3 py-2 bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="relevant">Liên quan nhất</option>
                <option value="price-asc">Giá thấp → cao</option>
                <option value="price-desc">Giá cao → thấp</option>
                <option value="discount">Giảm giá nhiều</option>
                <option value="name-asc">Tên A-Z</option>
              </select>
            </div>
          </div>

          {/* Active filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[var(--gray-100)]">
              <span className="text-sm text-[var(--gray-500)]">Đang lọc:</span>
              {selectedBrands.map((brand) => (
                <span
                  key={brand}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-sm rounded-full"
                >
                  {brands.find((b) => b.value === brand)?.label || brand}
                  <button
                    type="button"
                    title="Xóa bộ lọc"
                    onClick={() =>
                      setSelectedBrands((prev) =>
                        prev.filter((b) => b !== brand)
                      )
                    }
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              {selectedPrice && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-sm rounded-full">
                  {priceRanges.find((p) => p.value === selectedPrice)?.label}
                  <button
                    type="button"
                    title="Xóa bộ lọc"
                    onClick={() => setSelectedPrice("")}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {selectedPower.map((power) => (
                <span
                  key={power}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-sm rounded-full"
                >
                  {powerOptions.find((p) => p.value === power)?.label || power}
                  <button
                    type="button"
                    title="Xóa bộ lọc"
                    onClick={() =>
                      setSelectedPower((prev) =>
                        prev.filter((p) => p !== power)
                      )
                    }
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-[var(--gray-500)] hover:text-[var(--primary)] underline"
              >
                Xóa tất cả
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters (Desktop) */}
          <aside
            className={cn(
              "w-64 flex-shrink-0 hidden md:block",
              showFilters &&
                "!block fixed inset-0 z-50 w-full md:relative md:w-64"
            )}
          >
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-40">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[var(--gray-900)] flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Bộ lọc
                </h3>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs text-[var(--primary)] hover:underline"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>

              {/* Brand filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-sm text-[var(--gray-700)] mb-3">
                  Thương hiệu
                </h4>
                <div className="space-y-2">
                  {brands.slice(0, 8).map((brand) => (
                    <label
                      key={brand.value}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBrands((prev) => [...prev, brand.value]);
                          } else {
                            setSelectedBrands((prev) =>
                              prev.filter((b) => b !== brand.value)
                            );
                          }
                        }}
                        className="w-4 h-4 rounded border-[var(--gray-300)] text-[var(--primary)] focus:ring-[var(--primary)]"
                      />
                      <span className="text-sm text-[var(--gray-700)] group-hover:text-[var(--primary)]">
                        {brand.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-sm text-[var(--gray-700)] mb-3">
                  Mức giá
                </h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label
                      key={range.value}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="price"
                        checked={selectedPrice === range.value}
                        onChange={() => setSelectedPrice(range.value)}
                        className="w-4 h-4 border-[var(--gray-300)] text-[var(--primary)] focus:ring-[var(--primary)]"
                      />
                      <span className="text-sm text-[var(--gray-700)] group-hover:text-[var(--primary)]">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Power filter */}
              <div>
                <h4 className="font-semibold text-sm text-[var(--gray-700)] mb-3">
                  Công suất
                </h4>
                <div className="space-y-2">
                  {powerOptions.map((power) => (
                    <label
                      key={power.value}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPower.includes(power.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPower((prev) => [...prev, power.value]);
                          } else {
                            setSelectedPower((prev) =>
                              prev.filter((p) => p !== power.value)
                            );
                          }
                        }}
                        className="w-4 h-4 rounded border-[var(--gray-300)] text-[var(--primary)] focus:ring-[var(--primary)]"
                      />
                      <span className="text-sm text-[var(--gray-700)] group-hover:text-[var(--primary)]">
                        {power.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
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

                {/* Load more button - hide when loading */}
                {hasMore && !isLoadingMore && (
                  <div className="mt-8 text-center">
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-[var(--primary)] text-[var(--primary)] font-semibold rounded-xl hover:bg-[var(--primary)] hover:text-white transition-colors shadow-sm"
                    >
                      <span>Xem thêm sản phẩm</span>
                      <span className="text-sm font-normal opacity-80">
                        ({filteredProducts.length - visibleCount} sản phẩm còn
                        lại)
                      </span>
                    </button>
                  </div>
                )}

                {/* Show total count */}
                {!hasMore && filteredProducts.length > ITEMS_PER_PAGE && (
                  <div className="mt-6 text-center text-sm text-[var(--gray-500)]">
                    Đã hiển thị tất cả {filteredProducts.length} sản phẩm
                  </div>
                )}
              </>
            ) : query ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Search className="w-16 h-16 text-[var(--gray-300)] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2">
                  Không tìm thấy kết quả
                </h3>
                <p className="text-[var(--gray-500)] mb-6 max-w-md mx-auto">
                  Không có sản phẩm nào phù hợp với từ khóa &quot;{query}&quot;.
                  Hãy thử tìm với từ khóa khác.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="text-sm text-[var(--gray-500)]">Gợi ý:</span>
                  {["Máy lạnh Daikin", "Inverter", "Máy lạnh 1HP"].map(
                    (term) => (
                      <Link
                        key={term}
                        href={`/tim-kiem?q=${encodeURIComponent(term)}`}
                        className="px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-sm rounded-full hover:bg-[var(--primary)]/20 transition-colors"
                      >
                        {term}
                      </Link>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Search className="w-16 h-16 text-[var(--gray-300)] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2">
                  Tìm kiếm sản phẩm
                </h3>
                <p className="text-[var(--gray-500)]">
                  Nhập từ khóa để tìm kiếm máy lạnh phù hợp với bạn
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--gray-50)]">
          {/* Header skeleton */}
          <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="h-8 w-64 bg-white/20 rounded animate-pulse mb-4" />
              <div className="h-12 w-full max-w-2xl bg-white/20 rounded-xl animate-pulse" />
              <div className="mt-4 h-6">
                <div className="h-5 w-48 bg-white/20 rounded animate-pulse" />
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Toolbar skeleton */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="h-10 w-24 bg-[var(--gray-100)] rounded-lg animate-pulse" />
                <div className="h-10 w-40 bg-[var(--gray-100)] rounded-lg animate-pulse" />
              </div>
            </div>
            {/* Content with sidebar */}
            <div className="flex gap-6">
              {/* Sidebar skeleton */}
              <aside className="w-64 flex-shrink-0 hidden md:block">
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <div className="h-6 w-20 bg-[var(--gray-100)] rounded animate-pulse mb-4" />
                  <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-5 w-full bg-[var(--gray-100)] rounded animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              </aside>
              {/* Products grid skeleton */}
              <main className="flex-1 min-w-0">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              </main>
            </div>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
