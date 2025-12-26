import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { CartProvider } from "@/contexts/cart-context";
import { CompareProvider } from "@/contexts/compare-context";
import { SplashProvider } from "@/contexts/splash-context";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CompareFloatingBar from "@/components/product/CompareFloatingBar";
import FloatingActionButton from "@/components/common/FloatingActionButton";
import SplashScreenWrapper from "@/components/layout/SplashScreenWrapper";
import PageContent from "@/components/layout/PageContent";
import ScrollToTop from "@/components/common/ScrollToTop";
import JsonLd from "@/components/seo/JsonLd";
import "./globals.css";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dienlanhhungthanh.com/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hùng Thành - Máy Lạnh Chính Hãng Giá Tốt Nhất Bắc Ninh",
    template: "%s | Hùng Thành",
  },
  description:
    "Hùng Thành - Chuyên bán máy lạnh Inverter chính hãng Daikin, Panasonic, LG, Samsung, Toshiba tại Bắc Ninh. Giá tốt nhất, trả góp 0%, bảo hành uy tín, lắp đặt miễn phí.",
  keywords: [
    "máy lạnh",
    "điều hòa",
    "máy lạnh inverter",
    "máy lạnh giá rẻ",
    "máy lạnh daikin",
    "máy lạnh panasonic",
    "máy lạnh lg",
    "máy lạnh samsung",
    "máy lạnh toshiba",
    "máy lạnh bắc ninh",
    "điều hòa bắc ninh",
    "hùng thành",
    "hùng thành bắc ninh",
  ],
  authors: [{ name: "Hùng Thành" }],
  creator: "Hùng Thành",
  publisher: "Hùng Thành",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/images/logos/logo.png",
    apple: "/images/logos/logo.png",
  },
  openGraph: {
    title: "Hùng Thành - Máy Lạnh Chính Hãng Giá Tốt Nhất Bắc Ninh",
    description:
      "Chuyên bán máy lạnh Inverter chính hãng Daikin, Panasonic, LG, Samsung. Giá tốt nhất, trả góp 0%, lắp đặt miễn phí tại Bắc Ninh.",
    url: siteUrl,
    siteName: "Hùng Thành",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/images/logos/logo.png",
        width: 1200,
        height: 630,
        alt: "Hùng Thành - Máy Lạnh Chính Hãng",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hùng Thành - Máy Lạnh Chính Hãng",
    description:
      "Chuyên bán máy lạnh Inverter chính hãng. Giá tốt nhất Bắc Ninh.",
    images: ["/images/logos/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add Google Search Console verification when available
    // google: "your-google-verification-code",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="font-sans antialiased bg-[#f2f4f7]">
        <JsonLd />
        <SplashProvider>
          <CartProvider>
            <CompareProvider>
              <SplashScreenWrapper />
              <PageContent>
                <ScrollToTop />
                <Header />
                <main>{children}</main>
                <Footer />
                <CompareFloatingBar />
                <FloatingActionButton />
              </PageContent>
            </CompareProvider>
          </CartProvider>
        </SplashProvider>
      </body>
    </html>
  );
}
