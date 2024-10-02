'use client';
import { Helmet, HelmetProvider } from 'react-helmet-async';

type Props = {
  description?: string;
  children: JSX.Element | JSX.Element[];
  title?: string;
};

const PageContainer = ({ title, description, children }: Props) => (
  <HelmetProvider>
    <div>
      <Helmet>
        <title>{title} | Footy AI</title>
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="description" content={description} />
      </Helmet>
      {children}
    </div>
  </HelmetProvider>
);

export default PageContainer;
