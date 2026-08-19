import type { MetadataRoute } from "next";

const BASE = "https://hojokare.jp";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/checker`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/legal/terms`, changeFrequency: "monthly", priority: 0.2 },
    { url: `${BASE}/legal/privacy`, changeFrequency: "monthly", priority: 0.2 },
    { url: `${BASE}/legal/tokushoho`, changeFrequency: "monthly", priority: 0.2 },
  ];
}
