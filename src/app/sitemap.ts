import { MetadataRoute } from "next";
import { getProducts } from "@/lib/api";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dienlanhhungthanh.com/";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/gioi-thieu`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/lien-he`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/so-sanh`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const response = await getProducts(1, 100);
    productPages = response.data.map((product) => ({
      url: `${siteUrl}/san-pham/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));
  } catch {
    // If API fails, return only static pages
    console.error("Failed to fetch products for sitemap");
  }

  return [...staticPages, ...productPages];
}
