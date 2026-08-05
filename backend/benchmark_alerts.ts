import { parseAlerts } from './src/alerts';

const xml = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${Array.from({ length: 10000 }).map((_, i) => `
  <url>
    <loc>https://myrapid.com.my/info-penutupan-jalan-laluan-${i}/</loc>
    <lastmod>2023-10-27T10:00:00Z</lastmod>
  </url>`).join('')}
</urlset>
`;

// warm up
for (let i = 0; i < 5; i++) {
  parseAlerts(xml);
}

const start = performance.now();
for (let i = 0; i < 10; i++) {
  parseAlerts(xml);
}
const end = performance.now();
console.log(`Parsed 10 iterations in ${end - start} ms`);
