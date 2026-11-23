import "./globals.css";
import Header from "./Header";

export const metadata = {
  title: "Forex4Ever",
  description: "تعلم التداول باللغة العربية",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
    <Header />
  {children}</body>
    </html>
  );
}
