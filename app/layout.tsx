import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { AppKit } from '@/context/appkit';
import { Toaster } from "sonner";
import { Cursor } from "@/components/ui/cursor";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import { WalletProviderWrapper } from "@/components/WalletProviderWrapper";
import ProtectedRoute from "@/components/ProtectedRoute"; // Add this import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ai.luminacasa.ai"),
  title: "LuminaAI",
  description:
    "Your 24/7 concierge for conscious co-living, DAO governance, and soul-aligned wealth. Book regenerative retreats, engage in tokenized living, and help shape decentralized futures with Lumina.",
  icons: {
    icon: [
      // { url: "/CyreneAI_logo_square.png", sizes: "32x32", type: "image/png" },
      // { url: "/CyreneAI_logo_square.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      // { url: "/CyreneAI_logo_square.png", sizes: "180x180", type: "image/png" },
    ],
    // shortcut: [{ url: "/CyreneAI_logo_square.png" }],
  },
  openGraph: {
    title: "LuminaAI",
    description:
      "Your 24/7 concierge for conscious co-living, DAO governance, and soul-aligned wealth. Book regenerative retreats, engage in tokenized living, and help shape decentralized futures with Lumina.",
    url: "https://ai.luminacasa.ai/",
    siteName: "LuminaAI",
    images: [
      // {
      //   url: "/CyreneAI_share.png",
      //   width: 1200,
      //   height: 630,
      //   alt: "Your Guide to Regenerative, Tokenized Co-Living",
      // },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LuminaAI",
    description:
      "Your 24/7 concierge for conscious co-living, DAO governance, and soul-aligned wealth. Book regenerative retreats, engage in tokenized living, and help shape decentralized futures with Lumina.",
    images: [
      // {
      //   url: "/CyreneAI_share.png",
      //   width: 1200,
      //   height: 630,
      //   alt: "Your Guide to Regenerative, Tokenized Co-Living",
      // },
    ],
    // site: "https://x.com/CyreneAI",
  },
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookies = (await headers()).get('cookie');

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-[#030014] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] cursor-none`}>
        <div className="absolute inset-0"></div>
        <div className="relative z-10">
          <WalletProviderWrapper>
            <AppKit>
              <Cursor />
              <Navbar />
              <main className="flex-grow min-h-[calc(100vh-200px)]">
                {/* Wrap children with ProtectedRoute */}
               
                  {children}
               
              </main>
              <Toaster richColors />
              <Footer />
            </AppKit>
          </WalletProviderWrapper>
        </div>
      </body>
    </html>
  );
}