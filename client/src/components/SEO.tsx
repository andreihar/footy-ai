type GenerateMetadataProps = {
  title?: string;
  description?: string;
};

export function generateMetadata({ title, description }: GenerateMetadataProps) {
  const finalTitle = title ? `${title} | ${process.env.NEXT_PUBLIC_TITLE}` : process.env.NEXT_PUBLIC_TITLE;

  const metadata: any = {
    title: finalTitle,
    description: description || 'Default description',
    keywords: 'Footy AI, Football, AI, Predictions',
    icons: {
      shortcut: '/favicon.ico',
    },
  };

  return metadata;
}