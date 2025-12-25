import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductGallery from '@/components/product/ProductGallery';
import ProductDetailTabs from '@/components/product/ProductDetailTabs';
import RelatedProductsSwiper from '@/components/product/RelatedProductsSwiper';
import PowerSelector from '@/components/common/PowerSelector';
import AddToCartSection from '@/components/product/AddToCartSection';
import { brands, Product } from '@/data/products';
import { formatNumber, formatPrice } from '@/lib/utils';
import { getProductBySlug, getProducts, Product as APIProduct } from '@/lib/api';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

// Adapter to convert API Product to page Product format
function adaptAPIProduct(apiProduct: APIProduct): Product {
  const defaultVariant = apiProduct.variants.find(v => v.isDefault) || apiProduct.variants[0];
  const primaryMedia = apiProduct.media.find(m => m.isPrimary) || apiProduct.media[0];

  return {
    id: apiProduct.id,
    slug: apiProduct.slug,
    name: apiProduct.name,
    brand: apiProduct.brand.slug,
    price: parseFloat(defaultVariant?.price || apiProduct.basePrice),
    originalPrice: defaultVariant?.compareAtPrice ? parseFloat(defaultVariant.compareAtPrice) : undefined,
    image: primaryMedia?.url || '/placeholder.jpg',
    power: '1.5', // Default, will be extracted from name if possible
    powerBTU: 12000, // Default
    type: 'inverter', // Default
    cooling: 'one-way', // Default
    features: ['inverter', 'fast-cooling', 'air-filter'],
    rating: 0,
    ratingCount: 0,
    isNew: false,
    isHot: apiProduct.isFeatured,
  };
}

const featureDetails: Record<string, { label: string; description: string }> = {
  inverter: {
    label: 'Inverter tiết kiệm điện',
    description: 'Giữ nhiệt độ ổn định, giảm tiêu thụ điện năng đáng kể.',
  },
  'fast-cooling': {
    label: 'Làm lạnh nhanh',
    description: 'Tăng tốc độ làm lạnh ngay khi khởi động máy.',
  },
  'air-filter': {
    label: 'Lọc bụi mịn',
    description: 'Giảm bụi bẩn và mùi khó chịu trong phòng.',
  },
  antibacterial: {
    label: 'Kháng khuẩn',
    description: 'Hạn chế vi khuẩn, bảo vệ sức khỏe gia đình.',
  },
  'self-clean': {
    label: 'Tự làm sạch dàn lạnh',
    description: 'Hong khô chống ẩm mốc, giữ dàn lạnh sạch sẽ.',
  },
  wifi: {
    label: 'Điều khiển WiFi',
    description: 'Quản lý từ xa qua điện thoại thông minh.',
  },
};

function toTitleCase(value: string): string {
  return value
    .split(' ')
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ');
}

function getFeatureInfo(feature: string): { label: string; description: string } {
  if (featureDetails[feature]) {
    return featureDetails[feature];
  }

  return {
    label: toTitleCase(feature.replace(/-/g, ' ')),
    description: 'Tối ưu hiệu suất làm lạnh và tiết kiệm điện.',
  };
}

function getRoomSizeLabel(product: Product): string {
  if (product.powerBTU <= 9000) return '< 15m2';
  if (product.powerBTU <= 12000) return '15-20m2';
  if (product.powerBTU <= 18000) return '20-30m2';
  return '> 30m2';
}

function getTypeLabel(product: Product): string {
  return product.type === 'inverter' ? 'Inverter' : 'Tiêu chuẩn';
}

function getCoolingLabel(product: Product): string {
  return product.cooling === 'two-way' ? '2 chiều' : '1 chiều';
}

async function getSimilarPowerVariants(productId: string, currentProduct: Product): Promise<Product[]> {
  try {
    // Extract base name without power specification (e.g., "Daikin 1.5 HP" -> "Daikin")
    const baseName = currentProduct.name.replace(/\d+\.?\d*\s*HP/i, '').trim();

    // Fetch products from same brand
    const response = await getProducts(1, 50);
    const allProducts = response.data.map(adaptAPIProduct);

    return allProducts.filter((p) => {
      const pBaseName = p.name.replace(/\d+\.?\d*\s*HP/i, '').trim();
      // Match same base name but different product (different power)
      return p.id !== productId && pBaseName === baseName && p.brand === currentProduct.brand;
    });
  } catch (error) {
    console.error('Error fetching similar power variants:', error);
    return [];
  }
}

async function getRelatedProducts(productId: string, currentProduct: Product): Promise<APIProduct[]> {
  try {
    const response = await getProducts(1, 50);
    const allProducts = response.data;

    // Get products from same brand
    const sameBrand = allProducts.filter(
      (item) => item.id !== productId && item.brand.slug === currentProduct.brand
    );

    // Get products with same power but different brand (approximate by name since API doesn't have power field)
    const samePowerRegex = new RegExp(`${currentProduct.power}\\s*HP`, 'i');
    const samePower = allProducts.filter(
      (item) =>
        item.id !== productId &&
        item.brand.slug !== currentProduct.brand &&
        samePowerRegex.test(item.name)
    );

    // Combine and remove duplicates
    const combined = [...sameBrand, ...samePower];
    const unique = combined.filter(
      (item, index) => combined.findIndex((entry) => entry.id === item.id) === index
    );

    if (unique.length >= 4) {
      return unique.slice(0, 4);
    }

    // If not enough, add other products as fallback
    const fallback = allProducts.filter(
      (item) => item.id !== productId && !unique.some((entry) => entry.id === item.id)
    );

    return [...unique, ...fallback].slice(0, 4);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

export async function generateStaticParams() {
  try {
    const response = await getProducts(1, 100); // Get up to 100 products for static generation
    return response.data.map((product) => ({ slug: product.slug }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const apiProduct = await getProductBySlug(slug);

  if (!apiProduct) {
    return {
      title: 'Sản phẩm không tồn tại | Hùng Thanh',
      description: 'Sản phẩm bạn tìm kiếm không có trong hệ thống.',
    };
  }

  const product = adaptAPIProduct(apiProduct);

  return {
    title: `${product.name} | Hùng Thanh`,
    description: `${product.name} công suất ${product.power} HP (${formatNumber(
      product.powerBTU
    )} BTU), ${getTypeLabel(product)} ${getCoolingLabel(product)}.`,
    openGraph: {
      title: `${product.name} | Hùng Thanh`,
      description: `${product.name} chính hãng, giao nhanh, bảo hành 24 tháng.`,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const apiProduct = await getProductBySlug(slug);

  if (!apiProduct) {
    notFound();
  }

  const product = adaptAPIProduct(apiProduct);

  if (!product) {
    notFound();
  }

  const brandLabel =
    brands.find((brand) => brand.value === product.brand)?.label ||
    product.brand.toUpperCase();
  const roomSize = getRoomSizeLabel(product);
  const typeLabel = getTypeLabel(product);
  const coolingLabel = getCoolingLabel(product);
  const discountPercent =
    product.discount ||
    (product.originalPrice
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0);
  const sku = `AC-${product.id.padStart(4, '0')}`;
  const rating = product.rating || 0;
  const ratingCount = product.ratingCount || 0;
  const featureList = product.features.map(getFeatureInfo).slice(0, 6);
  const relatedProducts = await getRelatedProducts(product.id, product);
  const similarPowerVariants = await getSimilarPowerVariants(product.id, product);

  // Use all media from API product instead of duplicating primary image
  const galleryImages = apiProduct.media && apiProduct.media.length > 0
    ? apiProduct.media.map((media, index) => ({
        src: media.url,
        alt: media.altText || `${product.name} - Hình ${index + 1}`,
      }))
    : [{ src: product.image, alt: product.name }];

  return (
    <div className="pb-20">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="flex flex-wrap items-center gap-2 text-sm">
              <Link
                href="/"
                className="text-gray-500 hover:text-[var(--primary)] transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Trang chủ
              </Link>
              <span className="text-gray-300">/</span>
              <Link href="/#products" className="text-gray-500 hover:text-[var(--primary)] transition-colors">
                Sản phẩm
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium line-clamp-1">{brandLabel}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Main Product Section */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery */}
            <div className="space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {discountPercent > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold rounded-lg shadow-lg">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    Giảm {discountPercent}%
                  </span>
                )}
                {product.isNew && (
                  <span className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-bold rounded-lg shadow-lg">
                    MỚI
                  </span>
                )}
                {product.isHot && (
                  <span className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold rounded-lg shadow-lg animate-pulse">
                    🔥 HOT
                  </span>
                )}
              </div>

              <ProductGallery images={galleryImages} productName={product.name} />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Power Selector */}
              {similarPowerVariants.length > 0 && (
                <PowerSelector
                  currentProduct={product}
                  similarProducts={similarPowerVariants}
                />
              )}

              {/* Title & Rating */}
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
                  {rating > 0 ? (
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, index) => (
                          <svg
                            key={index}
                            className={`w-4 h-4 ${
                              index < Math.round(rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-700">
                        {rating.toFixed(1)}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">
                        ({formatNumber(ratingCount)})
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs sm:text-sm text-gray-500">Chưa có đánh giá</span>
                  )}

                  <span className="hidden sm:block h-4 w-px bg-gray-300"></span>

                  <span className="text-xs sm:text-sm text-gray-600">
                    <span className="font-mono font-semibold">{sku}</span>
                  </span>

                  <span className="hidden sm:block h-4 w-px bg-gray-300"></span>

                  <span className="text-xs sm:text-sm font-semibold text-[var(--primary)]">
                    {brandLabel}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl sm:rounded-2xl border-2 border-red-200 shadow-lg">
                <div className="flex flex-wrap items-end gap-2 sm:gap-3">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-red-600">
                    {formatPrice(product.price)}
                  </div>
                  {product.originalPrice && (
                    <div className="flex flex-col">
                      <span className="text-sm sm:text-base text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-red-600">
                        Tiết kiệm {formatPrice(product.originalPrice - product.price)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                  <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-white rounded-full text-xs sm:text-sm font-medium text-gray-700 shadow-sm">
                    <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Trả góp 0%
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-white rounded-full text-xs sm:text-sm font-medium text-gray-700 shadow-sm">
                    <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                    </svg>
                    <span className="hidden sm:inline">Miễn phí vận chuyển</span>
                    <span className="sm:hidden">Free ship</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-white rounded-full text-xs sm:text-sm font-medium text-gray-700 shadow-sm">
                    <svg className="w-3.5 h-3.5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Chính hãng
                  </span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-[var(--primary)] transition-colors shadow-sm">
                  <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Công suất</div>
                  <div className="text-sm sm:text-base font-bold text-gray-900">
                    {product.power} HP
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-600">{formatNumber(product.powerBTU)} BTU</div>
                </div>
                <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-[var(--primary)] transition-colors shadow-sm">
                  <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Diện tích</div>
                  <div className="text-sm sm:text-base font-bold text-gray-900">{roomSize}</div>
                  <div className="text-[10px] sm:text-xs text-gray-600">Phòng phù hợp</div>
                </div>
                <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-[var(--primary)] transition-colors shadow-sm">
                  <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Công nghệ</div>
                  <div className="text-sm sm:text-base font-bold text-gray-900">{typeLabel}</div>
                  <div className="text-[10px] sm:text-xs text-gray-600">Tiết kiệm điện</div>
                </div>
                <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-[var(--primary)] transition-colors shadow-sm">
                  <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Chế độ</div>
                  <div className="text-sm sm:text-base font-bold text-gray-900">{coolingLabel}</div>
                  <div className="text-[10px] sm:text-xs text-gray-600">Làm lạnh</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <AddToCartSection
                productId={product.id}
                productName={product.name}
                productSlug={product.slug}
                price={product.price}
                image={product.image}
              />

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg sm:rounded-xl">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-[var(--primary)]">24h</div>
                  <div className="text-[10px] sm:text-xs text-gray-600">Lắp đặt</div>
                </div>
                <div className="text-center border-x border-gray-200">
                  <div className="text-lg sm:text-2xl font-bold text-[var(--success)]">24th</div>
                  <div className="text-[10px] sm:text-xs text-gray-600">Bảo hành</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-[var(--accent)]">24/7</div>
                  <div className="text-[10px] sm:text-xs text-gray-600">Hỗ trợ</div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description & Reviews Tabs */}
          <div className="mt-8 sm:mt-12">
            <ProductDetailTabs
              productName={product.name}
              typeLabel={typeLabel}
              roomSize={roomSize}
              brandLabel={brandLabel}
              featureList={featureList}
              ratingCount={ratingCount}
              description={apiProduct.description}
              attributes={apiProduct.attributes}
            />
          </div>

          {/* Policies Section */}
          <div className="mt-6 sm:mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {/* Warranty */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl border border-green-200">
              <div className="flex items-center gap-2 sm:gap-3 mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">Bảo hành 24 tháng</h3>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700">
                <li className="flex gap-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Bảo hành chính hãng toàn quốc
                </li>
                <li className="flex gap-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Đổi mới trong 7 ngày nếu có lỗi
                </li>
                <li className="flex gap-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Sửa chữa miễn phí linh kiện
                </li>
              </ul>
            </div>

            {/* Installation */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg sm:rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 sm:gap-3 mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">Lắp đặt nhanh</h3>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700">
                <li className="flex gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Miễn phí lắp đặt nội thành
                </li>
                <li className="flex gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Kỹ thuật viên chuyên nghiệp
                </li>
                <li className="flex gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Hẹn lịch linh hoạt trong ngày
                </li>
              </ul>
            </div>

            {/* Shipping */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl border border-purple-200 sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">Giao hàng toàn quốc</h3>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700">
                <li className="flex gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Giao hàng trong 2-4 giờ nội thành
                </li>
                <li className="flex gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Kiểm tra hàng trước khi nhận
                </li>
                <li className="flex gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Đóng gói cẩn thận, chuyên nghiệp
                </li>
              </ul>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-8 sm:mt-12">
              <RelatedProductsSwiper products={relatedProducts} />
            </div>
          )}
        </div>
      </div>
  );
}
