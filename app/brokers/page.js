import Link from "next/link";
import styles from "./tmgm.module.css";

export const metadata = {
  title: "شركة TMGM | دليل شركات Forex4Ever",
  description:
    "تعرف على شركة TMGM ومنصات التداول والحسابات والأدوات المتاحة والمعلومات التنظيمية قبل فتح حساب تداول.",
};

const OPEN_ACCOUNT_URL = "";

const platforms = [
  {
    icon: "MT4",
    title: "MetaTrader 4",
    description:
      "منصة تداول شهيرة توفر الرسوم البيانية والمؤشرات الفنية والمستشارين الآليين وأدوات تنفيذ الأوامر.",
  },
  {
    icon: "MT5",
    title: "MetaTrader 5",
    description:
      "منصة متعددة الأصول بإمكانات تحليلية متقدمة وأطر زمنية وأدوات إضافية مقارنة بالجيل السابق.",
  },
  {
    icon: "WEB",
    title: "التداول عبر الويب",
    description:
      "قد تتوفر إمكانية الوصول إلى الحساب والتداول عبر المتصفح حسب المنصة والكيان التابع له العميل.",
  },
  {
    icon: "APP",
    title: "تطبيقات الهاتف",
    description:
      "تدعم منصات MetaTrader التداول وإدارة الصفقات من أجهزة Android وiPhone.",
  },
];

const markets = [
  {
    icon: "💱",
    title: "الفوركس",
    description:
      "تداول عقود الفروقات على أزواج العملات الرئيسية والثانوية، بحسب الكيان والمنطقة.",
  },
  {
    icon: "🥇",
    title: "المعادن",
    description:
      "أدوات مرتبطة بالذهب والفضة ومعادن أخرى وفق قائمة المنتجات المتاحة.",
  },
  {
    icon: "📊",
    title: "المؤشرات",
    description:
      "الوصول إلى عقود فروقات مرتبطة بعدد من مؤشرات الأسواق العالمية.",
  },
  {
    icon: "🛢️",
    title: "الطاقة",
    description:
      "أدوات مرتبطة بالنفط ومنتجات الطاقة، مع اختلاف ساعات التداول وشروط العقود.",
  },
  {
    icon: "🏢",
    title: "الأسهم",
    description:
      "قد تتوفر عقود فروقات على أسهم عالمية وفق الكيان والمنصة ونوع الحساب.",
  },
  {
    icon: "₿",
    title: "الأصول الرقمية",
    description:
      "قد تتوفر بعض عقود فروقات الأصول الرقمية في دول محددة، مع قيود تنظيمية محتملة.",
  },
];

const advantages = [
  "توفير منصات MetaTrader المعروفة على نطاق واسع.",
  "الوصول إلى أكثر من فئة من الأسواق والأدوات المالية.",
  "توفر موقع رسمي باللغة العربية.",
  "إمكانية استخدام حساب تجريبي وفق شروط الشركة.",
  "أدوات تحليل ورسوم بيانية وتداول آلي عبر المنصات المدعومة.",
  "إمكانية التداول من الكمبيوتر والهاتف.",
];

const considerations = [
  "الخدمات والرافعة المالية والحماية التنظيمية تختلف حسب بلد الإقامة.",
  "يجب التأكد من اسم الكيان القانوني الذي سيتم فتح الحساب من خلاله.",
  "السبريد والعمولات قد تختلف حسب الحساب والأداة ووقت التداول.",
  "عقود الفروقات منتجات عالية المخاطر وقد تؤدي إلى خسارة رأس المال.",
  "بعض الأدوات أو طرق الدفع قد لا تكون متاحة في جميع الدول.",
  "يجب مراجعة رسوم السحب والتحويل وعدم النشاط من المستندات الرسمية.",
];

const accountTypes = [
  {
    title: "حساب تجريبي",
    badge: "للتدريب",
    description:
      "يساعد على تجربة المنصة والتعرف على طريقة تنفيذ الأوامر باستخدام رصيد افتراضي، دون تعريض أموال حقيقية للمخاطر.",
  },
  {
    title: "حساب Classic",
    badge: "حسب التوفر",
    description:
      "حساب قد يعتمد بصورة أساسية على فروق الأسعار. يجب مراجعة شروط السبريد والتنفيذ الخاصة بالكيان الذي تتعامل معه.",
  },
  {
    title: "حساب Edge",
    badge: "حسب التوفر",
    description:
      "حساب قد يقدم فروق أسعار أقل مقابل عمولة تداول منفصلة. قيمة العمولة والشروط يجب تأكيدها من الشركة.",
  },
  {
    title: "حساب إسلامي",
    badge: "وفق الشروط",
    description:
      "قد يتوفر خيار متوافق مع أحكام التداول دون فوائد تبييت تقليدية، لكن قد تطبق رسوم وشروط بديلة.",
  },
];

const quickFacts = [
  ["اسم الشركة التجاري", "TMGM"],
  ["نوع الخدمات", "وساطة وتداول عقود الفروقات"],
  ["الحساب التجريبي", "قد يكون متاحًا"],
  ["منصات التداول", "MetaTrader 4 وMetaTrader 5"],
  ["لغة الموقع", "تتضمن اللغة العربية"],
  ["الرافعة المالية", "تختلف حسب الكيان وبلد العميل"],
  ["الحد الأدنى للإيداع", "يجب تأكيده من صفحة التسجيل الرسمية"],
  ["فتح الحساب", "غير متاح من Forex4Ever حاليًا"],
];

function AccountButton({ className = "" }) {
  if (OPEN_ACCOUNT_URL) {
    return (
      <a
        href={OPEN_ACCOUNT_URL}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className={`${styles.primaryButton} ${className}`}
      >
        فتح حساب لدى TMGM
        <span aria-hidden="true">←</span>
      </a>
    );
  }

  return (
    <span
      className={`${styles.primaryButton} ${styles.disabledButton} ${className}`}
      aria-disabled="true"
      title="سيتم تفعيل رابط فتح الحساب لاحقًا"
    >
      فتح حساب — الرابط قريبًا
    </span>
  );
}

export default function TmgmPage() {
  return (
    <main className={styles.page} dir="rtl">
      <div className={styles.backgroundGlowOne} />
      <div className={styles.backgroundGlowTwo} />

      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="مسار التنقل">
          <Link href="/">الرئيسية</Link>
          <span>/</span>
          <Link href="/brokers">دليل الشركات</Link>
          <span>/</span>
          <span>TMGM</span>
        </nav>

        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.companyHeading}>
              <div className={styles.companyLogo} aria-label="TMGM">
                <span>TMGM</span>
              </div>

              <div>
                <span className={styles.eyebrow}>دليل شركات التداول</span>
                <h1>شركة TMGM</h1>

                <div className={styles.tags}>
                  <span>وسيط عقود فروقات</span>
                  <span>منصات MetaTrader</span>
                  <span>حساب تجريبي</span>
                </div>
              </div>
            </div>

            <p className={styles.heroDescription}>
              ملف تعريفي عن شركة TMGM يوضح منصات التداول وأنواع الحسابات
              والأسواق المتاحة والنقاط المهمة التي ينبغي مراجعتها قبل اتخاذ
              قرار فتح حساب.
            </p>

            <div className={styles.heroActions}>
              <AccountButton />

              <a
                href="https://www.tmgm.com/ar"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className={styles.secondaryButton}
              >
                زيارة الموقع الرسمي
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            <p className={styles.linkNotice}>
              زر فتح الحساب غير مفعّل حاليًا لعدم إضافة رابط فتح الحساب.
            </p>
          </div>

          <aside className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <div>
                <span>نظرة سريعة</span>
                <h2>معلومات TMGM</h2>
              </div>
              <span className={styles.infoBadge}>ملف تعريفي</span>
            </div>

            <div className={styles.summaryRows}>
              {quickFacts.slice(0, 6).map(([label, value]) => (
                <div className={styles.summaryRow} key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <div className={styles.summaryWarning}>
              <span aria-hidden="true">!</span>
              <p>
                لا يوجد تقييم رقمي للشركة في هذه الصفحة، ولا نضمن الأرباح أو
                سلامة أي استثمار.
              </p>
            </div>
          </aside>
        </section>

        <section className={styles.notice}>
          <div className={styles.noticeIcon}>⚠</div>
          <div>
            <h2>معلومة مهمة قبل التسجيل</h2>
            <p>
              قد تعمل العلامة التجارية من خلال كيانات قانونية متعددة. الجهة
              الرقابية والحماية المتاحة والرافعة المالية وشروط الحساب تعتمد
              على بلدك والكيان الذي يحوَّل إليه طلب التسجيل.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>عن الشركة</span>
            <h2>نبذة عن TMGM</h2>
            <p>
              TMGM علامة تقدم خدمات الوصول إلى الأسواق وتداول عقود الفروقات
              من خلال منصات إلكترونية. توفر الشركة أدوات مالية متعددة، لكن
              توافر كل أداة وشروطها يختلف حسب الكيان القانوني والمنطقة.
            </p>
          </div>

          <div className={styles.aboutGrid}>
            <article className={styles.textCard}>
              <h3>ماذا تقدم الشركة؟</h3>
              <p>
                تركز خدمات الشركة على تداول المنتجات ذات الرافعة المالية، مثل
                عقود الفروقات على العملات والمعادن والمؤشرات والطاقة وغيرها
                من الأدوات المتاحة.
              </p>
              <p>
                هذه المنتجات لا تعني عادةً امتلاك الأصل الأساسي، كما أن
                الرافعة المالية قد تضخم الأرباح والخسائر معًا.
              </p>
            </article>

            <article className={styles.textCard}>
              <h3>لمن قد تكون مناسبة؟</h3>
              <p>
                قد تكون مناسبة للمتداول الذي يفهم طبيعة عقود الفروقات، ويعرف
                كيفية استخدام أوامر وقف الخسارة وإدارة حجم الصفقة والمخاطر.
              </p>
              <p>
                لا ينبغي الاعتماد على الحساب التجريبي وحده لتقدير نتائج
                التداول الحقيقي، لأن التنفيذ والانزلاق والحالة النفسية تختلف.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>معلومات الحساب</span>
            <h2>ملخص بيانات الشركة</h2>
            <p>
              بعض القيم تتغير حسب الدولة والكيان، لذلك تجنبنا وضع أرقام ثابتة
              قد تصبح قديمة أو لا تنطبق على حسابك.
            </p>
          </div>

          <div className={styles.factsTable}>
            {quickFacts.map(([label, value]) => (
              <div className={styles.factRow} key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>منصات التداول</span>
            <h2>المنصات وطرق الوصول</h2>
            <p>
              تحقق من المنصة المتاحة لنوع حسابك قبل الإيداع، فقد تختلف المنتجات
              بين منصة وأخرى.
            </p>
          </div>

          <div className={styles.platformGrid}>
            {platforms.map((platform) => (
              <article className={styles.platformCard} key={platform.title}>
                <div className={styles.platformIcon}>{platform.icon}</div>
                <h3>{platform.title}</h3>
                <p>{platform.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>أنواع الحسابات</span>
            <h2>الحسابات المحتمل توفرها</h2>
            <p>
              أسماء الحسابات وشروطها يمكن أن تتغير. راجع عقد العميل وجدول
              الرسوم قبل التسجيل أو الإيداع.
            </p>
          </div>

          <div className={styles.accountsGrid}>
            {accountTypes.map((account) => (
              <article className={styles.accountCard} key={account.title}>
                <div className={styles.accountTitle}>
                  <h3>{account.title}</h3>
                  <span>{account.badge}</span>
                </div>
                <p>{account.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>الأسواق</span>
            <h2>الأدوات المالية المتاحة</h2>
            <p>
              لا تتوفر كل الأدوات في جميع الدول، وقد تختلف ساعات التداول
              ومتطلبات الهامش من أداة إلى أخرى.
            </p>
          </div>

          <div className={styles.marketsGrid}>
            {markets.map((market) => (
              <article className={styles.marketCard} key={market.title}>
                <div className={styles.marketIcon}>{market.icon}</div>
                <div>
                  <h3>{market.title}</h3>
                  <p>{market.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>التنظيم والحماية</span>
            <h2>مراجعة الترخيص والكيان القانوني</h2>
            <p>
              تعرض TMGM خدماتها من خلال كيانات قد تخضع لجهات رقابية مختلفة.
              يجب التحقق من الكيان الذي سيحمل حسابك قبل إرسال المستندات أو
              الأموال.
            </p>
          </div>

          <div className={styles.regulationGrid}>
            <article className={styles.regulationCard}>
              <span className={styles.regulationNumber}>01</span>
              <h3>حدد اسم الكيان</h3>
              <p>
                اقرأ اسم الشركة القانوني الظاهر في نموذج التسجيل واتفاقية
                العميل، وليس الاسم التجاري فقط.
              </p>
            </article>

            <article className={styles.regulationCard}>
              <span className={styles.regulationNumber}>02</span>
              <h3>تحقق من الترخيص</h3>
              <p>
                ابحث عن اسم الكيان ورقم الترخيص مباشرةً في سجل الجهة الرقابية
                الرسمية ولا تعتمد على صورة الترخيص وحدها.
              </p>
            </article>

            <article className={styles.regulationCard}>
              <span className={styles.regulationNumber}>03</span>
              <h3>افهم الحماية المتاحة</h3>
              <p>
                فصل أموال العملاء أو حماية الرصيد السالب أو برامج التعويض ليست
                متماثلة لدى كل الجهات والكيانات.
              </p>
            </article>
          </div>

          <div className={styles.verificationBox}>
            <div>
              <strong>لماذا لم نضع حكمًا نهائيًا على الترخيص؟</strong>
              <p>
                لأن الكيان الذي يستقبل العميل يمكن أن يختلف حسب الدولة. يجب
                مطابقة بيانات حسابك مع السجل الرقابي والمستندات الرسمية وقت
                التسجيل.
              </p>
            </div>

            <a
              href="https://www.tmgm.com/ar"
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              مراجعة الموقع الرسمي
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>التكاليف</span>
            <h2>السبريد والعمولات والإيداع</h2>
          </div>

          <div className={styles.costGrid}>
            <article className={styles.costCard}>
              <span>01</span>
              <h3>فروق الأسعار</h3>
              <p>
                السبريد متغير وقد يتسع أثناء الأخبار أو ضعف السيولة أو افتتاح
                وإغلاق الأسواق.
              </p>
            </article>

            <article className={styles.costCard}>
              <span>02</span>
              <h3>عمولة التداول</h3>
              <p>
                قد تطبق عمولة منفصلة في بعض الحسابات ذات فروق الأسعار الأقل.
                راجع قيمة العمولة لكل عقد.
              </p>
            </article>

            <article className={styles.costCard}>
              <span>03</span>
              <h3>رسوم التبييت</h3>
              <p>
                قد تطبق تكاليف على الصفقات المفتوحة بعد نهاية يوم التداول،
                وتختلف حسب الأداة واتجاه الصفقة.
              </p>
            </article>

            <article className={styles.costCard}>
              <span>04</span>
              <h3>الإيداع والسحب</h3>
              <p>
                طرق الدفع والمدة والرسوم والعملات المدعومة تعتمد على الدولة
                ومزود الدفع والبنك المستخدم.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.twoColumns}>
            <article className={`${styles.listCard} ${styles.advantagesCard}`}>
              <div className={styles.listHeading}>
                <span className={styles.goodIcon}>✓</span>
                <div>
                  <span>نقاط إيجابية</span>
                  <h2>المميزات العامة</h2>
                </div>
              </div>

              <ul>
                {advantages.map((item) => (
                  <li key={item}>
                    <span>✓</span>
                    <p>{item}</p>
                  </li>
                ))}
              </ul>
            </article>

            <article className={`${styles.listCard} ${styles.warningCard}`}>
              <div className={styles.listHeading}>
                <span className={styles.warningIcon}>!</span>
                <div>
                  <span>قبل اتخاذ القرار</span>
                  <h2>نقاط يجب الانتباه لها</h2>
                </div>
              </div>

              <ul>
                {considerations.map((item) => (
                  <li key={item}>
                    <span>!</span>
                    <p>{item}</p>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className={styles.checklist}>
          <div className={styles.checklistContent}>
            <span className={styles.sectionLabel}>قبل فتح الحساب</span>
            <h2>قائمة تحقق سريعة</h2>

            <div className={styles.checkItems}>
              <div>
                <span>1</span>
                <p>تحقق من اسم الكيان ورقم الترخيص في السجل الرسمي.</p>
              </div>
              <div>
                <span>2</span>
                <p>اقرأ اتفاقية العميل وسياسة التنفيذ والسحب.</p>
              </div>
              <div>
                <span>3</span>
                <p>تأكد من السبريد والعمولة ورسوم التبييت.</p>
              </div>
              <div>
                <span>4</span>
                <p>ابدأ بحساب تجريبي ثم بمبلغ يمكنك تحمل خسارته.</p>
              </div>
            </div>
          </div>

          <div className={styles.checklistAction}>
            <p>رابط فتح الحساب لم تتم إضافته بعد.</p>
            <AccountButton />
            <a
              href="https://www.tmgm.com/ar"
              target="_blank"
              rel="nofollow noopener noreferrer"
              className={styles.textLink}
            >
              زيارة موقع TMGM الرسمي
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section className={styles.disclosure}>
          <h2>الإفصاح وتنبيه المخاطر</h2>

          <p>
            هذه الصفحة تعريفية وليست توصية بالاستثمار أو نصيحة مالية، ولا تمثل
            مراجعة قانونية شاملة للشركة. يجب التأكد من المعلومات والشروط
            مباشرة من TMGM والجهة الرقابية المختصة قبل فتح الحساب.
          </p>

          <p>
            تداول الفوركس وعقود الفروقات باستخدام الرافعة المالية ينطوي على
            مخاطر مرتفعة، وقد تخسر جزءًا كبيرًا من رأس المال أو كامل رأس المال
            المخصص للتداول. النتائج السابقة والحسابات التجريبية لا تضمن نتائج
            مستقبلية.
          </p>

          <p>
            لا يوجد حاليًا رابط إحالة مضاف إلى زر فتح الحساب. إذا أضيف رابط
            إحالة مستقبلًا، يجب توضيح أن Forex4Ever قد يحصل على عمولة دون تكلفة
            إضافية مباشرة على المستخدم، إن كان ذلك ينطبق.
          </p>
        </section>

        <footer className={styles.pageFooter}>
          <div>
            <strong>Forex4Ever</strong>
            <p>دليل تعريفي يساعدك على البحث والمقارنة قبل اتخاذ القرار.</p>
          </div>

          <div className={styles.footerLinks}>
            <Link href="/brokers">جميع الشركات</Link>
            <a
              href="https://www.tmgm.com/ar"
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              الموقع الرسمي
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
