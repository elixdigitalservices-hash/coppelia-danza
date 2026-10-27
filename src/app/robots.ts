import type { MetadataRoute } from "next";
import { isFinalDomain, siteUrl } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: isFinalDomain ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
