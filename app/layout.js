import "./globals.css";
import ConditionalHeader from "./ConditionalHeader";

export const metadata = {
  title: "Forex4Ever",
  description: "تعلم التداول باللغة العربية",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ConditionalHeader />
        {children}
      </body>
    </html>
  );
}
