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

export const metadata: Metadata = {
  title: "Hùng Thanh - Máy Lạnh Chính Hãng Giá Tốt Nhất",
  description:
    "Hùng Thanh - Chuyên bán máy lạnh Inverter chính hãng Daikin, Panasonic, LG, Samsung, Toshiba. Giá tốt nhất, trả góp 0%, bảo hành uy tín, lắp đặt tận nơi.",
  keywords: [
    "máy lạnh",
    "điều hòa",
    "máy lạnh inverter",
    "máy lạnh giá rẻ",
    "máy lạnh daikin",
    "máy lạnh panasonic",
    "máy lạnh lg",
    "hùng thanh",
  ],
  icons: {
    icon: "/images/logos/logo.png",
    apple: "/images/logos/logo.png",
  },
  openGraph: {
    title: "Hùng Thanh - Máy Lạnh Chính Hãng Giá Tốt Nhất",
    description:
      "Chuyên bán máy lạnh Inverter chính hãng. Giá tốt nhất, trả góp 0%.",
    type: "website",
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
