import { Suspense } from "react";
import HotProducts from "@/components/hot-products";
import AdBannersWrapper from "@/components/ad-banners-wrapper";
import ProductList from "@/components/product-list";
import ProductCardSkeleton from "@/components/product-card-skeleton";
import ArticleSection from "@/components/article-section";
import { getFeaturedProducts, getProducts } from "@/lib/api";

// Revalidate data every 60 seconds - prevents loading on client navigation
export const revalidate = 60;

export default async function Home() {
  // Fetch all data server-side to prevent layout shift
  const [featuredProducts, productsResponse] = await Promise.all([
    getFeaturedProducts(20),
    getProducts(1, 100),
  ]);

  return (
    <>
      <HotProducts products={featuredProducts} />
      <AdBannersWrapper />
      <Suspense
        fallback={
          <section id="products" className="py-8">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <ProductCardSkeleton key={`skeleton-${i}`} />
                ))}
              </div>
            </div>
          </section>
        }
      >
        <ProductList initialProducts={productsResponse.data} />
      </Suspense>
      <ArticleSection />
    </>
  );
}
