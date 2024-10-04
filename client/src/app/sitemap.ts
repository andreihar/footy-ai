import type { MetadataRoute } from 'next';
import { host } from '@/config';
import { Locale, getPathname, routing } from '@/i18n/routing';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    createEntry('/', 'daily', 1),
    // createEntry('/matches', 'daily', 0.8),
    createEntry('/group', 'daily', 0.8),
    // createEntry('/knockout', 'daily', 0.8),
    // createEntry('/custom', 'yearly', 0.5),
    createEntry('/about', 'yearly', 0.5),
  ];
}

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
type Href = Parameters<typeof getPathname>[0]['href'];

function createEntry(href: Href, changeFrequency: ChangeFrequency, priority: number) {
  return {
    url: getUrl(href, routing.defaultLocale),
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

function getUrl(href: Href, locale: Locale) {
  const pathname = getPathname({ locale, href });
  return `${host}/${locale}${pathname === '/' ? '' : pathname}`;
}
