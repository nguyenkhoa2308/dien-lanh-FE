import type { Metadata } from "next";
import { Suspense } from "react";
import { Be_Vietnam_Pro } from "next/font/google";
import { CartProvider } from "@/contexts/cart-context";
import { CompareProvider } from "@/contexts/compare-context";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CompareFloatingBar from "@/components/compare-floating-bar";
import SplashScreenWrapper from "@/components/splash-screen-wrapper";
import ScrollToTop from "@/components/scroll-to-top";
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
  title: "CoolMart - Máy Lạnh Chính Hãng Giá Tốt Nhất",
  description:
    "CoolMart - Chuyên bán máy lạnh Inverter chính hãng Daikin, Panasonic, LG, Samsung, Toshiba. Giá tốt nhất, trả góp 0%, bảo hành uy tín, lắp đặt tận nơi.",
  keywords: [
    "máy lạnh",
    "điều hòa",
    "máy lạnh inverter",
    "máy lạnh giá rẻ",
    "máy lạnh daikin",
    "máy lạnh panasonic",
    "máy lạnh lg",
    "coolmart",
  ],
  openGraph: {
    title: "CoolMart - Máy Lạnh Chính Hãng Giá Tốt Nhất",
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
        <CartProvider>
          <CompareProvider>
            <ScrollToTop />
            <SplashScreenWrapper />
            <Header />
            {/* <Suspense> */}
            <main>{children}</main>
            {/* </Suspense> */}
            <Footer />
            <CompareFloatingBar />
          </CompareProvider>
        </CartProvider>
      </body>
    </html>
  );
}
