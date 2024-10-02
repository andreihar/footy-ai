import { createLocalizedPathnamesNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr', 'de', 'es', 'it', 'pt'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/about': { en: '/about', fr: '/a-propos', de: '/ueber', es: '/acerca', it: '/informazioni', pt: '/sobre' },
    '/not-found': { en: '/not-found', fr: '/non-trouve', de: '/nicht-gefunden', es: '/no-encontrado', it: '/non-trovato', pt: '/nao-encontrado' }
  }
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const { Link, getPathname, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation(routing);