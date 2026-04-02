export const formatTitle = (title: string) =>
  title.toLowerCase().replace(/\s+/g, "-");

// دالة لإعادة البيانات المشتركة
export const getSharedMetadata = (title: string, description: string) => ({
  keywords: [
    "FlickHQ",
    "Watch Movies Online",
    "Stream TV Shows",
    "Latest Series",
    "Online Entertainment",
    "HD Movies",
    "Watch for Free",
    "Streaming Platform",
  ],
  openGraph: {
    title: title,
    description: description,
    url: `https://www.FlickHQ.com`, // يُعدّل حسب البنية الفعلية للموقع
    siteName: "FlickHQ",
    images: [
      {
        url: "https://www.FlickHQ.com/images/og-image.jpg", // استبدل بالرابط الصحيح
        width: 1200,
        height: 630,
        alt: "FlickHQ - Stream Movies and Shows Online",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    image: "https://www.FlickHQ.com/images/twitter-image.jpg", // استبدل بالرابط الصحيح
  },
});

export const formatDateTime = (
  date: string | number,
  time: string | number,
) => {
  // إذا كان date عدد (timestamp)
  const isTimestamp = typeof date === "number" || typeof time === "number";

  if (isTimestamp) {
    const d = new Date(date || time); // استخدم أي منهما
    const formattedDate = d.toLocaleDateString(); // مثال: 5/6/2025
    const formattedTime = d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }); // مثال: 14:30
    return `${formattedDate}, ${formattedTime}`;
  }

  // إذا كانت قيم نصية مسبقًا
  return `${date}, ${time}`;
};
