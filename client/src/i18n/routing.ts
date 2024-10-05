import { createLocalizedPathnamesNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr', 'de', 'es', 'it', 'pt'],
  defaultLocale: 'en',
  pathnames: {
    '/[year]': '/[year]',
    '/[year]/matches': { en: '/[year]/matches', fr: '/[year]/matchs', de: '/[year]/spiele', es: '/[year]/partidos', it: '/[year]/partite', pt: '/[year]/partidas' },
    '/[year]/group': { en: '/[year]/group', fr: '/[year]/groupes', de: '/[year]/gruppen', es: '/[year]/grupos', it: '/[year]/gironi', pt: '/[year]/grupos' },
    '/[year]/knockout': { en: '/[year]/knockout', fr: '/[year]/elimination', de: '/[year]/ausscheidung', es: '/[year]/eliminatoria', it: '/[year]/eliminazione', pt: '/[year]/eliminar' },
    '/[year]/custom': { en: '/[year]/custom', fr: '/[year]/personnalise', de: '/[year]/angepasstes', es: '/[year]/personalizado', it: '/[year]/personalizzata', pt: '/[year]/personalizada' },
    '/[year]/about': { en: '/[year]/about', fr: '/[year]/a-propos', de: '/[year]/ueber', es: '/[year]/acerca', it: '/[year]/informazioni', pt: '/[year]/sobre' },
    '/[year]/not-found': { en: '/[year]/not-found', fr: '/[year]/non-trouve', de: '/[year]/nicht-gefunden', es: '/[year]/no-encontrado', it: '/[year]/non-trovato', pt: '/[year]/nao-encontrado' }
  }
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const { Link, getPathname, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation(routing);