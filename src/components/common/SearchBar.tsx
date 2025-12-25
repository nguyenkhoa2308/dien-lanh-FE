"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X, TrendingUp, Clock, Loader2 } from "lucide-react";
import { searchProducts, Product, formatPrice } from "@/lib/api";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  isMobile?: boolean;
  onClose?: () => void;
}

// Popular search terms
const popularSearches = [
  "Máy lạnh Daikin",
  "Inverter 1HP",
  "Máy lạnh Panasonic",
  "Điều hòa 2 chiều",
  "Máy lạnh LG",
];

export default function SearchBar({
  className,
  placeholder = "Tìm máy lạnh theo tên, hãng, công suất...",
  isMobile = false,
  onClose,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("coolmart_recent_searches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored).slice(0, 5));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  // Save recent search
  const saveRecentSearch = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      localStorage.setItem("coolmart_recent_searches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Debounced search
  const searchDebounced = useCallback(async (searchQuery: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!searchQuery.trim()) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchProducts(searchQuery, 6);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    searchDebounced(value);
  };

  // Handle search submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query);
      router.push(`/tim-kiem?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setSuggestions([]);
      setIsOpen(false);
      onClose?.();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (product: Product) => {
    saveRecentSearch(product.name);
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
    onClose?.();
  };

  // Handle popular/recent search click
  const handleQuickSearch = (term: string) => {
    saveRecentSearch(term);
    router.push(`/tim-kiem?q=${encodeURIComponent(term)}`);
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
    onClose?.();
  };

  // Clear search
  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get primary image URL
  const getProductImage = (product: Product) => {
    const primaryMedia = product.media?.find((m) => m.isPrimary);
    return primaryMedia?.url || product.media?.[0]?.url || "/placeholder.jpg";
  };

  // Get product price
  const getProductPrice = (product: Product) => {
    const defaultVariant = product.variants?.find((v) => v.isDefault);
    return defaultVariant?.price || product.basePrice;
  };

  const showDropdown = isOpen && (query.trim() || recentSearches.length > 0);

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className={cn(
            "w-full pl-5 pr-20 py-3 bg-[var(--gray-50)] border-2 border-[var(--gray-200)] rounded-xl text-sm text-[var(--gray-900)] placeholder-[var(--gray-500)] focus:outline-none focus:border-[var(--primary)] focus:bg-white transition-all",
            isMobile && "bg-white border-[var(--gray-200)]"
          )}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-[var(--gray-400)] hover:text-[var(--gray-600)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="p-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-[var(--gray-100)] overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
        >
          {/* Search results */}
          {query.trim() && suggestions.length > 0 && (
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[var(--gray-500)] uppercase">
                  Gợi ý sản phẩm
                </span>
                <span className="text-xs text-[var(--gray-400)]">
                  {suggestions.length} kết quả
                </span>
              </div>
              <div className="space-y-1">
                {suggestions.map((product) => (
                  <Link
                    key={product.id}
                    href={`/san-pham/${product.slug}`}
                    onClick={() => handleSuggestionClick(product)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--gray-50)] transition-colors group"
                  >
                    <div className="relative w-12 h-12 bg-[var(--gray-100)] rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={getProductImage(product)}
                        alt={product.name}
                        fill
                        className="object-contain p-1"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--gray-900)] truncate group-hover:text-[var(--primary)] transition-colors">
                        {highlightMatch(product.name, query)}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[var(--primary)]">
                          {formatPrice(getProductPrice(product))}
                        </span>
                        {product.brand && (
                          <span className="text-xs text-[var(--gray-500)]">
                            • {product.brand.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <Search className="w-4 h-4 text-[var(--gray-300)] group-hover:text-[var(--primary)] transition-colors" />
                  </Link>
                ))}
              </div>
              {/* View all results */}
              <button
                onClick={handleSubmit}
                className="w-full mt-2 py-2.5 text-sm font-medium text-[var(--primary)] bg-[var(--primary)]/5 rounded-lg hover:bg-[var(--primary)]/10 transition-colors"
              >
                Xem tất cả kết quả cho &quot;{query}&quot;
              </button>
            </div>
          )}

          {/* No results */}
          {query.trim() && !isLoading && suggestions.length === 0 && (
            <div className="p-6 text-center">
              <Search className="w-10 h-10 text-[var(--gray-300)] mx-auto mb-2" />
              <p className="text-sm text-[var(--gray-500)]">
                Không tìm thấy sản phẩm phù hợp với &quot;{query}&quot;
              </p>
              <p className="text-xs text-[var(--gray-400)] mt-1">
                Thử tìm với từ khóa khác
              </p>
            </div>
          )}

          {/* Loading state */}
          {query.trim() && isLoading && suggestions.length === 0 && (
            <div className="p-6 text-center">
              <Loader2 className="w-6 h-6 text-[var(--primary)] animate-spin mx-auto mb-2" />
              <p className="text-sm text-[var(--gray-500)]">Đang tìm kiếm...</p>
            </div>
          )}

          {/* Recent searches */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="p-3 border-b border-[var(--gray-100)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[var(--gray-500)] uppercase flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Tìm kiếm gần đây
                </span>
                <button
                  onClick={() => {
                    setRecentSearches([]);
                    localStorage.removeItem("coolmart_recent_searches");
                  }}
                  className="text-xs text-[var(--gray-400)] hover:text-[var(--primary)] transition-colors"
                >
                  Xóa tất cả
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(term)}
                    className="px-3 py-1.5 bg-[var(--gray-50)] text-sm text-[var(--gray-700)] rounded-lg hover:bg-[var(--gray-100)] transition-colors flex items-center gap-1.5"
                  >
                    <Clock className="w-3.5 h-3.5 text-[var(--gray-400)]" />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular searches */}
          {!query.trim() && (
            <div className="p-3">
              <span className="text-xs font-semibold text-[var(--gray-500)] uppercase flex items-center gap-1.5 mb-2">
                <TrendingUp className="w-3.5 h-3.5" />
                Tìm kiếm phổ biến
              </span>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(term)}
                    className="px-3 py-1.5 bg-[var(--primary)]/5 text-sm text-[var(--primary)] rounded-lg hover:bg-[var(--primary)]/10 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper function to highlight matching text
function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="text-[var(--primary)] font-semibold">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

// Escape regex special characters
function escapeRegex(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
