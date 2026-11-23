"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./news.module.css";

const categories = [
  { id: "all", label: "كل الأخبار", icon: "🌐" },
  { id: "economy", label: "الاقتصاد", icon: "📊" },
  { id: "politics", label: "السياسة", icon: "🏛️" },
  { id: "gold", label: "الذهب والمعادن", icon: "🥇" },
  { id: "forex", label: "العملات", icon: "💱" },
  { id: "stocks", label: "البورصات", icon: "📈" },
  { id: "crypto", label: "العملات الرقمية", icon: "₿" },
];

const categoryNames = {
  economy: "اقتصاد",
  politics: "سياسة",
  gold: "ذهب ومعادن",
  forex: "عملات",
  stocks: "بورصات",
  crypto: "عملات رقمية",
};

const impactNames = {
  high: "تأثير مرتفع",
  medium: "تأثير متوسط",
  low: "تأثير منخفض",
};

function formatDate(dateValue) {
  if (!dateValue) {
    return "وقت النشر غير متاح";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "وقت النشر غير متاح";
  }

  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function EconomicCalendar() {
  const widgetRef = useRef(null);

  useEffect(() => {
    if (!widgetRef.current) return;

    const container = widgetRef.current;
    container.innerHTML = "";

    const widgetArea = document.createElement("div");
    widgetArea.className = "tradingview-widget-container__widget";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.async = true;

    script.innerHTML = JSON.stringify({
      colorTheme: "dark",
      isTransparent: true,
      width: "100%",
      height: 650,
      locale: "en",
      importanceFilter: "0,1",
      countryFilter: "us,eu,gb,jp,cn,de,au,ca,ch,nz",
    });

    container.appendChild(widgetArea);
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={widgetRef}
      className={`tradingview-widget-container ${styles.calendarWidget}`}
    />
  );
}

function NewsSkeleton() {
  return (
    <div className={styles.newsGrid}>
      {Array.from({ length: 6 }).map((_, index) => (
        <div className={styles.skeletonCard} key={index}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonLineShort} />
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLineMedium} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadNews = useCallback(async (manualRefresh = false) => {
    if (manualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await fetch("/api/news", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "تعذر تحميل الأخبار.");
      }

      setArticles(Array.isArray(data.articles) ? data.articles : []);
      setUpdatedAt(data.updatedAt || new Date().toISOString());
    } catch (requestError) {
      setError(requestError.message || "تعذر تحميل الأخبار حاليًا.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadNews();

    // تحديث واجهة الأخبار تلقائيًا كل 15 دقيقة.
    const interval = window.setInterval(() => {
      loadNews(true);
    }, 15 * 60 * 1000);

    return () => window.clearInterval(interval);
  }, [loadNews]);

  const filteredArticles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === "all" ||
        article.category === selectedCategory;

      const searchableText =
        `${article.title} ${article.description} ${article.source}`.toLowerCase();

      const matchesSearch =
        !normalizedSearch || searchableText.includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [articles, search, selectedCategory]);

  const highImpactCount = articles.filter(
    (article) => article.impact === "high"
  ).length;

  return (
    <main className={styles.page} dir="rtl">
      <section className={styles.hero}>
        <div className={styles.heroGlowOne} />
        <div className={styles.heroGlowTwo} />

        <div className={styles.heroContent}>
          <span className={styles.liveBadge}>
            <span className={styles.liveDot} />
            أخبار الأسواق
          </span>

          <h1>
            الأخبار الاقتصادية والسياسية
            <span> المؤثرة على التداول</span>
          </h1>

          <p>
            تابع أهم الأخبار المؤثرة على الذهب والعملات والبورصات والعملات
            الرقمية، بالإضافة إلى مواعيد البيانات الاقتصادية المرتقبة.
          </p>

          <div className={styles.heroStats}>
            <div className={styles.statCard}>
              <strong>{articles.length}</strong>
              <span>خبر حالي</span>
            </div>

            <div className={styles.statCard}>
              <strong>{highImpactCount}</strong>
              <span>خبر مرتفع التأثير</span>
            </div>

            <div className={styles.statCard}>
              <strong>15</strong>
              <span>دقيقة للتحديث التلقائي</span>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.eyebrow}>آخر التطورات</span>
              <h2>أهم أخبار الأسواق الآن</h2>

              <p>
                تصنيف تقديري لدرجة تأثير الخبر بناءً على محتواه، وليس توصية
                للتداول.
              </p>
            </div>

            <button
              type="button"
              className={styles.refreshButton}
              onClick={() => loadNews(true)}
              disabled={refreshing}
            >
              <span className={refreshing ? styles.spinning : ""}>↻</span>
              {refreshing ? "جارِ التحديث..." : "تحديث الأخبار"}
            </button>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <span>⌕</span>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ابحث داخل الأخبار..."
                aria-label="البحث داخل الأخبار"
              />
            </div>

            <div className={styles.updateTime}>
              <span className={styles.statusDot} />

              {updatedAt
                ? `آخر فحص: ${formatDate(updatedAt)}`
                : "جارِ فحص آخر الأخبار"}
            </div>
          </div>

          <div className={styles.categories}>
            {categories.map((category) => (
              <button
                type="button"
                key={category.id}
                className={`${styles.categoryButton} ${
                  selectedCategory === category.id ? styles.activeCategory : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span>{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>

          {error && (
            <div className={styles.errorBox}>
              <div>
                <strong>تعذر تحميل الأخبار</strong>
                <p>{error}</p>
              </div>

              <button type="button" onClick={() => loadNews()}>
                المحاولة مرة أخرى
              </button>
            </div>
          )}

          {loading ? (
            <NewsSkeleton />
          ) : filteredArticles.length > 0 ? (
            <div className={styles.newsGrid}>
              {filteredArticles.map((article) => (
                <article className={styles.newsCard} key={article.id}>
                  <div className={styles.imageWrapper}>
                    {article.image ? (
                      <img
                        src={article.image}
                        alt=""
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : null}

                    <div className={styles.imageOverlay} />

                    <span
                      className={`${styles.impactBadge} ${
                        styles[article.impact]
                      }`}
                    >
                      {impactNames[article.impact] || "تأثير غير محدد"}
                    </span>

                    <span className={styles.categoryBadge}>
                      {categoryNames[article.category] || "أسواق"}
                    </span>
                  </div>

                  <div className={styles.cardContent}>
                    <div className={styles.newsMeta}>
                      <span>{article.source}</span>
                      <span>•</span>
                      <time>{formatDate(article.publishedAt)}</time>
                    </div>

                    <h3>{article.title}</h3>

                    <p>{article.description}</p>

                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.readMore}
                    >
                      قراءة الخبر من المصدر
                      <span>←</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span>📰</span>
              <h3>لا توجد نتائج مطابقة</h3>
              <p>جرّب تغيير القسم أو كلمة البحث.</p>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearch("");
                }}
              >
                عرض كل الأخبار
              </button>
            </div>
          )}
        </section>

        <section className={styles.calendarSection}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.eyebrow}>الأخبار المرتقبة</span>
              <h2>التقويم الاقتصادي</h2>

              <p>
                تابع توقيت بيانات التضخم والفائدة والبطالة والناتج المحلي
                وغيرها من البيانات المؤثرة على الأسواق.
              </p>
            </div>

            <div className={styles.calendarNotice}>
              <span>⚠️</span>
              التوقيت المعروض وفق إعداد التقويم والجهاز
            </div>
          </div>

          <div className={styles.calendarCard}>
            <EconomicCalendar />
          </div>
        </section>

        <section className={styles.guideSection}>
          <div className={styles.guideCard}>
            <span className={styles.guideIcon}>🔴</span>
            <div>
              <h3>تأثير مرتفع</h3>
              <p>
                أخبار الفائدة والتضخم والتوظيف والبنوك المركزية والأحداث
                الجيوسياسية المهمة.
              </p>
            </div>
          </div>

          <div className={styles.guideCard}>
            <span className={styles.guideIcon}>🟠</span>
            <div>
              <h3>تأثير متوسط</h3>
              <p>
                أخبار الذهب والنفط والدولار والبورصات والبيانات الاقتصادية
                المتوسطة.
              </p>
            </div>
          </div>

          <div className={styles.guideCard}>
            <span className={styles.guideIcon}>🟢</span>
            <div>
              <h3>تأثير منخفض</h3>
              <p>
                أخبار عامة قد يكون تأثيرها محدودًا أو غير مباشر على حركة
                الأسواق.
              </p>
            </div>
          </div>
        </section>

        <div className={styles.disclaimer}>
          <span>⚠️</span>

          <p>
            <strong>تنبيه مخاطر:</strong> الأخبار والتصنيفات المعروضة لأغراض
            تعليمية وإخبارية فقط، ولا تمثل توصية بشراء أو بيع أي أصل. قد تتأخر
            الأخبار أو بيانات التقويم حسب مزود البيانات. التداول قد يؤدي إلى
            خسارة رأس المال.
          </p>
        </div>
      </div>
    </main>
  );
}
