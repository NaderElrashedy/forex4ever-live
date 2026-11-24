"use client";

import { useState } from "react";

const socialLinks = [
  {
    id: "whatsapp",
    name: "واتساب",
    url: "",
    color: "#25D366",
  },
  {
    id: "telegram",
    name: "تيليجرام",
    url: "",
    color: "#229ED9",
  },
  {
    id: "youtube",
    name: "يوتيوب",
    url: "",
    color: "#FF0000",
  },
  {
    id: "facebook",
    name: "فيسبوك",
    url: "",
    color: "#1877F2",
  },
  {
    id: "instagram",
    name: "إنستجرام",
    url: "",
    color: "#E4405F",
  },
  {
    id: "x",
    name: "X",
    url: "",
    color: "#ffffff",
  },
  {
    id: "tiktok",
    name: "تيك توك",
    url: "",
    color: "#ffffff",
  },
  {
    id: "email",
    name: "البريد الإلكتروني",
    url: "",
    color: "#d9b45b",
  },
];

function SocialIcon({ type }) {
  if (type === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 3.1a8.7 8.7 0 0 0-7.5 13.1L3.3 21l4.9-1.3A8.7 8.7 0 1 0 12 3.1Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />

        <path
          d="M9 7.8c.3-.2.7-.1.9.3l.7 1.5c.1.3.1.6-.1.8l-.6.7c.6 1.2 1.6 2.2 2.8 2.8l.7-.7c.2-.2.6-.3.9-.1l1.5.7c.4.2.5.6.3.9-.4.9-1.3 1.5-2.3 1.4-3.3-.5-5.9-3.1-6.4-6.4-.1-.8.6-1.7 1.6-1.9Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (type === "telegram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="m3.5 11 16.2-6.3c.8-.3 1.4.2 1.1 1.2l-2.7 12.7c-.2.9-.8 1.1-1.6.7l-4.1-3-2 2c-.2.2-.4.4-.8.4l.3-4.2 7.7-7c.3-.3-.1-.5-.5-.2l-9.5 6-4.1-1.3c-.9-.3-.9-.7 0-1Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (type === "youtube") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="2.5"
          y="5.5"
          width="19"
          height="13"
          rx="4"
          fill="currentColor"
        />

        <path d="m10 9 6 3-6 3V9Z" fill="#ffffff" />
      </svg>
    );
  }

  if (type === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M14 8h3V4.3c-.5-.1-2.1-.3-4-.3-3.9 0-6.5 2.3-6.5 6.7V14H3v4h3.5v6h4.3v-6h4l.6-4h-4.6v-2.9C10.8 9.9 11.2 8 14 8Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (type === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />

        <circle
          cx="12"
          cy="12"
          r="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />

        <circle cx="17.5" cy="6.7" r="1.2" fill="currentColor" />
      </svg>
    );
  }

  if (type === "x") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M5 4h4.2l3.7 5.1L17.3 4H20l-5.9 6.9L20.5 20h-4.2l-4-5.5L7.7 20H5l6.1-7.2L5 4Zm3 2 9.4 12H18L8.7 6H8Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (type === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M14 3v11.2a4.8 4.8 0 1 1-4.1-4.7v3a2 2 0 1 0 1.3 1.9V3H14Zm0 0c.4 2.5 1.8 4 4.5 4.6v3A8 8 0 0 1 14 8V3Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (type === "email") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="2.5"
          y="5"
          width="19"
          height="14"
          rx="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />

        <path
          d="m4 7 8 6 8-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return null;
}

function TradingIcon({ isOpen }) {
  if (isOpen) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6 6 18 18M18 6 6 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 17 8.5 12l3.2 3 7.3-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M15 6h4v4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M4 21h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function FloatingSocialMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="floating-social-wrapper">
      <div
        id="social-contact-menu"
        className={`social-menu ${isOpen ? "social-menu-open" : ""}`}
        aria-hidden={!isOpen}
      >
        <div className="menu-header">
          <div className="menu-title">
            <strong>تواصل معنا</strong>
            <span>تابع Forex4Ever على منصات التواصل</span>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={() => setIsOpen(false)}
            aria-label="إغلاق قائمة التواصل"
          >
            ×
          </button>
        </div>

        <div className="social-list">
          {socialLinks.map((social) => {
            const hasLink = social.url.trim() !== "";

            if (hasLink) {
              return (
                <a
                  key={social.id}
                  href={social.url}
                  className="social-item"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ "--social-color": social.color }}
                  aria-label={social.name}
                  title={social.name}
                >
                  <span className="social-icon">
                    <SocialIcon type={social.id} />
                  </span>
                </a>
              );
            }

            return (
              <button
                key={social.id}
                type="button"
                className="social-item social-item-disabled"
                style={{ "--social-color": social.color }}
                aria-label={`${social.name} - سيتم إضافة الرابط قريبًا`}
                title={`${social.name} - قريبًا`}
                disabled
              >
                <span className="social-icon">
                  <SocialIcon type={social.id} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className={`floating-trigger ${isOpen ? "trigger-open" : ""}`}
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls="social-contact-menu"
        aria-label={isOpen ? "إغلاق قائمة التواصل" : "فتح قائمة التواصل"}
      >
        <span className="trigger-icon">
          <TradingIcon isOpen={isOpen} />
        </span>

        <span className="trigger-label">تواصل معنا</span>
      </button>

      <style jsx>{`
        .floating-social-wrapper {
          position: fixed;
          left: 22px;
          bottom: 22px;
          z-index: 9999;
          direction: rtl;
          font-family: inherit;
        }

        .floating-trigger {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          width: 86px;
          min-height: 84px;
          padding: 9px 7px;
          border: 1px solid rgba(217, 180, 91, 0.7);
          border-radius: 20px;
          color: #f4d47c;
          background:
            radial-gradient(
              circle at 50% 10%,
              rgba(217, 180, 91, 0.2),
              transparent 50%
            ),
            linear-gradient(145deg, #151515, #080808);
          box-shadow:
            0 12px 30px rgba(0, 0, 0, 0.42),
            0 0 18px rgba(217, 180, 91, 0.14);
          cursor: pointer;
          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .floating-trigger:hover {
          transform: translateY(-3px);
          border-color: #f2ce72;
          box-shadow:
            0 15px 35px rgba(0, 0, 0, 0.5),
            0 0 25px rgba(217, 180, 91, 0.25);
        }

        .trigger-open {
          border-color: #f2ce72;
        }

        .trigger-icon {
          display: grid;
          place-items: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: #111111;
          background: linear-gradient(135deg, #f5dc91, #b98b2f);
          box-shadow: 0 5px 15px rgba(217, 180, 91, 0.25);
        }

        .trigger-icon :global(svg) {
          width: 23px;
          height: 23px;
        }

        .trigger-label {
          color: #f7e6b5;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        .social-menu {
          position: absolute;
          left: 0;
          bottom: calc(100% + 14px);
          width: 280px;
          padding: 14px;
          border: 1px solid rgba(217, 180, 91, 0.35);
          border-radius: 22px;
          background:
            radial-gradient(
              circle at top right,
              rgba(217, 180, 91, 0.12),
              transparent 40%
            ),
            rgba(10, 10, 10, 0.98);
          box-shadow:
            0 22px 55px rgba(0, 0, 0, 0.58),
            0 0 25px rgba(217, 180, 91, 0.08);
          opacity: 0;
          visibility: hidden;
          transform: translateY(14px) scale(0.96);
          transform-origin: bottom left;
          pointer-events: none;
          transition:
            opacity 0.25s ease,
            transform 0.25s ease,
            visibility 0.25s ease;
        }

        .social-menu-open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        .menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 2px 3px 13px;
          margin-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .menu-title {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .menu-title strong {
          color: #f4d47c;
          font-size: 17px;
        }

        .menu-title span {
          color: #9f9f9f;
          font-size: 11px;
        }

        .close-button {
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          width: 32px;
          height: 32px;
          padding: 0;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 50%;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
          transition:
            color 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .close-button:hover {
          color: #f4d47c;
          border-color: rgba(217, 180, 91, 0.55);
          background: rgba(217, 180, 91, 0.1);
        }

        .social-list {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .social-item {
          display: grid;
          place-items: center;
          width: 100%;
          aspect-ratio: 1;
          margin: 0;
          padding: 7px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.035);
          text-decoration: none;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease;
        }

        .social-item:hover {
          transform: translateY(-3px);
          border-color: var(--social-color);
          background: rgba(255, 255, 255, 0.075);
          box-shadow: 0 7px 18px rgba(0, 0, 0, 0.3);
        }

        .social-item-disabled {
          cursor: default;
          opacity: 0.9;
        }

        .social-item-disabled:disabled {
          color: #ffffff;
        }

        .social-item-disabled:hover {
          transform: none;
          border-color: rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.035);
          box-shadow: none;
        }

        .social-icon {
          display: grid;
          place-items: center;
          width: 43px;
          height: 43px;
          border-radius: 13px;
          color: var(--social-color);
          background: rgba(255, 255, 255, 0.07);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
        }

        .social-icon :global(svg) {
          display: block;
          width: 25px;
          height: 25px;
        }

        @media (max-width: 600px) {
          .floating-social-wrapper {
            left: 14px;
            bottom: 15px;
          }

          .floating-trigger {
            width: 76px;
            min-height: 76px;
            border-radius: 18px;
          }

          .trigger-icon {
            width: 36px;
            height: 36px;
          }

          .trigger-icon :global(svg) {
            width: 21px;
            height: 21px;
          }

          .trigger-label {
            font-size: 11px;
          }

          .social-menu {
            width: min(280px, calc(100vw - 28px));
            max-height: calc(100vh - 115px);
            overflow-y: auto;
          }

          .social-icon {
            width: 39px;
            height: 39px;
          }

          .social-icon :global(svg) {
            width: 23px;
            height: 23px;
          }
        }

        @media (max-width: 350px) {
          .social-list {
            grid-template-columns: repeat(3, 1fr);
          }

          .social-menu {
            width: min(250px, calc(100vw - 28px));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .floating-trigger,
          .social-menu,
          .social-item,
          .close-button {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
