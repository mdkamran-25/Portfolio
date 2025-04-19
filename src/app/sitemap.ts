import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kamran.vercel.app';
  
  // Define your routes
  const routes = [
    '',
    '/about',
    '/projects',
    '/contact',
    '/privacy-policy',
    '/terms-conditions',
    '/cancellation-and-refund',
    '/shipping-and-delivery',
  ];

  // Generate sitemap entries
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));
} 