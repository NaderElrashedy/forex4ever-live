"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AuthButton from "./AuthButton";

const navigationLinks = [
  {
    href: "/",
    label: "الرئيسية",
  },
  {
    href: "/academy",
    label: "الأكاديمية",
  },
  {
    href: "/live",
    label: "البث المباشر",
  },
  {
    href: "/markets",
    label: "الأسواق",
  },
  {
    href: "/egypt-prices",
    label: "أسعار مصر",
  },
  {
    href: "/news",
    label: "الأخبار",
  },
  {
    href: "/brokers",
    label: "دليل الشركات",
  },
  {
    href: "/risk-calculator",
    label: "حاسبة المخاطر",
  },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);

  // إغلاق القائمة بعد الانتقال إلى صفحة أخرى
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // إغلاق القائمة عند الضغط خارج الـ Header
  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        menuOpen &&
        headerRef.current &&
        !headerRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  function isActiveLink(href) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname?.startsWith(`${href}/`);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="siteHeader" ref={headerRef}>
      <div className="headerContainer">
        {/* اللوجو */}
        <Link
          href="/"
          className="logo"
          onClick={closeMenu}
          aria-label="Forex4Ever الرئيسية"
        >
          <span className="logoIcon" aria-hidden="true">
            F4E
          </span>

          <span className="logoContent">
            <span className="logoName">
              Forex<span>4Ever</span>
            </span>

            <span className="logoDescription">
              الأسواق والتداول والتعليم
            </span>
          </span>
        </Link>

        {/* قائمة الكمبيوتر */}
        <nav className="desktopNavigation" aria-label="القائمة الرئيسية">
          {navigationLinks.map((link) => {
            const active = isActiveLink(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`navLink ${active ? "active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* الحساب على الكمبيوتر */}
        <div className="desktopAccount">
          <div className="authWrapper">
            <AuthButton />
          </div>

          <Link href="/register" className="registerButton">
            إنشاء حساب
          </Link>
        </div>

        {/* زر قائمة الموبايل واللابتوب */}
        <button
          type="button"
          className={`menuButton ${menuOpen ? "opened" : ""}`}
          onClick={() => setMenuOpen((current) => !current)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
        >
          <span />
          <span />
          <span />
        </button>

        {/* قائمة الموبايل واللابتوب */}
        <div
          id="mobile-navigation"
          className={`mobileMenu ${menuOpen ? "show" : ""}`}
        >
          <div className="mobileMenuHeader">
            <div>
              <strong>القائمة الرئيسية</strong>
              <small>اختر الصفحة التي تريد زيارتها</small>
            </div>

            <button
              type="button"
              className="closeButton"
              onClick={closeMenu}
              aria-label="إغلاق القائمة"
            >
              ×
            </button>
          </div>

          <nav className="mobileNavigation" aria-label="قائمة الهاتف">
            {navigationLinks.map((link) => {
              const active = isActiveLink(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`mobileNavLink ${active ? "active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  <span>{link.label}</span>
                  <span className="linkArrow" aria-hidden="true">
                    ←
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mobileAccount">
            <div className="mobileAuthWrapper">
              <AuthButton />
            </div>

            <Link
              href="/register"
              className="mobileRegisterButton"
              onClick={closeMenu}
            >
              إنشاء حساب مجاني
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .siteHeader {
          width: 100%;
          padding: 12px 24px;
          direction: rtl;
          background:
            linear-gradient(
              90deg,
              rgba(212, 175, 55, 0.05),
              transparent 32%,
              transparent 68%,
              rgba(212, 175, 55, 0.05)
            ),
            #080b10;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.22);
          color: #ffffff;
        }

        .headerContainer {
          position: relative;
          width: 100%;
          max-width: 1500px;
          min-height: 66px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 18px;
        }

        /* اللوجو */

        .logo {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          gap: 11px;
          color: #ffffff;
          text-decoration: none;
        }

        .logoIcon {
          width: 45px;
          height: 45px;
          flex: 0 0 45px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(230, 193, 74, 0.62);
          border-radius: 13px;
          background: linear-gradient(145deg, #e7c451, #9b7014);
          box-shadow:
            0 7px 18px rgba(212, 175, 55, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.35);
          color: #0b0d11;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: -0.4px;
        }

        .logoContent {
          display: flex;
          flex-direction: column;
          gap: 3px;
          line-height: 1;
        }

        .logoName {
          color: #ffffff;
          font-size: 20px;
          font-weight: 900;
          letter-spacing: -0.7px;
          white-space: nowrap;
        }

        .logoName span {
          color: #d9b63f;
        }

        .logoDescription {
          color: #8f99a8;
          font-size: 10px;
          font-weight: 600;
          white-space: nowrap;
        }

        /* قائمة الكمبيوتر */

        .desktopNavigation {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
        }

        .navLink {
          position: relative;
          min-height: 42px;
          padding: 0 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid transparent;
          border-radius: 10px;
          color: #d5dae2;
          font-size: 13px;
          font-weight: 700;
          line-height: 1;
          text-decoration: none;
          white-space: nowrap;
          transition:
            color 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }

        .navLink:hover {
          color: #f0ca4d;
          border-color: rgba(212, 175, 55, 0.14);
          background: rgba(212, 175, 55, 0.07);
          transform: translateY(-1px);
        }

        .navLink.active {
          color: #f2ce58;
          border-color: rgba(212, 175, 55, 0.28);
          background: rgba(212, 175, 55, 0.1);
        }

        .navLink.active::after {
          content: "";
          position: absolute;
          right: 25%;
          bottom: 4px;
          width: 50%;
          height: 2px;
          border-radius: 10px;
          background: #d9b63f;
          box-shadow: 0 0 9px rgba(217, 182, 63, 0.6);
        }

        /* الحساب */

        .desktopAccount {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 8px;
          padding-right: 12px;
          border-right: 1px solid rgba(255, 255, 255, 0.09);
        }

        .authWrapper {
          display: flex;
          align-items: center;
        }

        .registerButton {
          min-height: 42px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #d4af37;
          border-radius: 10px;
          background: linear-gradient(135deg, #e2bd43, #b68b1e);
          box-shadow: 0 7px 18px rgba(212, 175, 55, 0.15);
          color: #090b0f;
          font-size: 13px;
          font-weight: 900;
          line-height: 1;
          text-decoration: none;
          white-space: nowrap;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .registerButton:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(212, 175, 55, 0.25);
        }

        /* زر فتح القائمة */

        .menuButton {
          width: 46px;
          height: 44px;
          margin-right: auto;
          padding: 0;
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          border: 1px solid rgba(212, 175, 55, 0.4);
          border-radius: 11px;
          background: rgba(212, 175, 55, 0.08);
          color: #ffffff;
          cursor: pointer;
          transition:
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .menuButton:hover,
        .menuButton.opened {
          border-color: rgba(212, 175, 55, 0.8);
          background: rgba(212, 175, 55, 0.14);
        }

        .menuButton span {
          width: 21px;
          height: 2px;
          display: block;
          border-radius: 10px;
          background: #e0bc45;
          transition:
            transform 0.22s ease,
            opacity 0.22s ease;
        }

        .menuButton.opened span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }

        .menuButton.opened span:nth-child(2) {
          opacity: 0;
        }

        .menuButton.opened span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* القائمة المنسدلة */

        .mobileMenu {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          left: 0;
          z-index: 100;
          max-height: 0;
          padding: 0 18px;
          overflow: hidden;
          visibility: hidden;
          opacity: 0;
          border: 1px solid transparent;
          border-radius: 16px;
          background: #0c1016;
          box-shadow: 0 24px 50px rgba(0, 0, 0, 0.48);
          transform: translateY(-8px);
          transition:
            max-height 0.35s ease,
            padding 0.35s ease,
            opacity 0.25s ease,
            transform 0.25s ease,
            visibility 0.25s ease;
        }

        .mobileMenu.show {
          max-height: 780px;
          padding: 18px;
          visibility: visible;
          opacity: 1;
          border-color: rgba(212, 175, 55, 0.28);
          transform: translateY(0);
        }

        .mobileMenuHeader {
          padding: 0 2px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .mobileMenuHeader > div {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .mobileMenuHeader strong {
          color: #f0cb51;
          font-size: 16px;
        }

        .mobileMenuHeader small {
          color: #87919f;
          font-size: 11px;
        }

        .closeButton {
          width: 36px;
          height: 36px;
          flex: 0 0 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.04);
          color: #d8dde5;
          font-family: Arial, sans-serif;
          font-size: 26px;
          line-height: 1;
          cursor: pointer;
        }

        .mobileNavigation {
          padding: 13px 0;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        .mobileNavLink {
          min-height: 47px;
          padding: 0 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.025);
          color: #d9dee6;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition:
            color 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .mobileNavLink:hover,
        .mobileNavLink.active {
          color: #efcb54;
          border-color: rgba(212, 175, 55, 0.3);
          background: rgba(212, 175, 55, 0.09);
        }

        .linkArrow {
          color: #c9a636;
          font-size: 15px;
        }

        .mobileAccount {
          padding-top: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .mobileAuthWrapper {
          display: flex;
          align-items: center;
        }

        .mobileRegisterButton {
          min-height: 44px;
          padding: 0 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #d4af37;
          border-radius: 10px;
          background: linear-gradient(135deg, #e1bd45, #ad8119);
          color: #090b0f;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
        }

        /* عند الشاشات الأقل من 1280 تظهر قائمة الزر */

        @media (max-width: 1280px) {
          .desktopNavigation,
          .desktopAccount {
            display: none;
          }

          .menuButton {
            display: flex;
          }
        }

        /* الموبايل */

        @media (max-width: 650px) {
          .siteHeader {
            padding: 10px 14px;
          }

          .headerContainer {
            min-height: 58px;
          }

          .logoIcon {
            width: 41px;
            height: 41px;
            flex-basis: 41px;
            border-radius: 11px;
          }

          .logoName {
            font-size: 18px;
          }

          .logoDescription {
            font-size: 9px;
          }

          .menuButton {
            width: 43px;
            height: 42px;
          }

          .mobileMenu {
            top: calc(100% + 10px);
            border-radius: 14px;
          }

          .mobileMenu.show {
            padding: 14px;
          }

          .mobileNavigation {
            grid-template-columns: 1fr;
            gap: 7px;
          }

          .mobileNavLink {
            min-height: 44px;
          }

          .mobileAccount {
            align-items: stretch;
            flex-direction: column;
          }

          .mobileAuthWrapper {
            width: 100%;
            justify-content: center;
          }

          .mobileRegisterButton {
            width: 100%;
          }
        }

        /* الشاشات الصغيرة جدًا */

        @media (max-width: 390px) {
          .logoDescription {
            display: none;
          }

          .logoName {
            font-size: 16px;
          }

          .logoIcon {
            width: 38px;
            height: 38px;
            flex-basis: 38px;
            font-size: 11px;
          }
        }
      `}</style>
    </header>
  );
}
