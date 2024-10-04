import { createLocalizedPathnamesNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr', 'de', 'es', 'it', 'pt'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    // '/matches': { en: '/matches', fr: '/matchs', de: '/spiele', es: '/partidos', it: '/partite', pt: '/partidas' },
    '/group': { en: '/group', fr: '/groupes', de: '/gruppen', es: '/grupos', it: '/gironi', pt: '/grupos' },
    // '/knockout': { en: '/knockout', fr: '/elimination', de: '/ausscheidung', es: '/eliminatoria', it: '/eliminazione', pt: '/eliminar' },
    // '/custom': { en: '/custom', fr: '/personnalise', de: '/angepasstes', es: '/personalizado', it: '/personalizzata', pt: '/personalizada' },
    '/about': { en: '/about', fr: '/a-propos', de: '/ueber', es: '/acerca', it: '/informazioni', pt: '/sobre' },
    '/not-found': { en: '/not-found', fr: '/non-trouve', de: '/nicht-gefunden', es: '/no-encontrado', it: '/non-trovato', pt: '/nao-encontrado' }
  }
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const { Link, getPathname, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation(routing);