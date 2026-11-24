"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import AuthButton from "./AuthButton";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/academy", label: "الأكاديمية" },
  { href: "/live", label: "البث المباشر" },
  { href: "/markets", label: "الأسواق" },
  { href: "/egypt-prices", label: "أسعار مصر" },
  { href: "/news", label: "الأخبار" },
  { href: "/brokers", label: "دليل الشركات" },
  { href: "/risk-calculator", label: "حاسبة المخاطر" },
];

// إذا كان مسار التسجيل عندك /register غيّر السطر التالي فقط
const REGISTER_URL = "/signup";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    function handleOutsideClick(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  function isActiveLink(href) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname?.startsWith(`${href}/`);
  }

  return (
    <header className="siteHeader">
      <div className="headerGlow" />

      <div className="headerContainer">
        {/* اللوجو واسم الموقع */}
        <Link href="/" className="brand" aria-label="Forex4Ever الرئيسية">
          <span className="logoIcon" aria-hidden="true">
            <span className="logoLetters">F4</span>
            <span className="logoLine" />
          </span>

          <span className="brandContent">
            <span className="brandName">
              <span className="forexText">Forex</span>
              <span className="everText">4Ever</span>
            </span>

            <span className="brandDescription">
              الأسواق والتداول
            </span>
          </span>
        </Link>

        {/* روابط الكمبيوتر */}
        <nav className="desktopNavigation" aria-label="القائمة الرئيسية">
          {navLinks.map((link) => {
            const active = isActiveLink(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`navLink ${active ? "activeLink" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* خيارات الحساب على الكمبيوتر */}
        <div className="desktopAccount">
          <div className="authWrapper">
            <AuthButton />
          </div>

          <Link href={REGISTER_URL} className="signupButton">
            إنشاء حساب
          </Link>
        </div>

        {/* زر قائمة الهاتف */}
        <div className="mobileMenuArea" ref={menuRef}>
          <button
            type="button"
            className={`menuButton ${menuOpen ? "menuButtonOpen" : ""}`}
            onClick={() => setMenuOpen((current) => !current)}
            aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <span />
            <span />
            <span />
          </button>

          {/* قائمة الهاتف */}
          {menuOpen && (
            <div
              id="mobile-navigation"
              className="mobileMenu"
              role="dialog"
              aria-label="قائمة الموقع"
            >
              <div className="mobileMenuHeader">
                <div>
                  <strong>قائمة الموقع</strong>
                  <span>اختر الصفحة التي تريد زيارتها</span>
                </div>

                <button
                  type="button"
                  className="closeButton"
                  onClick={() => setMenuOpen(false)}
                  aria-label="إغلاق القائمة"
                >
                  ×
                </button>
              </div>

              <nav className="mobileNavigation">
                {navLinks.map((link) => {
                  const active = isActiveLink(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`mobileLink ${
                        active ? "activeMobileLink" : ""
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="mobileLinkDot" />
                      <span>{link.label}</span>

                      <span className="mobileArrow" aria-hidden="true">
                        ←
                      </span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mobileAccount">
                <div className="mobileAuth">
                  <AuthButton />
                </div>

                <Link
                  href={REGISTER_URL}
                  className="mobileSignupButton"
                  onClick={() => setMenuOpen(false)}
                >
                  إنشاء حساب مجاني
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .siteHeader {
          position: relative;
          z-index: 50;
          width: 100%;
          direction: rtl;
          background:
            radial-gradient(
              circle at 15% 0%,
              rgba(212, 175, 55, 0.1),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #080b11 0%,
              #0e131b 50%,
              #080b11 100%
            );
          border-bottom: 1px solid rgba(212, 175, 55, 0.22);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.28);
        }

        .headerGlow {
          position: absolute;
          right: 0;
          bottom: -1px;
          width: 35%;
          height: 1px;
          pointer-events: none;
          background: linear-gradient(
            90deg,
            transparent,
            #d4af37,
            transparent
          );
        }

        .headerContainer {
          position: relative;
          width: min(100% - 32px, 1540px);
          min-height: 82px;
          margin-inline: auto;
          display: flex;
          align-items: center;
          gap: 24px;
        }

        /* ===== اللوجو ===== */

        .brand {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: white;
          text-decoration: none;
        }

        .logoIcon {
          position: relative;
          width: 49px;
          height: 49px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          overflow: hidden;
          border: 1px solid rgba(240, 199, 76, 0.75);
          border-radius: 15px 6px 15px 6px;
          background:
            linear-gradient(
              145deg,
              rgba(244, 205, 91, 0.25),
              rgba(212, 175, 55, 0.05)
            ),
            #10151e;
          box-shadow:
            0 0 0 4px rgba(212, 175, 55, 0.05),
            0 10px 25px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
          transform: rotate(-2deg);
          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .logoIcon::before {
          content: "";
          position: absolute;
          top: -25px;
          right: -26px;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: rgba(239, 196, 68, 0.16);
        }

        .logoLetters {
          position: relative;
          z-index: 2;
          direction: ltr;
          font-size: 18px;
          font-weight: 900;
          letter-spacing: -1px;
          color: #f3cb55;
          text-shadow: 0 2px 10px rgba(212, 175, 55, 0.3);
        }

        .logoLine {
          position: absolute;
          right: 8px;
          bottom: 9px;
          width: 27px;
          height: 7px;
          border-top: 2px solid #f3cb55;
          border-right: 2px solid #f3cb55;
          transform: skewX(-30deg);
          opacity: 0.85;
        }

        .brand:hover .logoIcon {
          transform: translateY(-2px) rotate(0);
          border-color: #f3cb55;
          box-shadow:
            0 0 0 5px rgba(212, 175, 55, 0.08),
            0 12px 28px rgba(0, 0, 0, 0.35);
        }

        .brandContent {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1;
        }

        .brandName {
          direction: ltr;
          display: inline-flex;
          align-items: baseline;
          font-size: 23px;
          font-weight: 900;
          letter-spacing: -0.8px;
          white-space: nowrap;
        }

        .forexText {
          color: #ffffff;
        }

        .everText {
          color: #efc44a;
        }

        .brandDescription {
          margin-top: 7px;
          color: #8e98a8;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.3px;
          white-space: nowrap;
        }

        /* ===== روابط الكمبيوتر ===== */

        .desktopNavigation {
          min-width: 0;
          flex: 1 1 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(9px, 1.05vw, 20px);
          white-space: nowrap;
        }

        .navLink {
          position: relative;
          display: inline-flex;
          align-items: center;
          min-height: 42px;
          padding: 8px 2px;
          color: #d5d9df;
          font-size: clamp(12px, 0.83vw, 14px);
          font-weight: 700;
          text-decoration: none;
          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }

        .navLink::after {
          content: "";
          position: absolute;
          right: 50%;
          bottom: 3px;
          width: 0;
          height: 2px;
          border-radius: 20px;
          background: linear-gradient(90deg, #b8891e, #f6d66f);
          transform: translateX(50%);
          transition: width 0.25s ease;
        }

        .navLink:hover {
          color: #f5ce5b;
          transform: translateY(-1px);
        }

        .navLink:hover::after {
          width: 70%;
        }

        .activeLink {
          color: #f5ce5b;
        }

        .activeLink::after {
          width: 70%;
        }

        /* ===== الحساب ===== */

        .desktopAccount {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 10px;
          padding-right: 5px;
          border-right: 1px solid rgba(255, 255, 255, 0.09);
        }

        .authWrapper {
          display: flex;
          align-items: center;
        }

        .signupButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 9px 15px;
          border: 1px solid #d4af37;
          border-radius: 11px;
          color: #0b0e13;
          background: linear-gradient(135deg, #f6d66f, #c99626);
          box-shadow: 0 8px 20px rgba(212, 175, 55, 0.16);
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
          white-space: nowrap;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .signupButton:hover {
          transform: translateY(-2px);
          box-shadow: 0 11px 25px rgba(212, 175, 55, 0.25);
        }

        /* ===== قائمة الشاشات الصغيرة ===== */

        .mobileMenuArea {
          position: relative;
          display: none;
          margin-right: auto;
        }

        .menuButton {
          width: 46px;
          height: 43px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          border: 1px solid rgba(212, 175, 55, 0.4);
          border-radius: 12px;
          cursor: pointer;
          background: rgba(212, 175, 55, 0.07);
        }

        .menuButton span {
          display: block;
          width: 22px;
          height: 2px;
          border-radius: 20px;
          background: #f2cb58;
          transition:
            transform 0.2s ease,
            opacity 0.2s ease;
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

        .mobileMenu {
          position: absolute;
          top: calc(100% + 15px);
          left: 0;
          width: min(390px, calc(100vw - 28px));
          max-height: calc(100vh - 115px);
          overflow-y: auto;
          border: 1px solid rgba(212, 175, 55, 0.28);
          border-radius: 18px;
          background:
            radial-gradient(
              circle at 0 0,
              rgba(212, 175, 55, 0.12),
              transparent 35%
            ),
            #0c1119;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.58);
        }

        .mobileMenuHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .mobileMenuHeader div {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .mobileMenuHeader strong {
          color: #f1ca56;
          font-size: 16px;
        }

        .mobileMenuHeader span {
          color: #8e98a8;
          font-size: 11px;
        }

        .closeButton {
          width: 35px;
          height: 35px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
          font-size: 25px;
          line-height: 1;
          cursor: pointer;
        }

        .mobileNavigation {
          display: grid;
          gap: 5px;
          padding: 12px;
        }

        .mobileLink {
          display: flex;
          align-items: center;
          gap: 11px;
          min-height: 48px;
          padding: 10px 13px;
          border: 1px solid transparent;
          border-radius: 11px;
          color: #dce0e6;
          background: rgba(255, 255, 255, 0.025);
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition:
            color 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .mobileLink:hover,
        .activeMobileLink {
          color: #f2ca56;
          border-color: rgba(212, 175, 55, 0.2);
          background: rgba(212, 175, 55, 0.08);
        }

        .mobileLinkDot {
          width: 7px;
          height: 7px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #596272;
        }

        .activeMobileLink .mobileLinkDot,
        .mobileLink:hover .mobileLinkDot {
          background: #f2ca56;
          box-shadow: 0 0 10px rgba(242, 202, 86, 0.5);
        }

        .mobileArrow {
          margin-right: auto;
          color: #687384;
        }

        .mobileAccount {
          display: grid;
          gap: 10px;
          padding: 15px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }

        .mobileAuth {
          display: flex;
          justify-content: center;
        }

        .mobileSignupButton {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 10px 15px;
          border: 1px solid #d4af37;
          border-radius: 12px;
          color: #090c11;
          background: linear-gradient(135deg, #f5d46a, #c89425);
          font-size: 14px;
          font-weight: 900;
          text-decoration: none;
        }

        /* إظهار القائمة قبل بدء تداخل روابط الكمبيوتر */
        @media (max-width: 1240px) {
          .desktopNavigation,
          .desktopAccount {
            display: none;
          }

          .mobileMenuArea {
            display: block;
          }

          .headerContainer {
            min-height: 76px;
          }
        }

        @media (max-width: 600px) {
          .headerContainer {
            width: min(100% - 22px, 1540px);
            min-height: 70px;
          }

          .brand {
            gap: 9px;
          }

          .logoIcon {
            width: 43px;
            height: 43px;
            border-radius: 13px 5px 13px 5px;
          }

          .logoLetters {
            font-size: 16px;
          }

          .brandName {
            font-size: 20px;
          }

          .brandDescription {
            margin-top: 5px;
            font-size: 9px;
          }

          .menuButton {
            width: 43px;
            height: 41px;
          }

          .mobileMenu {
            top: calc(100% + 12px);
          }
        }

        @media (max-width: 370px) {
          .brandDescription {
            display: none;
          }

          .brandName {
            font-size: 18px;
          }

          .logoIcon {
            width: 40px;
            height: 40px;
          }

          .headerContainer {
            width: calc(100% - 16px);
          }
        }
      `}</style>
    </header>
  );
}
