import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://subox.vercel.app'; // Production URL

  try {
    const products = await prisma.product.findMany({ select: { id: true, updatedAt: true } });

    const productUrls = products.map((product: any) => ({
      url: `${baseUrl}/product/${product.id}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [
      { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
      { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
      { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
      ...productUrls,
    ];
  } catch (error) {
    // Return minimal sitemap during build if DB is unavailable
    return [
      { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
      { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
      { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 }
    ];
  }
}
