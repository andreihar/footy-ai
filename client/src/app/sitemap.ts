import type { MetadataRoute } from 'next';
import { host } from '@/config';
import { Locale, getPathname, routing } from '@/i18n/routing';
import { years } from '@/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = [];

  // Filter to include only English locale
  const locales = routing.locales.filter(locale => locale === 'en');

  for (const locale of locales) {
    for (const year of years) {
      entries.push(createEntry({ pathname: '/[year]', params: { year } }, 'daily', 1, locale));
      entries.push(createEntry({ pathname: '/[year]/matches', params: { year } }, 'daily', 0.8, locale));
      entries.push(createEntry({ pathname: '/[year]/group', params: { year } }, 'daily', 0.8, locale));
      entries.push(createEntry({ pathname: '/[year]/knockout', params: { year } }, 'daily', 0.8, locale));
      // entries.push(createEntry({ pathname: '/[year]/custom', params: { year } }, 'yearly', 0.5, locale));
      entries.push(createEntry({ pathname: '/[year]/about', params: { year } }, 'yearly', 0.5, locale));
    }
  }

  return entries;
}

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

type Href =
  | { pathname: '/[year]'; params: { year: number; }; query?: Record<string, string>; }
  | { pathname: '/[year]/matches'; params: { year: number; }; query?: Record<string, string>; }
  | { pathname: '/[year]/group'; params: { year: number; }; query?: Record<string, string>; }
  | { pathname: '/[year]/knockout'; params: { year: number; }; query?: Record<string, string>; }
  | { pathname: '/[year]/custom'; params: { year: number; }; query?: Record<string, string>; }
  | { pathname: '/[year]/about'; params: { year: number; }; query?: Record<string, string>; }
  | { pathname: '/[year]/not-found'; params: { year: number; }; query?: Record<string, string>; };

function createEntry(href: Href, changeFrequency: ChangeFrequency, priority: number, locale: Locale) {
  return {
    url: getUrl(href, locale),
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

function getUrl(href: Href, locale: Locale) {
  const pathname = getPathname({ locale, href });
  return `${host}/${locale}${pathname === '/' ? '' : pathname}`;
}
