import { Suspense } from "react";
import HotProducts from "@/components/product/HotProducts";
import AdBannersWrapper from "@/components/home/AdBannersWrapper";
import ProductList from "@/components/product/ProductList";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import ArticleSection from "@/components/content/ArticleSection";
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
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
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
