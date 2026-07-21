import "./globals.css";
import { Montserrat } from "next/font/google";
import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/Footer";
import FloatingButton from "../components/common/FloatingButton";
import { Toaster } from "react-hot-toast";
import api from "../lib/api/axios";
import { GoogleTagManager } from "@next/third-parties/google";
import { GoogleAnalytics } from "@next/third-parties/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  verification: {
    google: "jn0CklXpu_AaWbnMxezEgzKzUVV59B4fl955GETW2GU",
  },
};

export default async function RootLayout({ children }) {
  let footerContent = "";
  let footerIcons = [];

  try {
    const res = await api.get("/web/footer", { cache: "no-store", next: { revalidate: 600 } });
    if (res.data.status === "success") {
      footerContent = res.data.data.content || "";
      footerIcons = res.data.data.icons || [];
    }
  } catch (error) {
    console.error("Failed to fetch footer data", error);
  }

  return (
    <html lang="en">
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
      <body className={`${montserrat.variable} font-montserrat min-h-screen flex flex-col antialiased`}>
        <Header />
        <main className="flex-grow mt-[var(--header-y)]">{children}</main>
        <Footer content={footerContent} icons={footerIcons} />
        {/* <FloatingButton /> */}
        <Toaster position="top-right" />

        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      </body>
      <GoogleAnalytics gaId={process.env.GA_TRACKING_ID} />
    </html>
  );
}
