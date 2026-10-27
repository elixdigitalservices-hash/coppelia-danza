import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";

const routes = ["", "/clases", "/escuela", "/contacto"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
