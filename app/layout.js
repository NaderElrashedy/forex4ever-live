import "./globals.css";
import Header from "../components/Header";

export const metadata = {
  title: "Forex4Ever",
  description: "البث المباشر والتحليلات الخاصة بـ Forex4Ever"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Header />
        <main>{children}</main>
        <footer className="footer">
          <p>© {new Date().getFullYear()} Forex4Ever — جميع الحقوق محفوظة</p>
          <p className="risk">
            التداول في الأسواق المالية ينطوي على مخاطر وقد لا يناسب جميع الأشخاص.
          </p>
        </footer>
      </body>
    </html>
  );
}
