"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // إغلاق القائمة عند الانتقال إلى صفحة أخرى
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // إغلاق القائمة عند الضغط على Escape
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function isActive(href) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header className="siteHeader" dir="rtl">
        <div className="headerContainer">
          {/* الشعار */}
          <Link
            href="/"
            className="logo"
            onClick={closeMenu}
            aria-label="Forex4Ever الرئيسية"
          >
            <span className="logoForex">Forex</span>
            <span className="logoGold">4Ever</span>
          </Link>

          {/* زر قائمة الموبايل */}
          <button
            type="button"
            className={`menuButton ${menuOpen ? "menuButtonOpen" : ""}`}
            onClick={() => setMenuOpen((current) => !current)}
            aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
          >
            <span />
            <span />
            <span />
          </button>

          {/* القائمة */}
          <nav
            id="main-navigation"
            className={`navigation ${menuOpen ? "navigationOpen" : ""}`}
            aria-label="القائمة الرئيسية"
          >
            <div className="mobileMenuTitle">
              <div>
                <strong>القائمة الرئيسية</strong>
                <span>تصفح أقسام Forex4Ever</span>
              </div>

              <button
                type="button"
                onClick={closeMenu}
                aria-label="إغلاق القائمة"
              >
                ×
              </button>
            </div>

            <div className="navigationLinks">
              {navigationLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`navLink ${
                    isActive(item.href) ? "activeLink" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="accountArea">
              <div className="authButtonWrapper">
                <AuthButton />
              </div>

              <Link
                href="/signup"
                className="signupButton"
                onClick={closeMenu}
              >
                إنشاء حساب
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* خلفية خلف قائمة الموبايل */}
      {menuOpen && (
        <button
          type="button"
          className="menuOverlay"
          onClick={closeMenu}
          aria-label="إغلاق القائمة"
        />
      )}

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        .siteHeader {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          padding: 0 5%;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          background: rgba(7, 11, 18, 0.96);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .headerContainer {
          position: relative;
          display: flex;
          width: min(1450px, 100%);
          min-height: 76px;
          margin: 0 auto;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        /* الشعار */
        .logo {
          display: inline-flex;
          flex-shrink: 0;
          align-items: center;
          color: #ffffff;
          font-size: 26px;
          font-weight: 900;
          letter-spacing: -0.8px;
          text-decoration: none;
          transition:
            transform 0.2s ease,
            opacity 0.2s ease;
        }

        .logo:hover {
          transform: translateY(-1px);
        }

        .logoForex {
          color: #ffffff;
        }

        .logoGold {
          position: relative;
          color: #d8b447;
          text-shadow: 0 0 20px rgba(216, 180, 71, 0.25);
        }

        .logoGold::after {
          position: absolute;
          right: 0;
          bottom: -5px;
          width: 65%;
          height: 2px;
          border-radius: 10px;
          background: linear-gradient(
            90deg,
            transparent,
            #d8b447
          );
          content: "";
        }

        /* القائمة على الكمبيوتر */
        .navigation {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: flex-end;
          gap: 18px;
        }

        .navigationLinks {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
        }

        .navLink {
          position: relative;
          display: inline-flex;
          min-height: 42px;
          padding: 0 10px;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          color: #d9dce1;
          font-size: 14px;
          font-weight: 600;
          line-height: 1;
          text-decoration: none;
          white-space: nowrap;
          transition:
            color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }

        .navLink:hover {
          color: #e2bd50;
          background: rgba(212, 175, 55, 0.07);
          transform: translateY(-1px);
        }

        .navLink::after {
          position: absolute;
          right: 50%;
          bottom: 3px;
          width: 0;
          height: 2px;
          border-radius: 20px;
          background: #d4af37;
          content: "";
          transform: translateX(50%);
          transition: width 0.2s ease;
        }

        .navLink:hover::after,
        .activeLink::after {
          width: 23px;
        }

        .activeLink {
          color: #e4c15a;
          background: rgba(212, 175, 55, 0.08);
        }

        /* الحساب */
        .accountArea {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          gap: 10px;
          padding-right: 17px;
          border-right: 1px solid rgba(255, 255, 255, 0.09);
        }

        .authButtonWrapper {
          display: flex;
          align-items: center;
        }

        .authButtonWrapper :global(a),
        .authButtonWrapper :global(button) {
          display: inline-flex;
          min-height: 40px;
          padding: 0 13px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 9px;
          color: #d9b74e;
          background: transparent;
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .authButtonWrapper :global(a:hover),
        .authButtonWrapper :global(button:hover) {
          border-color: rgba(212, 175, 55, 0.5);
          color: #f0cf69;
          background: rgba(212, 175, 55, 0.07);
        }

        .signupButton {
          display: inline-flex;
          min-height: 41px;
          padding: 0 15px;
          align-items: center;
          justify-content: center;
          border: 1px solid #dfbc50;
          border-radius: 9px;
          color: #10130f;
          background: linear-gradient(
            135deg,
            #f0ce68,
            #c89b29
          );
          box-shadow: 0 7px 20px rgba(212, 175, 55, 0.12);
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
          box-shadow: 0 10px 25px rgba(212, 175, 55, 0.22);
        }

        /* عناصر الموبايل مخفية على الكمبيوتر */
        .menuButton,
        .mobileMenuTitle {
          display: none;
        }

        .menuOverlay {
          display: none;
        }

        /* الشاشات المتوسطة */
        @media (max-width: 1250px) {
          .siteHeader {
            padding-right: 3%;
            padding-left: 3%;
          }

          .headerContainer {
            gap: 15px;
          }

          .navigation {
            gap: 10px;
          }

          .navigationLinks {
            gap: 0;
          }

          .navLink {
            padding-right: 7px;
            padding-left: 7px;
            font-size: 13px;
          }

          .accountArea {
            gap: 7px;
            padding-right: 10px;
          }
        }

        /* قائمة الموبايل */
        @media (max-width: 1000px) {
          .siteHeader {
            padding: 0 18px;
          }

          .headerContainer {
            min-height: 68px;
          }

          .logo {
            font-size: 24px;
          }

          .menuButton {
            position: relative;
            display: flex;
            width: 44px;
            height: 44px;
            padding: 0;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 5px;
            border: 1px solid rgba(212, 175, 55, 0.28);
            border-radius: 12px;
            background: rgba(212, 175, 55, 0.06);
            cursor: pointer;
            transition: 0.2s ease;
          }

          .menuButton:hover {
            border-color: rgba(212, 175, 55, 0.55);
            background: rgba(212, 175, 55, 0.1);
          }

          .menuButton span {
            display: block;
            width: 21px;
            height: 2px;
            border-radius: 10px;
            background: #e3c260;
            transition:
              transform 0.25s ease,
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

          .navigation {
            position: absolute;
            top: calc(100% + 11px);
            right: 0;
            z-index: 1002;
            display: flex;
            width: min(390px, calc(100vw - 36px));
            max-height: calc(100vh - 95px);
            padding: 18px;
            align-items: stretch;
            justify-content: flex-start;
            flex-direction: column;
            gap: 15px;
            overflow-y: auto;
            border: 1px solid rgba(212, 175, 55, 0.24);
            border-radius: 20px;
            background:
              radial-gradient(
                circle at 100% 0,
                rgba(212, 175, 55, 0.1),
                transparent 38%
              ),
              rgba(8, 13, 24, 0.99);
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.55);
            opacity: 0;
            visibility: hidden;
            transform: translateY(-12px) scale(0.97);
            transform-origin: top right;
            transition:
              opacity 0.22s ease,
              visibility 0.22s ease,
              transform 0.22s ease;
          }

          .navigationOpen {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) scale(1);
          }

          .mobileMenuTitle {
            display: flex;
            padding: 3px 3px 15px;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }

          .mobileMenuTitle div {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }

          .mobileMenuTitle strong {
            color: #f2f2f0;
            font-size: 16px;
          }

          .mobileMenuTitle span {
            color: #7f8791;
            font-size: 11px;
          }

          .mobileMenuTitle button {
            display: grid;
            width: 34px;
            height: 34px;
            padding: 0;
            place-items: center;
            border: 1px solid rgba(255, 255, 255, 0.09);
            border-radius: 9px;
            color: #aeb4bd;
            background: rgba(255, 255, 255, 0.03);
            font-size: 23px;
            line-height: 1;
            cursor: pointer;
          }

          .navigationLinks {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
          }

          .navLink {
            min-height: 47px;
            padding: 0 12px;
            justify-content: flex-start;
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 11px;
            color: #d7dae0;
            background: rgba(255, 255, 255, 0.025);
            font-size: 13px;
          }

          .navLink::after {
            display: none;
          }

          .navLink:hover,
          .activeLink {
            border-color: rgba(212, 175, 55, 0.25);
            color: #e5c461;
            background: rgba(212, 175, 55, 0.08);
            transform: none;
          }

          .accountArea {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 9px;
            padding: 15px 0 0;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            border-right: 0;
          }

          .authButtonWrapper,
          .authButtonWrapper :global(a),
          .authButtonWrapper :global(button),
          .signupButton {
            width: 100%;
          }

          .authButtonWrapper :global(a),
          .authButtonWrapper :global(button),
          .signupButton {
            min-height: 45px;
          }

          .menuOverlay {
            position: fixed;
            inset: 0;
            z-index: 999;
            display: block;
            width: 100%;
            height: 100%;
            padding: 0;
            border: 0;
            background: rgba(0, 0, 0, 0.58);
            backdrop-filter: blur(3px);
            -webkit-backdrop-filter: blur(3px);
            cursor: default;
          }
        }

        @media (max-width: 480px) {
          .siteHeader {
            padding: 0 13px;
          }

          .navigation {
            right: 0;
            width: calc(100vw - 26px);
            padding: 15px;
            border-radius: 17px;
          }

          .navigationLinks {
            grid-template-columns: 1fr;
          }

          .navLink {
            min-height: 44px;
          }

          .accountArea {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
