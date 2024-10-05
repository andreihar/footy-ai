import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { ReactNode } from 'react';
import { routing } from '@/i18n/routing';
import ClientLayout from '@/layout/ClientLayout';
import { years } from '@/config';

type Props = {
  children: ReactNode;
  params: { locale: string; year: string; };
};

export function generateStaticParams() {
  const params = [];
  for (const locale of routing.locales) {
    for (const year of years) {
      params.push({ locale, year: year.toString() });
    }
  }
  return params;
}

export default async function RootLayout({ children, params: { locale, year } }: Props) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ClientLayout year={Number(year)}>
            {children}
          </ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
