import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ChevronLeft, Share2, Facebook, Tag } from "lucide-react";
import { newsArticles, newsCategories, getArticleBySlug, getRelatedArticles } from "@/data/news";
import { Metadata } from "next";
import { ReactNode } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths
export async function generateStaticParams() {
  return newsArticles.map((article) => ({
    slug: article.slug,
  }));
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: "Không tìm thấy bài viết" };
  }

  return {
    title: `${article.title} | CoolMart`,
    description: article.excerpt,
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(slug, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Simple markdown-like content renderer
  const renderContent = (content: string) => {
    const lines = content.trim().split("\n");
    const elements: ReactNode[] = [];
    let inTable = false;
    let tableRows: string[] = [];

    lines.forEach((line, index) => {
      // Skip empty lines
      if (!line.trim()) {
        if (inTable) {
          // End of table
          elements.push(
            <div key={`table-${index}`} className="overflow-x-auto my-4">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {tableRows.map((row, i) => {
                    const cells = row.split("|").filter((c) => c.trim());
                    const isHeader = i === 0;
                    return (
                      <tr
                        key={i}
                        className={isHeader ? "bg-[var(--primary)] text-white" : "hover:bg-gray-50"}
                      >
                        {cells.map((cell, j) =>
                          isHeader ? (
                            <th key={j} className="px-4 py-2 text-left border">
                              {cell.trim()}
                            </th>
                          ) : (
                            <td key={j} className="px-4 py-2 border">
                              {cell.trim()}
                            </td>
                          )
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
          tableRows = [];
          inTable = false;
        }
        return;
      }

      // Table row
      if (line.startsWith("|")) {
        if (line.includes("---")) return; // Skip separator
        inTable = true;
        tableRows.push(line);
        return;
      }

      // H2
      if (line.startsWith("## ")) {
        elements.push(
          <h2 key={index} className="text-xl font-bold text-[var(--gray-900)] mt-8 mb-4">
            {line.replace("## ", "")}
          </h2>
        );
        return;
      }

      // H3
      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={index} className="text-lg font-semibold text-[var(--gray-900)] mt-6 mb-3">
            {line.replace("### ", "")}
          </h3>
        );
        return;
      }

      // List item
      if (line.startsWith("- ")) {
        const content = line.replace("- ", "");
        elements.push(
          <li key={index} className="flex items-start gap-2 text-[var(--gray-700)] mb-2">
            <span className="text-[var(--primary)] mt-1">•</span>
            <span dangerouslySetInnerHTML={{ __html: content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
          </li>
        );
        return;
      }

      // Paragraph with bold text
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      elements.push(
        <p
          key={index}
          className="text-[var(--gray-700)] leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    });

    return elements;
  };

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header Image */}
      <div className="relative h-64 md:h-96">
        <Image
          src={article.thumbnail}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/tin-tuc"
              className="inline-flex items-center gap-1 text-white/80 hover:text-white mb-4 text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Quay lại tin tức
            </Link>
            <span className="inline-block px-3 py-1 bg-[var(--primary)] text-white text-sm font-medium rounded mb-3">
              {newsCategories.find((c) => c.value === article.category)?.label}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(article.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.readTime} phút đọc
              </span>
              <span>Bởi {article.author}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <article className="flex-1 bg-white rounded-xl shadow-sm p-6 md:p-8">
            {/* Excerpt */}
            <p className="text-lg text-[var(--gray-700)] font-medium mb-6 pb-6 border-b border-[var(--gray-100)]">
              {article.excerpt}
            </p>

            {/* Content */}
            <div className="prose prose-gray max-w-none">
              {renderContent(article.content)}
            </div>

            {/* Tags */}
            <div className="mt-8 pt-6 border-t border-[var(--gray-100)]">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-[var(--gray-500)]" />
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tin-tuc?search=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 bg-[var(--gray-100)] text-[var(--gray-700)] text-sm rounded-full hover:bg-[var(--primary)] hover:text-white transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="mt-6 pt-6 border-t border-[var(--gray-100)]">
              <div className="flex items-center gap-4">
                <span className="text-[var(--gray-700)] font-medium">Chia sẻ:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    title="Chia sẻ lên Facebook"
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    title="Chia sẻ bài viết"
                    className="p-2 bg-[var(--gray-200)] text-[var(--gray-700)] rounded-full hover:bg-[var(--gray-300)] transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[var(--primary)] rounded-full" />
              Bài viết liên quan
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/tin-tuc/${related.slug}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
                >
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={related.thumbnail}
                      alt={related.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[var(--gray-900)] group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-[var(--gray-500)]">
                      <Calendar className="w-3 h-3" />
                      {new Date(related.publishedAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to news */}
        <div className="text-center mt-8">
          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-[var(--primary)] text-[var(--primary)] font-semibold rounded-xl hover:bg-[var(--primary)] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Xem tất cả tin tức
          </Link>
        </div>
      </div>
    </div>
  );
}
