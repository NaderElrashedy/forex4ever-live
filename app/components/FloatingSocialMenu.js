"use client";
const SOCIAL_LINKS = [
  {
    name: "واتساب",
    url: "",
    color: "#25D366",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.5 0 .2 5.3.2 11.9c0 2.1.5 4.1 1.6 5.9L0 24l6.4-1.7a12 12 0 0 0 5.7 1.5h.1c6.5 0 11.8-5.3 11.8-11.9 0-3.2-1.2-6.2-3.5-8.4Zm-8.4 18.3c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.7 9.7 0 0 1-1.5-5.2A10 10 0 0 1 12.1 2a9.9 9.9 0 0 1 7 2.9 9.8 9.8 0 0 1 2.9 7c0 5.5-4.4 9.9-9.9 9.9Zm5.4-7.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.4.2-.7.1-1.8-.9-3-1.6-4.2-3.7-.3-.6.3-.5.9-1.8.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9 0 1.7 1.3 3.4 1.4 3.6.2.2 2.5 3.8 6 5.3.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 1.8-.7 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.3-.3-.4-.6-.5Z" />
      </svg>
    ),
  },
  {
    name: "تيليجرام",
    url: "",
    color: "#229ED9",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.5 2.1 19.9 21c-.3 1.3-1 1.6-2.1 1l-5.5-4.1-2.7 2.6c-.3.3-.5.5-1.1.5l.4-5.6L19 6.2c.4-.4-.1-.7-.7-.3L5.8 13.8.4 12.1c-1.2-.4-1.2-1.2.2-1.8L21.7 2c1-.4 1.9.2 1.8.1Z" />
      </svg>
    ),
  },
  {
    name: "يوتيوب",
    url: "",
    color: "#FF0000",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
      </svg>
    ),
  },
  {
    name: "فيسبوك",
    url: "",
    color: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1c0 6 4.4 11 10.1 11.9v-8.4h-3v-3.5h3V9.4c0-3 1.8-4.7 4.6-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.3h3.3l-.5 3.5h-2.8V24C19.6 23.1 24 18.1 24 12.1Z" />
      </svg>
    ),
  },
  {
    name: "إنستجرام",
    url: "",
    color: "#E4405F",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.2c3.2 0 3.6 0 4.8.1 3.2.1 4.7 1.7 4.8 4.8.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.7-4.8 4.8-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.2-.1-4.7-1.7-4.8-4.8-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8C2.5 4 4 2.5 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2ZM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0Zm0 5.8A6.2 6.2 0 1 0 12 18a6.2 6.2 0 0 0 0-12.2ZM12 15.8a3.8 3.8 0 1 1 0-7.6 3.8 3.8 0 0 1 0 7.6ZM18.4 4.2a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Z" />
      </svg>
    ),
  },
  {
    name: "X",
    url: "",
    color: "#111111",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.8-6.3L6.7 22H3.5l7.2-8.2L3 2h6.3l4.4 5.8L18.9 2Zm-1.1 17.9h1.7L8.4 4H6.6l11.2 15.9Z" />
      </svg>
    ),
  },
  {
    name: "تيك توك",
    url: "",
    color: "#000000",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19.6 5.6A5 5 0 0 1 16.7 3h-3.2v13.2a2.7 2.7 0 1 1-2.7-2.7c.3 0 .6.1.9.2v-3.3a6.1 6.1 0 1 0 5.1 6V9.7a8.2 8.2 0 0 0 4.8 1.5V8a5 5 0 0 1-2-.4Z" />
      </svg>
    ),
  },
  {
    name: "البريد الإلكتروني",
    url: "",
    color: "#C9A227",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 4H4a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h16a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4Zm0 3-8 5-8-5h16Zm0 10H4a1 1 0 0 1-1-1V9l8.2 5.1a1.5 1.5 0 0 0 1.6 0L21 9v7a1 1 0 0 1-1 1Z" />
      </svg>
    ),
  },
];

function FloatingSocialMenu() {
  const activeLinks = SOCIAL_LINKS.filter((item) => item.url.trim() !== "");

  return (
    <>
      <details className="f4e-floating-social">
        <summary
          className="f4e-floating-button"
          aria-label="فتح وسائل التواصل"
          title="تواصل معنا"
        >
          <span className="f4e-chart-icon" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>

          <span className="f4e-close-icon" aria-hidden="true">
            ×
          </span>

          <span className="f4e-pulse" />
        </summary>

        <div className="f4e-social-panel">
          <div className="f4e-panel-heading">
            <span className="f4e-panel-logo">📈</span>

            <div>
              <strong>تواصل مع Forex4Ever</strong>
              <small>تابعنا على منصات التواصل</small>
            </div>
          </div>

          {activeLinks.length > 0 ? (
            <div className="f4e-social-links">
              {activeLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="f4e-social-link"
                  style={{ "--social-color": item.color }}
                  aria-label={item.name}
                >
                  <span className="f4e-social-icon">{item.icon}</span>
                  <span>{item.name}</span>
                  <span className="f4e-link-arrow">←</span>
                </a>
              ))}
            </div>
          ) : (
            <div className="f4e-empty-message">
              <span>🔔</span>
              <strong>قريبًا</strong>
              <p>سيتم إضافة حسابات التواصل قريبًا.</p>
            </div>
          )}

          <div className="f4e-risk-note">
            Forex4Ever • تعلّم، تابع وتداول بوعي
          </div>
        </div>
      </details>

      <style>{`
        .f4e-floating-social {
          position: fixed;
          left: 22px;
          bottom: 22px;
          z-index: 9999;
          direction: rtl;
          font-family: inherit;
        }

        .f4e-floating-social summary {
          list-style: none;
        }

        .f4e-floating-social summary::-webkit-details-marker {
          display: none;
        }

        .f4e-floating-button {
          position: relative;
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(230, 190, 74, 0.75);
          border-radius: 50%;
          color: #111827;
          background:
            radial-gradient(circle at 35% 25%, #fff2a8 0%, #d8ac31 38%, #9c6e0f 100%);
          box-shadow:
            0 10px 35px rgba(0, 0, 0, 0.45),
            0 0 0 5px rgba(214, 171, 50, 0.12);
          cursor: pointer;
          user-select: none;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .f4e-floating-button:hover {
          transform: translateY(-4px) scale(1.04);
          box-shadow:
            0 15px 40px rgba(0, 0, 0, 0.55),
            0 0 25px rgba(230, 190, 74, 0.32);
        }

        .f4e-floating-button:focus-visible {
          outline: 3px solid rgba(255, 255, 255, 0.9);
          outline-offset: 4px;
        }

        .f4e-chart-icon {
          width: 31px;
          height: 31px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transform: rotate(180deg);
        }

        .f4e-chart-icon i {
          position: relative;
          width: 7px;
          border-radius: 2px;
          background: #111827;
          box-shadow: 0 0 0 1px rgba(17, 24, 39, 0.18);
        }

        .f4e-chart-icon i::before,
        .f4e-chart-icon i::after {
          content: "";
          position: absolute;
          left: 50%;
          width: 2px;
          height: 5px;
          background: #111827;
          transform: translateX(-50%);
        }

        .f4e-chart-icon i::before {
          top: -5px;
        }

        .f4e-chart-icon i::after {
          bottom: -5px;
        }

        .f4e-chart-icon i:nth-child(1) {
          height: 14px;
        }

        .f4e-chart-icon i:nth-child(2) {
          height: 25px;
        }

        .f4e-chart-icon i:nth-child(3) {
          height: 19px;
        }

        .f4e-close-icon {
          display: none;
          color: #111827;
          font-size: 38px;
          font-weight: 300;
          line-height: 1;
        }

        .f4e-floating-social[open] .f4e-chart-icon {
          display: none;
        }

        .f4e-floating-social[open] .f4e-close-icon {
          display: block;
        }

        .f4e-pulse {
          position: absolute;
          inset: -1px;
          z-index: -1;
          border: 2px solid rgba(230, 190, 74, 0.8);
          border-radius: 50%;
          animation: f4ePulse 2s infinite;
          pointer-events: none;
        }

        @keyframes f4ePulse {
          0% {
            opacity: 0.8;
            transform: scale(1);
          }

          75%,
          100% {
            opacity: 0;
            transform: scale(1.45);
          }
        }

        .f4e-floating-social[open] .f4e-pulse {
          display: none;
        }

        .f4e-social-panel {
          position: absolute;
          left: 0;
          bottom: 78px;
          width: 310px;
          max-height: min(520px, calc(100vh - 125px));
          overflow-y: auto;
          padding: 16px;
          border: 1px solid rgba(218, 178, 63, 0.35);
          border-radius: 20px;
          color: #ffffff;
          background:
            linear-gradient(145deg, rgba(24, 29, 38, 0.98), rgba(7, 10, 15, 0.99));
          box-shadow:
            0 22px 60px rgba(0, 0, 0, 0.55),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          transform-origin: bottom left;
          animation: f4ePanelOpen 0.25s ease both;
          scrollbar-width: thin;
          scrollbar-color: #c9a227 #151922;
        }

        @keyframes f4ePanelOpen {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.94);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .f4e-panel-heading {
          display: flex;
          align-items: center;
          gap: 11px;
          padding-bottom: 14px;
          margin-bottom: 13px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.09);
        }

        .f4e-panel-logo {
          width: 45px;
          height: 45px;
          flex: 0 0 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(230, 190, 74, 0.35);
          border-radius: 13px;
          font-size: 23px;
          background: rgba(230, 190, 74, 0.1);
        }

        .f4e-panel-heading strong {
          display: block;
          margin-bottom: 4px;
          color: #f3ce62;
          font-size: 15px;
        }

        .f4e-panel-heading small {
          display: block;
          color: #aeb5c2;
          font-size: 12px;
        }

        .f4e-social-links {
          display: grid;
          gap: 8px;
        }

        .f4e-social-link {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 50px;
          padding: 8px 10px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 13px;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.035);
          text-decoration: none;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .f4e-social-link:hover {
          transform: translateX(-4px);
          border-color: var(--social-color);
          background: color-mix(
            in srgb,
            var(--social-color) 13%,
            rgba(255, 255, 255, 0.035)
          );
        }

        .f4e-social-icon {
          width: 34px;
          height: 34px;
          flex: 0 0 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: var(--social-color);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);
        }

        .f4e-social-icon svg {
          width: 18px;
          height: 18px;
          fill: #ffffff;
        }

        .f4e-link-arrow {
          margin-right: auto;
          color: #d8b349;
          font-size: 18px;
        }

        .f4e-empty-message {
          padding: 22px 14px;
          border: 1px dashed rgba(230, 190, 74, 0.32);
          border-radius: 14px;
          text-align: center;
          background: rgba(230, 190, 74, 0.05);
        }

        .f4e-empty-message > span {
          display: block;
          margin-bottom: 7px;
          font-size: 27px;
        }

        .f4e-empty-message strong {
          display: block;
          margin-bottom: 6px;
          color: #e5c158;
        }

        .f4e-empty-message p {
          margin: 0;
          color: #b1b7c2;
          font-size: 13px;
        }

        .f4e-risk-note {
          margin-top: 13px;
          color: #7f8794;
          font-size: 10px;
          text-align: center;
        }

        @media (max-width: 600px) {
          .f4e-floating-social {
            left: 14px;
            bottom: 15px;
          }

          .f4e-floating-button {
            width: 57px;
            height: 57px;
          }

          .f4e-social-panel {
            bottom: 69px;
            width: min(310px, calc(100vw - 28px));
            max-height: calc(100vh - 105px);
          }

          .f4e-chart-icon {
            width: 27px;
            height: 27px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .f4e-pulse {
            animation: none;
          }

          .f4e-social-panel {
            animation: none;
          }

          .f4e-floating-button,
          .f4e-social-link {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}
export default FloatingSocialMenu;
