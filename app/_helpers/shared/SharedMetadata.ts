/**
 * Generates shared metadata for FlickHQ – Movies & TV Shows platform.
 * Includes OpenGraph and Twitter cards for better social sharing.
 */
export const getSharedMetadata = (title: string, description: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const logoUrl = `${baseUrl}/logo.webp`;

  return {
    title,
    description,

    // SEO keywords for movies & streaming platform
    keywords: [
      "FlickHQ",
      "Flick HQ",
      "movies online",
      "watch movies",
      "TV shows",
      "streaming platform",
      "online cinema",
      "latest movies",
      "series online",
      "watch TV series",
      "أفلام أونلاين",
      "مشاهدة أفلام",
      "مسلسلات",
      "سينما عبر الإنترنت",
      "أفضل الأفلام",
    ],

    // OpenGraph (social sharing)
    openGraph: {
      title: `${title} | FlickHQ`,
      description,
      url: baseUrl,
      siteName: "FlickHQ – Movies & TV Shows",
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: "FlickHQ – Movies & TV Shows Online Cinema",
        },
      ],
      type: "website",
      locale: "en_US",
    },

    // Icons
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
};
