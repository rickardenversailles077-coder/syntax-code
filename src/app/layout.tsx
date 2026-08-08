import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://syntax-code-pi.vercel.app"),
  title: "Syntax Code — Beautiful Code Snippets Generator",
  description:
    "Transform your source code into stunning high-resolution images for blogs, social media, and documentation.",
  keywords: [
    "code snippet generator",
    "code to image",
    "carbon alternative",
    "code screenshot",
    "developer tools",
  ],
  authors: [{ name: "Syntax Code Team" }],
  openGraph: {
    title: "Syntax Code — Beautiful Code Snippets Generator",
    description:
      "Transform your source code into stunning high-resolution images for blogs, social media, and documentation.",
    url: "https://syntax-code-pi.vercel.app",
    siteName: "Syntax Code",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Syntax Code Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Syntax Code — Beautiful Code Snippets Generator",
    description:
      "Transform your source code into stunning high-resolution images for blogs, social media, and documentation.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Syntax Code",
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