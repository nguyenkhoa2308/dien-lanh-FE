import Script from "next/script";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dienlanhhungthanh.com/";

// Organization + LocalBusiness schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteUrl}/#organization`,
  name: "Hùng Thành",
  alternateName: "Hùng Thành Air Conditioning",
  description:
    "Chuyên bán máy lạnh Inverter chính hãng Daikin, Panasonic, LG, Samsung, Toshiba tại Bắc Ninh",
  url: siteUrl,
  logo: `${siteUrl}/images/logos/logo.png`,
  image: `${siteUrl}/images/logos/logo.png`,
  telephone: "+84-123-456-789",
  email: "contact@hungthanhair.vn",
  address: {
    "@type": "PostalAddress",
    streetAddress: "29 Hoàng Hoa Thám",
    addressLocality: "Võ Cường",
    addressRegion: "Bắc Ninh",
    addressCountry: "VN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 21.1785,
    longitude: 106.0763,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "08:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "08:00",
      closes: "12:00",
    },
  ],
  priceRange: "$$",
  sameAs: ["https://facebook.com/hungthanhair", "https://zalo.me/hungthanhair"],
};

// Website schema
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "Hùng Thành",
  description: "Máy lạnh chính hãng giá tốt nhất Bắc Ninh",
  publisher: {
    "@id": `${siteUrl}/#organization`,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  inLanguage: "vi-VN",
};

export default function JsonLd() {
  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
        strategy="afterInteractive"
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
        strategy="afterInteractive"
      />
    </>
  );
}

// Product schema generator for product pages
export function generateProductSchema(product: {
  name: string;
  description: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  brand: string;
  sku?: string;
  inStock?: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku || product.slug,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/san-pham/${product.slug}`,
      priceCurrency: "VND",
      price: product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      availability:
        product.inStock !== false
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Hùng Thành",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "156",
    },
  };
}
