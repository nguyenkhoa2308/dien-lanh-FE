const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description?: string;
  basePrice: string;
  isFeatured: boolean;
  brand: {
    id: string;
    name: string;
    slug: string;
    country: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  variants: Array<{
    id: string;
    name: string;
    price: string;
    compareAtPrice: string | null;
    stockQuantity: number;
    isDefault: boolean;
  }>;
  media: Array<{
    id: string;
    type: string;
    url: string;
    altText: string;
    isPrimary: boolean;
  }>;
  attributes?: Array<{
    id: string;
    attribute: {
      id: string;
      name: string;
      displayGroup?: string;
      displayOrder?: number;
    };
    value: string;
  }>;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductDetailResponse {
  success: boolean;
  data: Product;
}

/**
 * Fetch all products with pagination
 */
export async function getProducts(
  page: number = 1,
  limit: number = 10
): Promise<ProductsResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products?page=${page}&limit=${limit}`,
      {
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return empty data during build or when API is unavailable
    return {
      success: false,
      data: [],
      meta: { page: 1, limit, total: 0, totalPages: 0 },
    };
  }
}

/**
 * Fetch featured products for home page
 */
export async function getFeaturedProducts(
  limit: number = 8
): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products?limit=${limit}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProductsResponse = await response.json();
    return data.data.filter((p) => p.isFeatured);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    // Return empty array during build or when API is unavailable
    return [];
  }
}

/**
 * Fetch a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/slug/${slug}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProductDetailResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    // Return null when API is unavailable
    return null;
  }
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(
  price: string,
  compareAtPrice: string | null
): number {
  if (!compareAtPrice) return 0;

  const priceNum = parseFloat(price);
  const compareNum = parseFloat(compareAtPrice);

  if (compareNum === 0) return 0;

  return Math.round(((compareNum - priceNum) / compareNum) * 100);
}

/**
 * Format price to VND currency
 */
export function formatPrice(price: string | number): string {
  const priceNum = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(priceNum);
}

/**
 * Search products by query
 */
export async function searchProducts(
  query: string,
  limit: number = 10
): Promise<Product[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products?search=${encodeURIComponent(
        query
      )}&limit=${limit}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProductsResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}
