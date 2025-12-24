"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ChevronRight, Search, Tag } from "lucide-react";
import { newsArticles, newsCategories, getFeaturedArticles } from "@/data/news";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 6;

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const featuredArticles = getFeaturedArticles(3);

  const filteredArticles = useMemo(() => {
    let result = [...newsArticles];

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((a) => a.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.excerpt.toLowerCase().includes(query) ||
          a.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return result;
  }, [selectedCategory, searchQuery]);

  const visibleArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Tin tức & Kiến thức</h1>
          <p className="text-white/80">
            Cập nhật tin tức, mẹo hay và kiến thức về máy lạnh, điều hòa không khí
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Featured Articles */}
        {selectedCategory === "all" && !searchQuery && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[var(--primary)] rounded-full" />
              Bài viết nổi bật
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {featuredArticles.map((article, index) => (
                <Link
                  key={article.id}
                  href={`/tin-tuc/${article.slug}`}
                  className={cn(
                    "group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow",
                    index === 0 && "md:col-span-2 md:row-span-2"
                  )}
                >
                  <div
                    className={cn(
                      "relative",
                      index === 0 ? "aspect-[16/9] md:aspect-[16/10]" : "aspect-[16/9]"
                    )}
                  >
                    <Image
                      src={article.thumbnail}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes={index === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="inline-block px-2 py-1 bg-[var(--primary)] text-white text-xs font-medium rounded mb-2">
                        {newsCategories.find((c) => c.value === article.category)?.label}
                      </span>
                      <h3
                        className={cn(
                          "font-bold text-white group-hover:text-[var(--primary-light)] transition-colors",
                          index === 0 ? "text-xl md:text-2xl" : "text-base"
                        )}
                      >
                        {article.title}
                      </h3>
                      {index === 0 && (
                        <p className="text-white/80 text-sm mt-2 line-clamp-2 hidden md:block">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--gray-400)]" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-[var(--gray-200)] rounded-lg focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {newsCategories.map((category) => (
                <button
                  type="button"
                  key={category.value}
                  onClick={() => {
                    setSelectedCategory(category.value);
                    setVisibleCount(ITEMS_PER_PAGE);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    selectedCategory === category.value
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--gray-100)] text-[var(--gray-700)] hover:bg-[var(--gray-200)]"
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="flex gap-6">
          {/* Main Content */}
          <main className="flex-1">
            {filteredArticles.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  {visibleArticles.map((article) => (
                    <article
                      key={article.id}
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
                    >
                      <Link href={`/tin-tuc/${article.slug}`}>
                        <div className="relative aspect-[16/9]">
                          <Image
                            src={article.thumbnail}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <span className="absolute top-3 left-3 px-2 py-1 bg-[var(--primary)] text-white text-xs font-medium rounded">
                            {newsCategories.find((c) => c.value === article.category)?.label}
                          </span>
                        </div>
                      </Link>
                      <div className="p-4">
                        <Link href={`/tin-tuc/${article.slug}`}>
                          <h3 className="font-bold text-[var(--gray-900)] group-hover:text-[var(--primary)] transition-colors line-clamp-2 mb-2">
                            {article.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-[var(--gray-600)] line-clamp-2 mb-3">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-[var(--gray-500)]">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(article.publishedAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {article.readTime} phút đọc
                            </span>
                          </div>
                          <Link
                            href={`/tin-tuc/${article.slug}`}
                            className="flex items-center gap-1 text-[var(--primary)] font-medium hover:underline"
                          >
                            Đọc tiếp
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}

                  {/* Loading skeletons */}
                  {isLoadingMore &&
                    Array.from({ length: Math.min(ITEMS_PER_PAGE, filteredArticles.length - visibleCount) }).map((_, i) => (
                      <div key={`skeleton-${i}`} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                        <div className="aspect-[16/9] bg-gray-200" />
                        <div className="p-4">
                          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                          <div className="h-4 bg-gray-200 rounded w-full mb-1" />
                          <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
                          <div className="flex gap-4">
                            <div className="h-3 bg-gray-200 rounded w-20" />
                            <div className="h-3 bg-gray-200 rounded w-16" />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Load more */}
                {hasMore && !isLoadingMore && (
                  <div className="text-center mt-8">
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-[var(--primary)] text-[var(--primary)] font-semibold rounded-xl hover:bg-[var(--primary)] hover:text-white transition-colors shadow-sm"
                    >
                      Xem thêm bài viết
                      <span className="text-sm font-normal opacity-80">
                        ({filteredArticles.length - visibleCount} bài còn lại)
                      </span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Search className="w-16 h-16 text-[var(--gray-300)] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[var(--gray-900)] mb-2">
                  Không tìm thấy bài viết
                </h3>
                <p className="text-[var(--gray-500)]">
                  Thử tìm với từ khóa khác hoặc chọn danh mục khác
                </p>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="w-72 flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
              <h3 className="font-bold text-[var(--gray-900)] mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[var(--primary)]" />
                Tags phổ biến
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(newsArticles.flatMap((a) => a.tags))).map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      setSelectedCategory("all");
                      setVisibleCount(ITEMS_PER_PAGE);
                    }}
                    className="px-3 py-1.5 bg-[var(--gray-100)] text-[var(--gray-700)] text-sm rounded-full hover:bg-[var(--primary)] hover:text-white transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              {/* Quick links */}
              <div className="mt-6 pt-6 border-t border-[var(--gray-100)]">
                <h3 className="font-bold text-[var(--gray-900)] mb-4">Danh mục</h3>
                <ul className="space-y-2">
                  {newsCategories.slice(1).map((category) => {
                    const count = newsArticles.filter((a) => a.category === category.value).length;
                    return (
                      <li key={category.value}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory(category.value);
                            setSearchQuery("");
                            setVisibleCount(ITEMS_PER_PAGE);
                          }}
                          className="flex items-center justify-between w-full text-left text-[var(--gray-700)] hover:text-[var(--primary)] transition-colors"
                        >
                          <span>{category.label}</span>
                          <span className="text-xs bg-[var(--gray-100)] px-2 py-0.5 rounded-full">
                            {count}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
