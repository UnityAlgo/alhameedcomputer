import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://alhameedcomputers.com'

  try {
    const products = await fetch("https://admin.alhameedcomputers.com/api/products", {
      next: { revalidate: 3600 } // Cache for 1 hour
    }).then(res => res.json())

    const getValidDate = (dateString: any): Date => {
      if (!dateString) return new Date()
      const date = new Date(dateString)
      return isNaN(date.getTime()) ? new Date() : date
    }

    return [
      {
        url: `${baseUrl}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/products`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/privacy-policy`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      // {
      //   url: `${baseUrl}/terms-and-conditions`,
      //   lastModified: new Date(),
      //   changeFrequency: 'monthly',
      //   priority: 0.5,
      // },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/login`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.4,
      },
      {
        url: `${baseUrl}/register`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.4,
      },

      ...products.map((product: any) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: getValidDate(product.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ]
  }
}