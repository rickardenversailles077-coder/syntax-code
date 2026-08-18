import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://syntax-code-pi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Syntax Code — Create Beautiful Code Snippets in Seconds",
    template: "%s | Syntax Code",
  },
  description:
    "Free tool to transform your source code into stunning, high-resolution HD images. Customize themes, backgrounds, and export perfect code screenshots for Twitter/X, blogs, and docs.",
  keywords: [
    "code snippet generator",
    "code to image",
    "carbon alternative",
    "code screenshot HD",
    "beautify code snippet",
    "code share twitter",
    "syntax highlighter image",
    "developer tools",
  ],
  authors: [{ name: "Syntax Code Team", url: siteUrl }],
  creator: "@ricka_dev",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Syntax Code — Create Beautiful Code Snippets in Seconds",
    description:
      "Transform your source code into stunning high-resolution images for social media, blogs, and documentation.",
    url: siteUrl,
    siteName: "Syntax Code",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Syntax Code - Beautiful Code Snippets Generator Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Syntax Code — Create Beautiful Code Snippets in Seconds",
    description:
      "Convert source code into high-res images for Twitter, blogs, and docs.",
    creator: "@ricka_dev",
    images: ["/og-image.png"],
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
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Syntax Code",
  url: siteUrl,
  description:
    "Transform your source code into stunning high-resolution images for blogs, social media, and documentation.",
  operatingSystem: "All",
  applicationCategory: "DeveloperApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}