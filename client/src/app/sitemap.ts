import type { MetadataRoute } from 'next';
import { host } from '@/config';
import { Locale, getPathname, routing, Pathnames } from '@/i18n/routing';
import { years } from '@/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = [];
  const locales = routing.locales.filter(locale => locale === 'en');

  const pathConfigs: { pathname: Pathnames; changeFrequency: ChangeFrequency; priority: number; }[] = [
    { pathname: '/[year]', changeFrequency: 'daily', priority: 1 },
    { pathname: '/[year]/matches', changeFrequency: 'daily', priority: 0.8 },
    { pathname: '/[year]/group', changeFrequency: 'daily', priority: 0.8 },
    { pathname: '/[year]/knockout', changeFrequency: 'daily', priority: 0.8 },
    { pathname: '/[year]/custom', changeFrequency: 'yearly', priority: 0.5 },
    { pathname: '/[year]/about', changeFrequency: 'yearly', priority: 0.5 }
  ];

  for (const locale of locales) {
    for (const year of years) {
      for (const { pathname, changeFrequency, priority } of pathConfigs) {
        entries.push(createEntry({ pathname, params: { year } }, changeFrequency, priority, locale));
      }
    }
  }

  return entries;
}

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

type Href = {
  pathname: Pathnames;
  params: { year: number; };
  query?: Record<string, string>;
};

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
