import type { MetadataRoute } from 'next';
import { host } from '@/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '*',
      disallow: ['/not-found'],
    },
    sitemap: `${host}/sitemap.xml`,
  };
}
