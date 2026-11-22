import "./globals.css";

export const metadata = {
  title: "Forex4Ever",
  description: "تعلم التداول باللغة العربية",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
