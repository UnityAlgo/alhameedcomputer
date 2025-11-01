import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://alhameedcomputers.com'

  
  const products = await fetch("https://admin.alhameedcomputers.com/api/products").then(res => res.json())
  const categories = await fetch("https://admin.alhameedcomputers.com/api/categories").then(res => res.json())

  return [
    {
      url: "https://alhameedcomputers.com",
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
   {
      url: `https://alhameedcomputers.com/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `https://alhameedcomputers.com/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `https://alhameedcomputers.com/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },


    ...products.map((p: any) => ({
      url: `https://alhameedcomputers.com/products/${p.id}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
    ...categories.map((c: any) => ({
      url: `${baseUrl}/category/${c.id}`,
      lastModified: new Date(c.updated_at),
      changeFrequency: 'weekly',
      priority: 0.7,
    })),
  ]
}
