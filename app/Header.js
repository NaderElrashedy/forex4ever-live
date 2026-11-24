"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "./AuthButton";

const navigationLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/academy", label: "الأكاديمية" },
  { href: "/live", label: "البث المباشر" },
  { href: "/markets", label: "الأسواق" },
  { href: "/egypt-prices", label: "أسعار مصر" },
  { href: "/news", label: "الأخبار" },
  { href: "/brokers", label: "دليل الشركات" },
  { href: "/risk-calculator", label: "حاسبة المخاطر" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // إغلاق قائمة الموبايل عند الانتقال إلى صفحة أخرى
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // منع تمرير الصفحة عندما تكون قائمة الموبايل مفتوحة
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // إغلاق القائمة بزر Escape
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  function isActive(href) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname?.startsWith(`${href}/`);
  }

  return (
    <>
      <header className="header">
        <div className="headerContainer">
          {/* اللوجو */}
          <Link href="/" className="logo" onClick={closeMenu}>
            Forex<span>4Ever</span>
          </Link>

          {/* قائمة الكمبيوتر */}
          <nav className="desktopNav" aria-label="القائمة الرئيسية">
            {navigationLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`navLink ${
                  isActive(item.href) ? "activeLink" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="authContainer">
              <AuthButton />
            </div>

            <Link href="/signup" className="signupButton">
              إنشاء حساب
            </Link>
          </nav>

          {/* زر قائمة الموبايل */}
          <button
            type="button"
            className={`menuButton ${menuOpen ? "menuButtonOpen" : ""}`}
            onClick={() => setMenuOpen((current) => !current)}
            aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* خلفية قائمة الموبايل */}
      <button
        type="button"
        className={`menuOverlay ${menuOpen ? "overlayVisible" : ""}`}
        onClick={closeMenu}
        aria-label="إغلاق القائمة"
        tabIndex={menuOpen ? 0 : -1}
      />

      {/* قائمة الموبايل */}
      <aside
        id="mobile-menu"
        className={`mobileMenu ${menuOpen ? "mobileMenuOpen" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="mobileMenuHeader">
          <Link href="/" className="mobileLogo" onClick={closeMenu}>
            Forex<span>4Ever</span>
          </Link>

          <button
            type="button"
            className="closeButton"
            onClick={closeMenu}
            aria-label="إغلاق القائمة"
          >
            ×
          </button>
        </div>

        <div className="menuTitle">
          <strong>القائمة الرئيسية</strong>
          <small>اختر الصفحة التي تريد زيارتها</small>
        </div>

        <nav className="mobileNav" aria-label="قائمة الهاتف">
          {navigationLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`mobileLink ${
                isActive(item.href) ? "activeMobileLink" : ""
              }`}
              onClick={closeMenu}
            >
              <span>{item.label}</span>
              <span className="arrow" aria-hidden="true">
                ←
              </span>
            </Link>
          ))}
        </nav>

        <div className="mobileAccount">
          <div className="mobileAuth">
            <AuthButton />
          </div>

          <Link
            href="/signup"
            className="mobileSignupButton"
            onClick={closeMenu}
          >
            إنشاء حساب
          </Link>
        </div>

        <p className="menuFooter">Forex4Ever</p>
      </aside>

      <style jsx>{`
        .header {
          position: relative;
          z-index: 100;
          width: 100%;
          padding: 14px 5%;
          direction: rtl;
          background: #080d18;
          border-bottom: 1px solid rgba(212, 175, 55, 0.25);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          box-sizing: border-box;
        }

        .headerContainer {
          width: 100%;
          max-width: 1500px;
          min-height: 48px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        /* اللوجو */

        .logo,
        .mobileLogo {
          flex-shrink: 0;
          color: #ffffff;
          font-size: 25px;
          font-weight: 900;
          line-height: 1;
          text-decoration: none;
          white-space: nowrap;
        }

        .logo span,
        .mobileLogo span {
          color: #d4af37;
        }

        /* قائمة الكمبيوتر */

        .desktopNav {
          min-width: 0;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 4px;
        }

        .navLink {
          position: relative;
          min-height: 40px;
          padding: 0 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid transparent;
          border-radius: 8px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          line-height: 1;
          text-decoration: none;
          white-space: nowrap;
          transition:
            color 0.2s ease,
            border-color 0.2s ease,
            background-color 0.2s ease;
        }

        .navLink:hover {
          color: #d4af37;
          border-color: rgba(212, 175, 55, 0.22);
          background: rgba(212, 175, 55, 0.07);
        }

        .activeLink {
          color: #d4af37;
          border-color: rgba(212, 175, 55, 0.25);
          background: rgba(212, 175, 55, 0.09);
        }

        .activeLink::after {
          content: "";
          position: absolute;
          right: 25%;
          bottom: 3px;
          width: 50%;
          height: 2px;
          border-radius: 10px;
          background: #d4af37;
        }

        .authContainer {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .signupButton {
          min-height: 40px;
          padding: 0 14px;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #d4af37;
          border-radius: 8px;
          background: #d4af37;
          color: #080d18;
          font-size: 14px;
          font-weight: 900;
          line-height: 1;
          text-decoration: none;
          white-space: nowrap;
          transition:
            background-color 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .signupButton:hover {
          background: #e4c34f;
          box-shadow: 0 7px 18px rgba(212, 175, 55, 0.2);
          transform: translateY(-1px);
        }

        /* زر فتح القائمة */

        .menuButton {
          width: 46px;
          height: 44px;
          padding: 0;
          flex-shrink: 0;
          display: none;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
          border: 1px solid rgba(212, 175, 55, 0.45);
          border-radius: 10px;
          background: rgba(212, 175, 55, 0.08);
          cursor: pointer;
          transition:
            background-color 0.2s ease,
            border-color 0.2s ease;
        }

        .menuButton:hover,
        .menuButtonOpen {
          border-color: #d4af37;
          background: rgba(212, 175, 55, 0.15);
        }

        .menuButton span {
          width: 22px;
          height: 2px;
          display: block;
          border-radius: 10px;
          background: #d4af37;
          transition:
            transform 0.25s ease,
            opacity 0.25s ease;
        }

        .menuButtonOpen span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }

        .menuButtonOpen span:nth-child(2) {
          opacity: 0;
        }

        .menuButtonOpen span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* خلفية القائمة */

        .menuOverlay {
          position: fixed;
          inset: 0;
          z-index: 998;
          width: 100%;
          height: 100%;
          padding: 0;
          visibility: hidden;
          opacity: 0;
          border: none;
          background: rgba(0, 0, 0, 0.68);
          backdrop-filter: blur(3px);
          cursor: pointer;
          transition:
            opacity 0.25s ease,
            visibility 0.25s ease;
        }

        .overlayVisible {
          visibility: visible;
          opacity: 1;
        }

        /* قائمة الموبايل */

        .mobileMenu {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: 999;
          width: min(88%, 380px);
          padding: 20px;
          direction: rtl;
          overflow-y: auto;
          visibility: hidden;
          background:
            linear-gradient(
              145deg,
              rgba(212, 175, 55, 0.05),
              transparent 40%
            ),
            #080d18;
          border-left: 1px solid rgba(212, 175, 55, 0.3);
          box-shadow: -20px 0 50px rgba(0, 0, 0, 0.45);
          transform: translateX(105%);
          transition:
            transform 0.3s ease,
            visibility 0.3s ease;
          box-sizing: border-box;
        }

        .mobileMenuOpen {
          visibility: visible;
          transform: translateX(0);
        }

        .mobileMenuHeader {
          padding-bottom: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        }

        .mobileLogo {
          font-size: 23px;
        }

        .closeButton {
          width: 42px;
          height: 42px;
          padding: 0;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(212, 175, 55, 0.35);
          border-radius: 10px;
          background: rgba(212, 175, 55, 0.08);
          color: #d4af37;
          font-family: Arial, sans-serif;
          font-size: 28px;
          line-height: 1;
          cursor: pointer;
        }

        .menuTitle {
          padding: 20px 2px 13px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .menuTitle strong {
          color: #d4af37;
          font-size: 17px;
        }

        .menuTitle small {
          color: #919aaa;
          font-size: 12px;
        }

        .mobileNav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mobileLink {
          min-height: 48px;
          padding: 0 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.025);
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition:
            color 0.2s ease,
            border-color 0.2s ease,
            background-color 0.2s ease,
            transform 0.2s ease;
        }

        .mobileLink:hover {
          color: #d4af37;
          border-color: rgba(212, 175, 55, 0.3);
          background: rgba(212, 175, 55, 0.08);
          transform: translateX(-2px);
        }

        .activeMobileLink {
          color: #d4af37;
          border-color: rgba(212, 175, 55, 0.35);
          background: rgba(212, 175, 55, 0.1);
        }

        .arrow {
          color: #d4af37;
          font-size: 17px;
        }

        .mobileAccount {
          margin-top: 18px;
          padding-top: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-top: 1px solid rgba(212, 175, 55, 0.18);
        }

        .mobileAuth {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobileSignupButton {
          width: 100%;
          min-height: 46px;
          padding: 0 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #d4af37;
          border-radius: 9px;
          background: #d4af37;
          color: #080d18;
          font-size: 14px;
          font-weight: 900;
          text-decoration: none;
          box-sizing: border-box;
        }

        .menuFooter {
          margin: 22px 0 0;
          color: #657083;
          font-size: 12px;
          text-align: center;
        }

        /*
          إظهار زر القائمة وإخفاء روابط الكمبيوتر
          على اللابتوب والشاشات التي قد تتداخل فيها الروابط
        */

        @media (max-width: 1280px) {
          .desktopNav {
            display: none;
          }

          .menuButton {
            display: flex;
          }
        }

        @media (min-width: 1281px) {
          .mobileMenu,
          .menuOverlay {
            display: none;
          }
        }

        /* الموبايل */

        @media (max-width: 650px) {
          .header {
            padding: 12px 15px;
          }

          .headerContainer {
            min-height: 44px;
          }

          .logo {
            font-size: 22px;
          }

          .menuButton {
            width: 43px;
            height: 42px;
          }

          .mobileMenu {
            width: min(90%, 360px);
            padding: 16px;
          }
        }

        @media (max-width: 360px) {
          .logo {
            font-size: 20px;
          }

          .mobileMenu {
            width: 94%;
          }
        }
      `}</style>
    </>
  );
}
