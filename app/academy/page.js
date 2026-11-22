const courses = [
  {
    number: "01",
    title: "أساسيات التداول",
    description:
      "ابدأ من الصفر وتعرّف على سوق الفوركس، أزواج العملات، وكيفية تنفيذ الصفقات.",
    chapters: [
      {
        title: "الفصل الأول: مقدمة إلى سوق الفوركس",
        content:
          "الفوركس هو سوق عالمي يتم فيه تداول العملات مقابل بعضها، مثل اليورو مقابل الدولار. يعمل السوق على مدار 24 ساعة خلال خمسة أيام أسبوعيًا.",
      },
      {
        title: "الفصل الثاني: أزواج العملات",
        content:
          "كل صفقة فوركس تتضمن شراء عملة وبيع عملة أخرى. تنقسم الأزواج إلى أزواج رئيسية، وأزواج فرعية، وأزواج نادرة.",
      },
      {
        title: "الفصل الثالث: النقطة واللوت",
        content:
          "النقطة هي وحدة قياس حركة السعر، بينما اللوت يعبّر عن حجم الصفقة. يجب اختيار حجم الصفقة بما يتناسب مع رأس المال والمخاطر.",
      },
      {
        title: "الفصل الرابع: أوامر التداول",
        content:
          "توجد أوامر شراء وبيع مباشرة، وأوامر معلقة، وأوامر وقف خسارة وجني أرباح. تساعد هذه الأوامر على تنظيم الصفقة.",
      },
      {
        title: "الفصل الخامس: حساب التداول",
        content:
          "يفضل البدء بحساب تجريبي لفهم منصة التداول وتجربة الأوامر قبل الانتقال إلى حساب حقيقي.",
      },
    ],
  },
  {
    number: "02",
    title: "التحليل الفني",
    description:
      "تعلم قراءة الرسوم البيانية، الاتجاهات، الدعوم والمقاومات، والشموع اليابانية.",
    chapters: [
      {
        title: "الفصل الأول: مفهوم التحليل الفني",
        content:
          "التحليل الفني هو دراسة حركة السعر السابقة بهدف تكوين رؤية عن الاتجاهات والاحتمالات المستقبلية.",
      },
      {
        title: "الفصل الثاني: الاتجاهات",
        content:
          "الاتجاه قد يكون صاعدًا أو هابطًا أو عرضيًا. تحديد الاتجاه يساعد المتداول على تجنب الدخول عكس حركة السوق.",
      },
      {
        title: "الفصل الثالث: الدعم والمقاومة",
        content:
          "الدعم منطقة قد يظهر عندها المشترون، والمقاومة منطقة قد يظهر عندها البائعون. هي مناطق وليست أسعارًا دقيقة دائمًا.",
      },
      {
        title: "الفصل الرابع: الشموع اليابانية",
        content:
          "توضح الشمعة سعر الافتتاح والإغلاق وأعلى وأقل سعر خلال فترة زمنية محددة، وتساعد في فهم سلوك المشترين والبائعين.",
      },
      {
        title: "الفصل الخامس: النماذج الفنية",
        content:
          "النماذج الفنية مثل المثلثات والقنوات والرأس والكتفين تساعد على قراءة حركة السعر، لكنها لا تضمن نتيجة الصفقة.",
      },
    ],
  },
  {
    number: "03",
    title: "إدارة رأس المال والمخاطر",
    description:
      "تعلم حماية رأس المال وتحديد حجم الصفقة واستخدام وقف الخسارة بطريقة صحيحة.",
    chapters: [
      {
        title: "الفصل الأول: مفهوم إدارة المخاطر",
        content:
          "إدارة المخاطر تعني تحديد مقدار الخسارة المقبولة قبل الدخول في الصفقة، وليس محاولة منع الخسارة تمامًا.",
      },
      {
        title: "الفصل الثاني: نسبة المخاطرة",
        content:
          "يفضل أن تكون المخاطرة في الصفقة الواحدة نسبة صغيرة من رأس المال، بحيث لا تؤثر سلسلة خسائر بشكل كبير على الحساب.",
      },
      {
        title: "الفصل الثالث: وقف الخسارة",
        content:
          "وقف الخسارة هو أمر يغلق الصفقة عند وصول السعر إلى مستوى محدد، ويجب وضعه بناءً على التحليل وليس بصورة عشوائية.",
      },
      {
        title: "الفصل الرابع: العائد مقابل المخاطرة",
        content:
          "تقارن هذه النسبة بين الربح المحتمل والخسارة المحتملة. يجب تقييمها قبل فتح الصفقة وليس بعدها.",
      },
      {
        title: "الفصل الخامس: تجنب الإفراط في التداول",
        content:
          "فتح صفقات كثيرة أو استخدام أحجام كبيرة قد يزيد الخسائر. الجودة والانضباط أهم من عدد الصفقات.",
      },
    ],
  },
  {
    number: "04",
    title: "علم نفس التداول",
    description:
      "تعرف على تأثير الخوف والطمع وكيفية بناء الانضباط والالتزام بخطة التداول.",
    chapters: [
      {
        title: "الفصل الأول: المشاعر والتداول",
        content:
          "الخوف والطمع من أكثر المشاعر تأثيرًا على قرارات المتداول، وقد يدفعان إلى إغلاق الصفقة مبكرًا أو المخاطرة الزائدة.",
      },
      {
        title: "الفصل الثاني: الانضباط",
        content:
          "الانضباط يعني تنفيذ خطة التداول والالتزام بشروط الدخول والخروج وإدارة المخاطر دون قرارات عاطفية.",
      },
      {
        title: "الفصل الثالث: تقبل الخسارة",
        content:
          "الخسارة جزء طبيعي من التداول. الهدف ليس الفوز في كل صفقة، بل الحفاظ على رأس المال وتحقيق نتائج متوازنة على المدى الطويل.",
      },
      {
        title: "الفصل الرابع: تجنب الانتقام من السوق",
        content:
          "بعد الخسارة قد يحاول المتداول استرداد المال بسرعة، ما يؤدي إلى صفقات غير مدروسة ومخاطرة أكبر.",
      },
      {
        title: "الفصل الخامس: سجل التداول",
        content:
          "يساعد سجل التداول في توثيق أسباب الدخول والخروج والنتائج والمشاعر، وبالتالي اكتشاف الأخطاء وتحسين الأداء.",
      },
    ],
  },
  {
    number: "05",
    title: "الاقتصاد والتحليل الأساسي",
    description:
      "افهم الأخبار الاقتصادية وأسعار الفائدة والتضخم وتأثيرها المحتمل على العملات.",
    chapters: [
      {
        title: "الفصل الأول: التحليل الأساسي",
        content:
          "يدرس التحليل الأساسي الظروف الاقتصادية والسياسية والمالية التي قد تؤثر على قيمة العملات.",
      },
      {
        title: "الفصل الثاني: أسعار الفائدة",
        content:
          "قرارات البنوك المركزية بشأن أسعار الفائدة قد تؤثر بقوة على العملات، لكن حركة السوق تعتمد أيضًا على توقعات المتداولين.",
      },
      {
        title: "الفصل الثالث: التضخم",
        content:
          "يقيس التضخم ارتفاع أسعار السلع والخدمات. وقد يدفع ارتفاعه البنوك المركزية إلى تغيير سياستها النقدية.",
      },
      {
        title: "الفصل الرابع: بيانات التوظيف",
        content:
          "تقدم بيانات التوظيف مؤشرات عن قوة الاقتصاد، وقد تؤدي النتائج المختلفة عن التوقعات إلى تحركات سريعة في السوق.",
      },
      {
        title: "الفصل الخامس: التقويم الاقتصادي",
        content:
          "يعرض التقويم الاقتصادي مواعيد الأخبار والبيانات المهمة. يجب مراجعته قبل التداول لتجنب المفاجآت والتذبذب المرتفع.",
      },
    ],
  },
  {
    number: "06",
    title: "أساسيات العمل الاحترافي",
    description:
      "تعلم إعداد خطة تداول واختبار الاستراتيجية ومراجعة النتائج بصورة منظمة.",
    chapters: [
      {
        title: "الفصل الأول: خطة التداول",
        content:
          "تحدد الخطة الأسواق التي ستتابعها، وشروط الدخول والخروج، ونسبة المخاطرة، والأوقات المناسبة للتداول.",
      },
      {
        title: "الفصل الثاني: شروط الدخول",
        content:
          "يجب كتابة شروط واضحة للدخول في الصفقة، وتجنب الدخول بسبب الشعور أو الخوف من ضياع الفرصة.",
      },
      {
        title: "الفصل الثالث: اختبار الاستراتيجية",
        content:
          "يمكن مراجعة أداء الاستراتيجية على بيانات سابقة أو حساب تجريبي قبل استخدامها بأموال حقيقية.",
      },
      {
        title: "الفصل الرابع: مراجعة الأداء",
        content:
          "لا تُقيّم الاستراتيجية من صفقة واحدة. راجع مجموعة كافية من الصفقات مع حساب الربح والخسارة والمخاطرة.",
      },
      {
        title: "الفصل الخامس: التطوير المستمر",
        content:
          "التداول يحتاج إلى التعلم والمراجعة والصبر. لا تغيّر الخطة بعد كل خسارة، ولا تتوقف عن تحسين نقاط الضعف.",
      },
    ],
  },
];

export default function AcademyPage() {
  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top right, rgba(233,190,76,0.10), transparent 35%), #09111d",
        color: "#ffffff",
        fontFamily: "Tahoma, Arial, sans-serif",
      }}
    >
      {/* مقدمة الأكاديمية */}
      <section
        style={{
          padding: "80px 20px 60px",
          textAlign: "center",
          borderBottom: "1px solid rgba(233,190,76,0.20)",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <span
            style={{
              display: "inline-block",
              color: "#e9be4c",
              border: "1px solid rgba(233,190,76,0.45)",
              borderRadius: "999px",
              padding: "10px 20px",
              marginBottom: "24px",
              background: "rgba(233,190,76,0.06)",
              fontWeight: "bold",
            }}
          >
            أكاديمية Forex4Ever المجانية
          </span>

          <h1
            style={{
              margin: "0 0 20px",
              fontSize: "clamp(36px, 6vw, 68px)",
              lineHeight: "1.2",
            }}
          >
            تعلّم التداول{" "}
            <span style={{ color: "#e9be4c" }}>خطوة بخطوة</span>
          </h1>

          <p
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              color: "#c8d1df",
              fontSize: "clamp(17px, 2vw, 21px)",
              lineHeight: "2",
            }}
          >
            منهج عربي مجاني يساعدك على فهم أساسيات التداول والتحليل الفني
            وإدارة المخاطر بطريقة بسيطة ومنظمة.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "30px",
            }}
          >
            <span style={statStyle}>6 دورات</span>
            <span style={statStyle}>30 فصلًا</span>
            <span style={statStyle}>محتوى عربي</span>
            <span style={statStyle}>مجاني بالكامل</span>
          </div>
        </div>
      </section>

      {/* الدورات */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "60px 20px",
        }}
      >
        <div style={{ marginBottom: "35px" }}>
          <p
            style={{
              color: "#e9be4c",
              fontWeight: "bold",
              margin: "0 0 10px",
            }}
          >
            المنهج التعليمي
          </p>

          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              margin: "0 0 12px",
            }}
          >
            دورات الأكاديمية
          </h2>

          <p
            style={{
              color: "#aeb9c9",
              lineHeight: "1.9",
              margin: 0,
            }}
          >
            اضغط على أي فصل لقراءة محتواه، ويفضل دراسة الدورات بالترتيب.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {courses.map((course) => (
            <article
              key={course.number}
              style={{
                background: "#101a28",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: "18px",
                padding: "24px",
                boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "18px",
                }}
              >
                <span
                  style={{
                    width: "52px",
                    height: "52px",
                    flexShrink: 0,
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#07101b",
                    background: "#e9be4c",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  {course.number}
                </span>

                <h3
                  style={{
                    margin: 0,
                    fontSize: "23px",
                    lineHeight: "1.5",
                  }}
                >
                  {course.title}
                </h3>
              </div>

              <p
                style={{
                  color: "#b6c0ce",
                  lineHeight: "1.9",
                  minHeight: "68px",
                  margin: "0 0 22px",
                }}
              >
                {course.description}
              </p>

              <div
                style={{
                  display: "grid",
                  gap: "10px",
                }}
              >
                {course.chapters.map((chapter, index) => (
                  <details
                    key={chapter.title}
                    style={{
                      background: "#0b1420",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    <summary
                      style={{
                        cursor: "pointer",
                        padding: "16px",
                        color: "#ffffff",
                        fontWeight: "bold",
                        lineHeight: "1.7",
                      }}
                    >
                      {index + 1}. {chapter.title}
                    </summary>

                    <div
                      style={{
                        padding: "0 16px 18px",
                        color: "#b8c3d2",
                        lineHeight: "2",
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <p style={{ margin: "15px 0 0" }}>
                        {chapter.content}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* تنبيه المخاطر */}
      <section
        style={{
          maxWidth: "1160px",
          margin: "0 auto",
          padding: "0 20px 70px",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(233,190,76,0.35)",
            borderRadius: "18px",
            padding: "25px",
            background: "rgba(233,190,76,0.06)",
          }}
        >
          <h2
            style={{
              color: "#e9be4c",
              margin: "0 0 12px",
              fontSize: "22px",
            }}
          >
            ⚠️ تنبيه مهم بشأن المخاطر
          </h2>

          <p
            style={{
              margin: 0,
              color: "#d5dbe4",
              lineHeight: "2",
            }}
          >
            المحتوى الموجود في الأكاديمية تعليمي فقط ولا يمثل توصية استثمارية.
            تداول العملات والعقود مقابل الفروقات ينطوي على مخاطر مرتفعة وقد
            يؤدي إلى خسارة رأس المال. استخدم حسابًا تجريبيًا وتأكد من فهم
            المخاطر قبل التداول بأموال حقيقية.
          </p>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "35px",
          }}
        >
          <a
            href="/"
            style={{
              display: "inline-block",
              padding: "14px 28px",
              borderRadius: "10px",
              background: "#e9be4c",
              color: "#07101b",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            العودة إلى الصفحة الرئيسية
          </a>
        </div>
      </section>
    </main>
  );
}

const statStyle = {
  display: "inline-block",
  padding: "10px 16px",
  borderRadius: "10px",
  background: "#111c2b",
  border: "1px solid rgba(255,255,255,0.10)",
  color: "#dce3ec",
  fontWeight: "bold",
};
