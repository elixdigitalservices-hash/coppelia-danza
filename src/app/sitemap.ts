import type { MetadataRoute } from "next";
import { posts } from "@/data/blog";
import { siteUrl } from "@/data/site";

const routes = ["", "/clases", "/escuela", "/alumnos", "/blog", "/contacto"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...routes.map((route) => ({
      url: `${siteUrl}${route}`,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...posts.map((post) => ({ url: `${siteUrl}/blog/${post.slug}`, lastModified: post.date, changeFrequency: "yearly" as const, priority: 0.4 })),
  ];
}
