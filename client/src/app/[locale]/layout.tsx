import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import React, { Suspense } from "react";
import ClientLayout from "@/layout/ClientLayout";
import Loading from './loading';

export default async function RootLayout({ children, params: { locale } }: {
  children: React.ReactNode; params: { locale: string; };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <Suspense fallback={<Loading />}>
          <NextIntlClientProvider messages={messages}>
            <ClientLayout>
              {children}
            </ClientLayout>
          </NextIntlClientProvider>
        </Suspense>
      </body>
    </html>
  );
}