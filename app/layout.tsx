import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import LoadingProvider from "@/components/LoadingProvider";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/components/providers/QueryProvider";
import { SessionProvider } from "next-auth/react";
import { headers } from "next/headers";
import { auth } from "@/auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const obostar = localFont({
  src: "../public/obostartest-regular.otf",
  variable: "--font-obostar",
});

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: "Nerdwork - Where Passion meets Community",
      template: "%s | Nerdwork",
    },
    description:
      "Nerdwork is the home for fans: a creative entertainment studio & thriving community best known for its annual Comic-Con. We are the intersection of storytelling, tech, culture, and fandom.",
    keywords: [
      "Nerdwork",
      "Comic Convention",
      "Pop Culture",
      "Tech Culture",
      "Creative Community",
      "Storytelling",
      "Creative Content",
      "Digital Art",
      "Comics",
      "Graphic Novels",
    ],
    authors: [{ name: "Nerdwork Team" }],
    creator: "Nerdwork",
    publisher: "Nerdwork",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: "en_NG",
      url: baseUrl,
      siteName: "Nerdwork",
      title: "Nerdwork - Where Passion meets Community",
      description:
        "Nerdwork is the home for fans: a creative entertainment studio & thriving community best known for its annual Comic-Con. We are the intersection of storytelling, tech, culture, and fandom.",
      images: [
        {
          url: "/opengraph-image.png?v=1",
          width: 1200,
          height: 630,
          alt: "Nerdwork",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Nerdwork - Where Passion meets Community",
      description:
        "Nerdwork is the home for fans: a creative entertainment studio & thriving community best known for its annual Comic-Con. We are the intersection of storytelling, tech, culture, and fandom.",
      creator: "Nerdwork",
      images: "/twitter-image.png?v=1",
    },
    icons: {
      icon: [{ url: "/favicon.ico" }],
    },
    applicationName: "Nerdwork",
    category: "Comic Community",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${inter.variable} ${obostar.variable} antialiased`}>
        <SessionProvider session={session}>
          <QueryProvider>
            <LoadingProvider>
              {children}
              <SpeedInsights />
            </LoadingProvider>
          </QueryProvider>
        </SessionProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
