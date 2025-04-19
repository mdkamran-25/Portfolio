const fs = require('fs');
const path = require('path');

const baseUrl = 'https://kamran.vercel.app';
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

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map(
      (route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${route === '' ? 1 : 0.8}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

fs.writeFileSync(
  path.join(process.cwd(), 'public', 'sitemap.xml'),
  sitemap,
  'utf8'
);

console.log('Sitemap generated successfully!'); 