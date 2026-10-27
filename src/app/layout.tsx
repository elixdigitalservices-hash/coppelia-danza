import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Gochi_Hand, Instrument_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { Cursor } from "@/components/fx/cursor";
import { PageCurtain } from "@/components/fx/page-curtain";
import { SmoothScroll } from "@/components/smooth-scroll";
import { isFinalDomain, photos, siteUrl, studio } from "@/data/site";
import "./globals.css";

const bodoni = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz"], variable: "--font-bodoni" });
const instrumentSans = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument-sans" });
const gochi = Gochi_Hand({ subsets: ["latin"], weight: "400", variable: "--font-gochi" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Studio de Danza Coppelia | Escuela de ballet en Tomares desde 1986",
    template: "%s | Studio de Danza Coppelia",
  },
  description:
    "Escuela de danza en Tomares (Sevilla) desde 1986. Pre-Ballet desde 3 años, ballet clásico, danza contemporánea, Ballet Fitness y Pilates aplicado a la danza. Primera clase y matrícula gratis.",
  robots: isFinalDomain ? undefined : { index: false, follow: false },
  openGraph: {
    title: "Studio de Danza Coppelia",
    description: "40 años enseñando a bailar en Tomares. Tu primera clase es gratis.",
    images: ["/media/og.jpg"],
    locale: "es_ES",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

// Antes del primer pintado: la intro suena en cada carga o recarga de la home (?nointro la salta; no con movimiento reducido).
// Los cambios de página internos no la repiten: usan el telón.
const introScript = `(function(){var d=document.documentElement;try{if(location.pathname==='/'&&!/[?&]nointro(=|&|$)/.test(location.search)&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('intro');window.__cpIntroT=setTimeout(function(){d.classList.remove('intro')},10000)}}catch(e){}})()`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "LocalBusiness"],
  name: studio.name,
  url: siteUrl,
  image: `${siteUrl}${photos.arco.src}`,
  logo: `${siteUrl}/media/logo-coppelia.svg`,
  telephone: "+34617319293",
  email: studio.email,
  foundingDate: String(studio.founded),
  geo: { "@type": "GeoCoordinates", latitude: studio.geo.lat, longitude: studio.geo.lng },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calle Navarro Caro, 81, Local 2 y 3",
    postalCode: studio.postalCode,
    addressLocality: studio.city,
    addressRegion: studio.region,
    addressCountry: "ES",
  },
  sameAs: [studio.instagram],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es" className={`${bodoni.variable} ${instrumentSans.variable} ${gochi.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SmoothScroll />
        {children}
        <PageCurtain />
        <Cursor />
      </body>
    </html>
  );
}
