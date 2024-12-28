import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

const basePathnames = {
  '/matches': { en: '/matches', fr: '/matchs', de: '/spiele', es: '/partidos', it: '/partite', pt: '/partidas' },
  '/group': { en: '/group', fr: '/groupes', de: '/gruppen', es: '/grupos', it: '/gironi', pt: '/grupos' },
  '/knockout': { en: '/knockout', fr: '/elimination', de: '/finalrunde', es: '/eliminatoria', it: '/eliminazione', pt: '/eliminar' },
  '/custom': { en: '/custom', fr: '/personnalise', de: '/angepasstes', es: '/personalizado', it: '/personalizzata', pt: '/personalizada' },
  '/about': { en: '/about', fr: '/a-propos', de: '/ueber', es: '/acerca', it: '/informazioni', pt: '/sobre' },
  '/not-found': { en: '/not-found', fr: '/non-trouve', de: '/nicht-gefunden', es: '/no-encontrado', it: '/non-trovato', pt: '/nao-encontrado' }
};

const addPrefixes = (prefix: string) => {
  const pathnamesWithYear: Record<string, any> = { [`/${prefix}`]: `/${prefix}` };
  for (const [key, value] of Object.entries(basePathnames)) {
    const newValue = Object.fromEntries(
      Object.entries(value).map(([locale, path]) => [locale, `/${prefix}${path}`])
    );
    pathnamesWithYear[`/${prefix}${key}`] = newValue;
  }
  return pathnamesWithYear;
};

export const routing = defineRouting({
  locales: ['en', 'fr', 'de', 'es', 'it', 'pt'],
  defaultLocale: 'en',
  pathnames: addPrefixes('[year]')
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const { Link, getPathname, redirect, usePathname, useRouter } = createNavigation(routing);