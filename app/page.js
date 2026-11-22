import Link from "next/link";

const features = [
  {
    icon: "🎓",
    title: "أكاديمية مجانية",
    description:
      "محتوى عربي منظم يبدأ معك من أساسيات التداول وصولًا إلى بناء خطة تداول احترافية.",
  },
  {
    icon: "📡",
    title: "بث مباشر",
    description:
      "تابع البث المباشر والتحليلات التعليمية بعد إنشاء حساب مجاني وتسجيل الدخول.",
  },
  {
    icon: "📱",
    title: "متوافق مع جميع الأجهزة",
    description:
      "استخدم المنصة بسهولة من الهاتف أو الكمبيوتر دون الحاجة إلى تثبيت تطبيق.",
  },
];

const academyStats = [
  {
    value: "6 دورات",
    label: "منهج تعليمي متدرج",
  },
  {
    value: "30 فصلًا",
    label: "شرح عربي مبسط",
  },
  {
    value: "مجانية",
    label: "بدون رسوم اشتراك",
  },
  {
    value: "متوافقة",
    label: "مع الهاتف والكمبيوتر",
  },
];

const academyCourses = [
  "أساسيات التداول",
  "التحليل الفني",
  "إدارة رأس المال والمخاطر",
  "علم نفس التداول",
  "الاقتصاد والتحليل الأساسي",
  "أساسيات العمل الاحترافي",
];

export default function HomePage() {
  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        backgroundColor: "#080d14",
        color: "#ffffff",
        fontFamily: "Arial, Tahoma, sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* القائمة العلوية */}
      <header
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          backgroundColor: "rgba(8, 13, 20, 0.96)",
          borderBottom: "1px solid rgba(230, 197, 99, 0.2)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "15px",
            boxSizing: "border-box",
          }}
        >
          {/* اللوجو واسم الموقع */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#ffffff",
              textDecoration: "none",
            }}
          >
            <img
              src="/logo.jpg"
              alt="Forex4Ever"
              width="46"
              height="46"
              style={{
                width: "46px",
                height: "46px",
                objectFit: "cover",
                borderRadius: "50%",
                border: "2px solid #e6c563",
              }}
            />

            <div>
              <strong
                style={{
                  display: "block",
                  color: "#e6c563",
                  fontSize: "20px",
                  lineHeight: "1.2",
                }}
              >
                Forex4Ever
              </strong>

              <span
                style={{
                  color: "#aeb7c4",
                  fontSize: "11px",
                }}
              >
                تعليم التداول باللغة العربية
              </span>
            </div>
          </Link>

          {/* روابط الموقع */}
          <nav
            aria-label="القائمة الرئيسية"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <Link
              href="/"
              style={{
                padding: "10px 12px",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "700",
              }}
            >
              الرئيسية
            </Link>

            <Link
              href="/academy"
              style={{
                padding: "10px 12px",
                color: "#e6c563",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "800",
              }}
            >
              الأكاديمية المجانية
            </Link>

            <Link
              href="/live"
              style={{
                padding: "10px 12px",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "700",
              }}
            >
              البث المباشر
            </Link>

            <Link
              href="/login"
              style={{
                padding: "10px 15px",
                color: "#ffffff",
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: "9px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "700",
              }}
            >
              تسجيل الدخول
            </Link>

            <Link
              href="/signup"
              style={{
                padding: "10px 15px",
                color: "#101722",
                backgroundColor: "#e6c563",
                border: "1px solid #e6c563",
                borderRadius: "9px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "800",
              }}
            >
              إنشاء حساب مجاني
            </Link>
          </nav>
        </div>
      </header>

      {/* الواجهة الرئيسية */}
      <section
        style={{
          position: "relative",
          padding: "95px 20px 85px",
          background:
            "radial-gradient(circle at 20% 20%, rgba(230,197,99,0.13), transparent 30%), linear-gradient(135deg, #080d14 0%, #101925 55%, #080d14 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1050px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <span
            style={{
              display: "inline-block",
              marginBottom: "20px",
              padding: "8px 17px",
              color: "#e6c563",
              backgroundColor: "rgba(230,197,99,0.09)",
              border: "1px solid rgba(230,197,99,0.35)",
              borderRadius: "999px",
              fontSize: "14px",
              fontWeight: "700",
            }}
          >
            تعلّم التداول باللغة العربية
          </span>

          <h1
            style={{
              maxWidth: "900px",
              margin: "0 auto 22px",
              color: "#ffffff",
              fontSize: "clamp(38px, 7vw, 68px)",
              lineHeight: "1.25",
              fontWeight: "900",
            }}
          >
            مرحبًا بك في{" "}
            <span style={{ color: "#e6c563" }}>Forex4Ever</span>
          </h1>

          <p
            style={{
              maxWidth: "780px",
              margin: "0 auto 35px",
              color: "#c4ccd7",
              fontSize: "clamp(17px, 2.4vw, 21px)",
              lineHeight: "1.9",
            }}
          >
            منصتك العربية للتعلّم ومتابعة البث المباشر، مع أكاديمية مجانية
            تساعدك على فهم أساسيات التداول والتحليل وإدارة المخاطر بطريقة
            بسيطة ومنظمة.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "13px",
            }}
          >
            <Link
              href="/academy"
              style={{
                display: "inline-block",
                padding: "15px 27px",
                color: "#101722",
                backgroundColor: "#e6c563",
                border: "1px solid #e6c563",
                borderRadius: "10px",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: "900",
              }}
            >
              دخول الأكاديمية مجانًا
            </Link>

            <Link
              href="/signup"
              style={{
                display: "inline-block",
                padding: "15px 27px",
                color: "#ffffff",
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: "10px",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: "800",
              }}
            >
              إنشاء حساب مجاني
            </Link>
          </div>
        </div>
      </section>

      {/* مميزات المنصة */}
      <section
        style={{
          padding: "75px 20px",
          backgroundColor: "#0b111a",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1150px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              maxWidth: "760px",
              margin: "0 auto 42px",
              textAlign: "center",
            }}
          >
            <span
              style={{
                color: "#e6c563",
                fontSize: "14px",
                fontWeight: "800",
              }}
            >
              خدمات Forex4Ever
            </span>

            <h2
              style={{
                margin: "10px 0 15px",
                color: "#ffffff",
                fontSize: "clamp(28px, 5vw, 42px)",
                lineHeight: "1.4",
              }}
            >
              كل ما تحتاجه في مكان واحد
            </h2>

            <p
              style={{
                margin: 0,
                color: "#aeb7c4",
                fontSize: "17px",
                lineHeight: "1.8",
              }}
            >
              محتوى تعليمي عربي وبث مباشر وتجربة سهلة على مختلف الأجهزة.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px",
            }}
          >
            {features.map((feature) => (
              <article
                key={feature.title}
                style={{
                  padding: "30px 24px",
                  backgroundColor: "#101925",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "17px",
                }}
              >
                <div
                  style={{
                    marginBottom: "17px",
                    fontSize: "34px",
                  }}
                >
                  {feature.icon}
                </div>

                <h3
                  style={{
                    margin: "0 0 12px",
                    color: "#e6c563",
                    fontSize: "21px",
                  }}
                >
                  {feature.title}
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "#b7c0cd",
                    fontSize: "15px",
                    lineHeight: "1.9",
                  }}
                >
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* قسم الأكاديمية */}
      <section
        id="academy"
        style={{
          width: "100%",
          padding: "85px 20px",
          boxSizing: "border-box",
          background:
            "linear-gradient(135deg, #101722 0%, #182331 55%, #101722 100%)",
          borderTop: "1px solid rgba(230,197,99,0.23)",
          borderBottom: "1px solid rgba(230,197,99,0.23)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1150px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              maxWidth: "850px",
              margin: "0 auto 38px",
              textAlign: "center",
            }}
          >
            <span
              style={{
                display: "inline-block",
                marginBottom: "15px",
                padding: "7px 15px",
                color: "#e6c563",
                backgroundColor: "rgba(230,197,99,0.1)",
                border: "1px solid rgba(230,197,99,0.35)",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: "800",
              }}
            >
              تعليم عربي مجاني
            </span>

            <h2
              style={{
                margin: "0 0 18px",
                color: "#ffffff",
                fontSize: "clamp(30px, 5vw, 47px)",
                lineHeight: "1.4",
              }}
            >
              أكاديمية{" "}
              <span style={{ color: "#e6c563" }}>Forex4Ever</span>
            </h2>

            <p
              style={{
                margin: 0,
                color: "#cbd3df",
                fontSize: "18px",
                lineHeight: "1.95",
              }}
            >
              تعلّم أساسيات التداول والتحليل الفني وإدارة رأس المال وعلم نفس
              التداول من خلال محتوى عربي منظم، بداية من المستوى المبتدئ وحتى
              بناء خطة تداول احترافية.
            </p>
          </div>

          {/* إحصائيات الأكاديمية */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: "17px",
              marginBottom: "35px",
            }}
          >
            {academyStats.map((item) => (
              <div
                key={item.value}
                style={{
                  padding: "25px 17px",
                  textAlign: "center",
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: "15px",
                }}
              >
                <strong
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#e6c563",
                    fontSize: "22px",
                  }}
                >
                  {item.value}
                </strong>

                <span
                  style={{
                    color: "#c4ccd7",
                    fontSize: "14px",
                    lineHeight: "1.7",
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* محتويات الأكاديمية */}
          <div
            style={{
              maxWidth: "900px",
              margin: "0 auto 35px",
              padding: "28px",
              backgroundColor: "rgba(8,13,20,0.52)",
              border: "1px solid rgba(230,197,99,0.18)",
              borderRadius: "18px",
            }}
          >
            <h3
              style={{
                margin: "0 0 22px",
                color: "#ffffff",
                textAlign: "center",
                fontSize: "24px",
              }}
            >
              ماذا ستتعلم داخل الأكاديمية؟
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "13px",
              }}
            >
              {academyCourses.map((course, index) => (
                <div
                  key={course}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "11px",
                    padding: "14px",
                    color: "#d8dee8",
                    backgroundColor: "rgba(255,255,255,0.035)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "11px",
                    lineHeight: "1.7",
                  }}
                >
                  <span
                    style={{
                      minWidth: "30px",
                      height: "30px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#101722",
                      backgroundColor: "#e6c563",
                      borderRadius: "50%",
                      fontSize: "13px",
                      fontWeight: "900",
                    }}
                  >
                    {index + 1}
                  </span>

                  <span style={{ fontWeight: "700" }}>{course}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <Link
              href="/academy"
              style={{
                display: "inline-block",
                padding: "15px 32px",
                color: "#101722",
                backgroundColor: "#e6c563",
                borderRadius: "10px",
                textDecoration: "none",
                fontSize: "17px",
                fontWeight: "900",
              }}
            >
              افتح صفحة الأكاديمية
            </Link>

            <p
              style={{
                maxWidth: "700px",
                margin: "20px auto 0",
                color: "#8f99a8",
                fontSize: "13px",
                lineHeight: "1.8",
              }}
            >
              المحتوى تعليمي فقط وليس نصيحة استثمارية. التداول ينطوي على
              مخاطر وقد يؤدي إلى خسارة جزء من رأس المال أو كله.
            </p>
          </div>
        </div>
      </section>

      {/* قسم البث المباشر */}
      <section
        style={{
          padding: "80px 20px",
          backgroundColor: "#080d14",
        }}
      >
        <div
          style={{
            maxWidth: "950px",
            margin: "0 auto",
            padding: "45px 25px",
            textAlign: "center",
            backgroundColor: "#101925",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "20px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              marginBottom: "16px",
              color: "#ff6b6b",
              fontSize: "15px",
              fontWeight: "800",
            }}
          >
            ● البث المباشر
          </span>

          <h2
            style={{
              margin: "0 0 15px",
              color: "#ffffff",
              fontSize: "clamp(28px, 5vw, 40px)",
            }}
          >
            تابع بث Forex4Ever
          </h2>

          <p
            style={{
              maxWidth: "680px",
              margin: "0 auto 28px",
              color: "#b8c1ce",
              fontSize: "17px",
              lineHeight: "1.9",
            }}
          >
            أنشئ حسابًا مجانيًا وسجّل الدخول لمشاهدة البث المباشر والمحتوى
            المتاح للمستخدمين المسجلين.
          </p>

          <Link
            href="/live"
            style={{
              display: "inline-block",
              padding: "14px 29px",
              color: "#101722",
              backgroundColor: "#e6c563",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "900",
            }}
          >
            الانتقال إلى البث
          </Link>
        </div>
      </section>

      {/* التذييل */}
      <footer
        style={{
          padding: "35px 20px",
          backgroundColor: "#060a10",
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          style={{
            maxWidth: "1150px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <strong
              style={{
                display: "block",
                marginBottom: "7px",
                color: "#e6c563",
                fontSize: "18px",
              }}
            >
              Forex4Ever
            </strong>

            <span
              style={{
                color: "#8993a1",
                fontSize: "13px",
              }}
            >
              جميع الحقوق محفوظة © 2026
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "17px",
            }}
          >
            <Link
              href="/academy"
              style={{
                color: "#c3cbd6",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              الأكاديمية
            </Link>

            <Link
              href="/live"
              style={{
                color: "#c3cbd6",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              البث المباشر
            </Link>

            <Link
              href="/login"
              style={{
                color: "#c3cbd6",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
