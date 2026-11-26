const option = (id, label, icon = "◈") => ({ id, label, icon });

const rawWorlds = [
  {
    id: "market-city",
    name: "مدينة السوق",
    subtitle: "ابدأ رحلتك وافهم حركة الأسعار",
    icon: "🏙️",
    color: "#42d9ff",
    badge: {
      id: "market-explorer",
      name: "مستكشف السوق",
      icon: "🧭",
    },
    stages: [
      {
        title: "بوابة الشراء والبيع",
        kind: "choice",
        lesson:
          "الشراء يعني أنك تتوقع ارتفاع السعر، والبيع يعني أنك تتوقع انخفاضه.",
        prompt: "السعر يصنع قممًا وقيعانًا أعلى بوضوح. ما القرار التعليمي الأنسب؟",
        options: [
          option("buy", "البحث عن فرصة شراء من منطقة مناسبة", "📈"),
          option("sell", "البيع فورًا ضد الاتجاه", "📉"),
          option("random", "الدخول عشوائيًا", "🎲"),
        ],
        answer: "buy",
        explanation:
          "الاتجاه الصاعد يدعم البحث عن فرص شراء مدروسة، وليس الدخول العشوائي.",
      },
      {
        title: "مراقب حركة السعر",
        kind: "zone",
        lesson:
          "أفضل قرار أحيانًا هو الانتظار حتى يصل السعر إلى منطقة واضحة.",
        prompt: "اضغط المنطقة التي يمكن مراقبتها كدعم تعليمي.",
        pattern: "bullish",
        zones: [
          { id: "resistance", label: "المنطقة العليا", position: "top" },
          { id: "middle", label: "منتصف الحركة", position: "middle" },
          { id: "support", label: "منطقة الدعم", position: "bottom" },
        ],
        answer: "support",
        explanation:
          "المنطقة السفلية تمثل دعمًا تعليميًا محتملًا يمكن مراقبة رد فعل السعر عنده.",
      },
      {
        title: "خطة ما قبل الدخول",
        kind: "sequence",
        lesson:
          "الصفقة المنظمة تبدأ بالتحليل ثم تحديد المخاطرة قبل تنفيذ القرار.",
        prompt: "رتّب الخطوات بالضغط عليها واحدة بعد الأخرى.",
        items: [
          { id: "risk", label: "تحديد المخاطرة" },
          { id: "trend", label: "فهم الاتجاه" },
          { id: "entry", label: "تحديد الدخول والوقف" },
          { id: "execute", label: "تنفيذ القرار" },
        ],
        answer: ["trend", "risk", "entry", "execute"],
        explanation:
          "افهم السوق أولًا، ثم حدد المخاطرة، وبعدها خطط للدخول والوقف قبل التنفيذ.",
      },
      {
        title: "ميزان المخاطرة الأول",
        kind: "slider",
        lesson:
          "المخاطرة الصغيرة تساعد على حماية الرصيد عند تكرار الخسائر.",
        prompt: "اختر نسبة المخاطرة التعليمية المناسبة للصفقة.",
        min: 0,
        max: 5,
        step: 0.5,
        initial: 3,
        answer: 1,
        tolerance: 0.25,
        unit: "%",
        explanation:
          "في هذا التحدي، 1% هي النسبة التعليمية المطلوبة لحماية الرصيد.",
      },
      {
        title: "حارس بوابة السوق",
        kind: "scenario",
        lesson:
          "عدم وضوح السوق سبب كافٍ للانتظار، ولا توجد ضرورة للدخول دائمًا.",
        prompt:
          "الحركة متذبذبة، ولا يوجد اتجاه أو منطقة دخول واضحة. ماذا تفعل؟",
        options: [
          option("wait", "أنتظر حتى تظهر فرصة واضحة", "⏳"),
          option("buy", "أشتري بسبب الملل", "🟢"),
          option("revenge", "أدخل بحجم كبير لتعويض الوقت", "🔥"),
        ],
        answer: "wait",
        explanation:
          "الانتظار قرار تداول حقيقي، ويحميك من الدخول في حركة غير واضحة.",
        boss: true,
      },
    ],
  },

  {
    id: "candle-forest",
    name: "غابة الشموع",
    subtitle: "تعلّم قراءة قصة كل شمعة",
    icon: "🕯️",
    color: "#a78bfa",
    badge: {
      id: "candle-reader",
      name: "قارئ الشموع",
      icon: "🕯️",
    },
    stages: [
      {
        title: "الشمعة الصاعدة",
        kind: "choice",
        lesson:
          "الشمعة الصاعدة تغلق عادةً أعلى من سعر افتتاحها.",
        prompt: "أي وصف يمثل شمعة صاعدة؟",
        options: [
          option("bull", "الإغلاق أعلى من الافتتاح", "🟢"),
          option("bear", "الإغلاق أقل من الافتتاح", "🔴"),
          option("none", "لا يوجد افتتاح أو إغلاق", "⚪"),
        ],
        answer: "bull",
        explanation:
          "عندما يكون الإغلاق أعلى من الافتتاح تكون الشمعة صاعدة.",
      },
      {
        title: "شمعة الرفض",
        kind: "zone",
        lesson:
          "الذيل الطويل قد يوضح أن السعر تحرك نحو منطقة ثم رُفض منها.",
        prompt: "اضغط المنطقة التي ظهر منها رفض سعري علوي.",
        pattern: "rejection",
        zones: [
          { id: "upper-wick", label: "الذيل العلوي", position: "top" },
          { id: "body", label: "جسم الشمعة", position: "middle" },
          { id: "lower", label: "المنطقة السفلية", position: "bottom" },
        ],
        answer: "upper-wick",
        explanation:
          "الذيل العلوي الطويل يوضح أن السعر صعد ثم واجه ضغطًا أعاده للأسفل.",
      },
      {
        title: "بناء الشمعة",
        kind: "sequence",
        lesson:
          "قراءة الشمعة تعتمد على الافتتاح والقمة والقاع والإغلاق.",
        prompt: "رتّب رحلة شمعة صاعدة في هذا المثال.",
        items: [
          { id: "high", label: "تسجيل القمة" },
          { id: "open", label: "الافتتاح" },
          { id: "close", label: "الإغلاق أعلى" },
          { id: "low", label: "اختبار القاع" },
        ],
        answer: ["open", "low", "high", "close"],
        explanation:
          "بدأت الشمعة بالافتتاح، اختبرت القاع، تحركت إلى القمة ثم أغلقت أعلى.",
      },
      {
        title: "قوة جسم الشمعة",
        kind: "slider",
        lesson:
          "الجسم الأكبر قد يعكس حركة أقوى، لكنه لا يكفي وحده لاتخاذ قرار.",
        prompt: "اضبط قوة جسم الشمعة المطلوبة في التحدي.",
        min: 10,
        max: 100,
        step: 10,
        initial: 30,
        answer: 70,
        tolerance: 1,
        unit: "%",
        explanation:
          "القيمة المطلوبة هي 70%، مع ضرورة قراءة موقع الشمعة والسياق أيضًا.",
      },
      {
        title: "وحش الشمعة الواحدة",
        kind: "scenario",
        lesson:
          "لا يجب بناء قرار كامل على شمعة منفردة دون سياق أو تأكيد.",
        prompt:
          "ظهرت شمعة صاعدة كبيرة بعد حركة عشوائية مباشرة. ماذا تفعل؟",
        options: [
          option("confirm", "أنتظر السياق والتأكيد", "🔍"),
          option("all-in", "أدخل بكل الرصيد", "💥"),
          option("chase", "أطارد السعر فورًا", "🏃"),
        ],
        answer: "confirm",
        explanation:
          "الشمعة وحدها لا تكفي؛ الاتجاه والمنطقة والمخاطرة عوامل أساسية.",
        boss: true,
      },
    ],
  },

  {
    id: "levels-castle",
    name: "قلعة الدعم والمقاومة",
    subtitle: "اكتشف مناطق تفاعل السعر",
    icon: "🏰",
    color: "#ff9f43",
    badge: {
      id: "level-hunter",
      name: "صائد المناطق",
      icon: "🏰",
    },
    stages: [
      {
        title: "سر الدعم",
        kind: "choice",
        lesson:
          "الدعم منطقة ظهر بالقرب منها طلب أو ارتداد سعري سابق.",
        prompt: "ماذا تتوقع عند عودة السعر إلى دعم واضح؟",
        options: [
          option("observe", "أراقب رد فعل السعر", "👁️"),
          option("guaranteed", "أعتبر الارتداد مضمونًا", "✅"),
          option("ignore", "أتجاهل إدارة المخاطر", "🚫"),
        ],
        answer: "observe",
        explanation:
          "الدعم منطقة مراقبة وليس ضمانًا، وقد يرتد السعر أو يكسرها.",
      },
      {
        title: "اكتشاف المقاومة",
        kind: "zone",
        lesson:
          "المقاومة منطقة علوية تراجع السعر من قربها سابقًا.",
        prompt: "اضغط منطقة المقاومة على الرسم.",
        pattern: "range",
        zones: [
          { id: "resistance", label: "المقاومة", position: "top" },
          { id: "noise", label: "منطقة عشوائية", position: "middle" },
          { id: "support", label: "الدعم", position: "bottom" },
        ],
        answer: "resistance",
        explanation:
          "المنطقة العليا تمثل مقاومة لأن السعر تراجع منها أكثر من مرة.",
      },
      {
        title: "خريطة المناطق",
        kind: "sequence",
        lesson:
          "تحديد المنطقة يسبق انتظار رد الفعل ثم التخطيط للقرار.",
        prompt: "رتّب خطوات التعامل مع منطقة سعرية.",
        items: [
          { id: "reaction", label: "انتظار رد الفعل" },
          { id: "zone", label: "تحديد المنطقة" },
          { id: "risk", label: "حساب المخاطرة" },
          { id: "decision", label: "اتخاذ القرار" },
        ],
        answer: ["zone", "reaction", "risk", "decision"],
        explanation:
          "حدد المنطقة، وانتظر تفاعل السعر، ثم احسب المخاطرة قبل القرار.",
      },
      {
        title: "قوة المنطقة",
        kind: "slider",
        lesson:
          "تكرار التفاعل قد يزيد أهمية المنطقة، دون جعلها مضمونة.",
        prompt: "اختر عدد مرات التفاعل المطلوب في هذا المثال.",
        min: 1,
        max: 6,
        step: 1,
        initial: 1,
        answer: 3,
        tolerance: 0,
        unit: " تفاعلات",
        explanation:
          "التحدي يطلب ثلاثة تفاعلات واضحة لتحديد المنطقة التعليمية.",
      },
      {
        title: "معركة الكسر الكاذب",
        kind: "scenario",
        lesson:
          "اختراق المنطقة للحظات ثم العودة داخلها قد يكون كسرًا كاذبًا.",
        prompt:
          "اخترق السعر المقاومة ثم عاد وأغلق أسفلها سريعًا. ما التصرف الأفضل؟",
        options: [
          option("wait", "أنتظر تأكيدًا إضافيًا", "⏳"),
          option("chase", "أطارد الاختراق فورًا", "🚀"),
          option("double", "أضاعف حجم الصفقة", "✖️"),
        ],
        answer: "wait",
        explanation:
          "العودة أسفل المقاومة علامة تستحق الحذر وانتظار تأكيد جديد.",
        boss: true,
      },
    ],
  },

  {
    id: "trend-kingdom",
    name: "مملكة الاتجاهات",
    subtitle: "اكتشف المسار العام للسوق",
    icon: "📈",
    color: "#48e0a4",
    badge: {
      id: "trend-hunter",
      name: "صائد الاتجاه",
      icon: "📈",
    },
    stages: [
      {
        title: "الاتجاه الصاعد",
        kind: "choice",
        lesson:
          "الاتجاه الصاعد يتكون عادةً من قمم أعلى وقيعان أعلى.",
        prompt: "أي وصف يشير إلى اتجاه صاعد؟",
        options: [
          option("up", "قمم أعلى وقيعان أعلى", "↗️"),
          option("down", "قمم أدنى وقيعان أدنى", "↘️"),
          option("random", "حركة بلا بنية واضحة", "〰️"),
        ],
        answer: "up",
        explanation:
          "تتابع القمم والقيعان الأعلى هو البنية الأساسية للاتجاه الصاعد.",
      },
      {
        title: "حدد مسار السوق",
        kind: "zone",
        lesson:
          "الاتجاه يُقرأ من الحركة الكاملة، وليس من شمعة واحدة.",
        prompt: "اضغط الجزء الذي يمثل استمرار الاتجاه الصاعد.",
        pattern: "trend",
        zones: [
          { id: "continuation", label: "قمة أعلى", position: "top" },
          { id: "noise", label: "ذبذبة وسطية", position: "middle" },
          { id: "break", label: "كسر القاع", position: "bottom" },
        ],
        answer: "continuation",
        explanation:
          "تكوين قمة أعلى مع الحفاظ على القاع يدعم استمرار الاتجاه.",
      },
      {
        title: "صناعة الاتجاه",
        kind: "sequence",
        lesson:
          "تحديد الاتجاه يبدأ بمراقبة القيعان والقمم المتتابعة.",
        prompt: "رتّب خطوات قراءة اتجاه صاعد.",
        items: [
          { id: "decision", label: "البحث عن قرار مناسب" },
          { id: "lows", label: "مقارنة القيعان" },
          { id: "highs", label: "مقارنة القمم" },
          { id: "confirm", label: "تأكيد البنية" },
        ],
        answer: ["lows", "highs", "confirm", "decision"],
        explanation:
          "قارن القيعان والقمم، أكد بنية الاتجاه، ثم ابحث عن قرار مناسب.",
      },
      {
        title: "مقياس وضوح الاتجاه",
        kind: "slider",
        lesson:
          "إذا كان الاتجاه غير واضح، لا حاجة لإجبار السوق على إعطائك قرارًا.",
        prompt: "اضبط درجة الوضوح المطلوبة في المهمة.",
        min: 0,
        max: 100,
        step: 10,
        initial: 40,
        answer: 80,
        tolerance: 1,
        unit: "%",
        explanation:
          "المهمة تطلب وضوحًا بمقدار 80% قبل الانتقال إلى التخطيط.",
      },
      {
        title: "تنين عكس الاتجاه",
        kind: "scenario",
        lesson:
          "محاولة اصطياد القمة أو القاع دون تأكيد قد تكون شديدة الخطورة.",
        prompt:
          "السوق صاعد بقوة، لكنك تشعر فقط أنه ارتفع كثيرًا. ماذا تفعل؟",
        options: [
          option("evidence", "أنتظر دليلًا على تغير الاتجاه", "🔎"),
          option("sell", "أبيع بسبب الشعور فقط", "🔴"),
          option("max", "أبيع بأقصى حجم", "💣"),
        ],
        answer: "evidence",
        explanation:
          "الشعور وحده ليس دليلًا، وانتظار تغير البنية أكثر انضباطًا.",
        boss: true,
      },
    ],
  },

  {
    id: "risk-island",
    name: "جزيرة إدارة المخاطر",
    subtitle: "احمِ رصيدك قبل التفكير في الربح",
    icon: "🛡️",
    color: "#f6c85f",
    badge: {
      id: "capital-guardian",
      name: "حامي رأس المال",
      icon: "🛡️",
    },
    stages: [
      {
        title: "درع رأس المال",
        kind: "choice",
        lesson:
          "إدارة المخاطر تهدف إلى تقليل أثر الصفقة الخاسرة على الرصيد.",
        prompt: "ما التصرف الأكثر انضباطًا؟",
        options: [
          option("small", "استخدام مخاطرة صغيرة ومحددة", "🛡️"),
          option("all", "المخاطرة بكل الرصيد", "💥"),
          option("double", "مضاعفة الحجم بعد الخسارة", "🔥"),
        ],
        answer: "small",
        explanation:
          "المخاطرة الصغيرة تمنح الخطة فرصة للاستمرار حتى عند حدوث خسائر.",
      },
      {
        title: "مكان وقف الخسارة",
        kind: "zone",
        lesson:
          "في مثال شراء من دعم، يوضع الوقف التعليمي خلف منطقة إبطال الفكرة.",
        prompt: "حدد المكان التعليمي الأنسب لوقف صفقة شراء من الدعم.",
        pattern: "support",
        zones: [
          { id: "target", label: "فوق المقاومة", position: "top" },
          { id: "entry", label: "داخل نقطة الدخول", position: "middle" },
          { id: "below-support", label: "أسفل الدعم", position: "bottom" },
        ],
        answer: "below-support",
        explanation:
          "أسفل الدعم هو موضع إبطال الفكرة في هذا المثال التعليمي.",
      },
      {
        title: "بناء خطة المخاطرة",
        kind: "sequence",
        lesson:
          "لا يمكن تحديد حجم الصفقة قبل معرفة الرصيد والوقف ونسبة المخاطرة.",
        prompt: "رتّب خطوات إدارة المخاطرة.",
        items: [
          { id: "size", label: "حساب حجم الصفقة" },
          { id: "balance", label: "معرفة الرصيد" },
          { id: "stop", label: "تحديد الوقف" },
          { id: "percent", label: "اختيار نسبة المخاطرة" },
        ],
        answer: ["balance", "percent", "stop", "size"],
        explanation:
          "ابدأ بالرصيد، ثم نسبة المخاطرة والوقف، وبعدها احسب الحجم.",
      },
      {
        title: "اختبار الواحد بالمئة",
        kind: "slider",
        lesson:
          "النسبة التعليمية المطلوبة هنا هي 1% من الرصيد.",
        prompt: "حرّك المؤشر إلى نسبة المخاطرة المطلوبة.",
        min: 0,
        max: 10,
        step: 0.5,
        initial: 5,
        answer: 1,
        tolerance: 0.25,
        unit: "%",
        explanation:
          "اختيار 1% يقلل الضرر المحتمل مقارنة بالمخاطرة الكبيرة.",
      },
      {
        title: "قرش الجزيرة",
        kind: "scenario",
        lesson:
          "رفع المخاطرة بعد الخسارة يسمى غالبًا تداولًا انتقاميًا.",
        prompt:
          "خسرت صفقتين وتريد مضاعفة المخاطرة لتعويضهما. ماذا تفعل؟",
        options: [
          option("stop", "أتوقف وأراجع الخطة", "🧘"),
          option("double", "أضاعف المخاطرة", "✖️"),
          option("borrow", "أضيف أموالًا للمطاردة", "💸"),
        ],
        answer: "stop",
        explanation:
          "التوقف والمراجعة أفضل من اتخاذ قرار عاطفي بمخاطرة أكبر.",
        boss: true,
      },
    ],
  },

  {
    id: "news-lab",
    name: "مختبر الأخبار",
    subtitle: "تعلّم التعامل مع التقلبات",
    icon: "📰",
    color: "#42d9ff",
    badge: {
      id: "news-survivor",
      name: "ناجي الأخبار",
      icon: "📰",
    },
    stages: [
      {
        title: "الخبر والتوقع",
        kind: "choice",
        lesson:
          "السوق قد يتحرك وفق الفرق بين النتيجة الفعلية وتوقعات المشاركين.",
        prompt: "هل الخبر الإيجابي يعني صعود السعر دائمًا؟",
        options: [
          option("no", "لا، يعتمد على التوقع والسياق", "🧠"),
          option("yes", "نعم، دائمًا", "✅"),
          option("guaranteed", "الصعود مضمون", "🔒"),
        ],
        answer: "no",
        explanation:
          "قد يكون الخبر متوقعًا مسبقًا أو يتحرك السوق بصورة مختلفة.",
      },
      {
        title: "منطقة العاصفة",
        kind: "zone",
        lesson:
          "وقت الأخبار القوية قد يتسع السبريد وتزداد الحركة العشوائية.",
        prompt: "حدد المنطقة الأكثر تقلبًا بعد الخبر.",
        pattern: "news",
        zones: [
          { id: "spike", label: "قفزة الخبر", position: "top" },
          { id: "normal", label: "حركة طبيعية", position: "middle" },
          { id: "quiet", label: "هدوء السوق", position: "bottom" },
        ],
        answer: "spike",
        explanation:
          "القفزة الكبيرة تمثل منطقة تقلب مرتفع تحتاج إلى حذر.",
      },
      {
        title: "بروتوكول الأخبار",
        kind: "sequence",
        lesson:
          "مراجعة وقت الخبر وخطة المخاطر تسبق اتخاذ القرار.",
        prompt: "رتّب بروتوكول التعامل مع خبر قوي.",
        items: [
          { id: "wait", label: "انتظار هدوء الحركة" },
          { id: "calendar", label: "مراجعة موعد الخبر" },
          { id: "risk", label: "تقييم المخاطر" },
          { id: "decision", label: "اتخاذ القرار" },
        ],
        answer: ["calendar", "risk", "wait", "decision"],
        explanation:
          "اعرف موعد الخبر، قيّم الخطر، انتظر وضوح الحركة ثم قرر.",
      },
      {
        title: "مقياس التقلب",
        kind: "slider",
        lesson:
          "كلما زاد التقلب وجب رفع درجة الحذر، وليس حجم المخاطرة.",
        prompt: "اضبط درجة الحذر المطلوبة أثناء خبر قوي.",
        min: 0,
        max: 100,
        step: 10,
        initial: 30,
        answer: 90,
        tolerance: 1,
        unit: "%",
        explanation:
          "التحدي يطلب درجة حذر 90% بسبب ارتفاع التقلب.",
      },
      {
        title: "عاصفة المختبر",
        kind: "scenario",
        lesson:
          "الدخول قبل خبر شديد التأثير قد يعرض الصفقة لحركة غير متوقعة.",
        prompt:
          "يتبقى أقل من دقيقة على خبر قوي ولا توجد لديك خطة. ماذا تفعل؟",
        options: [
          option("avoid", "أتجنب الدخول وأراقب", "⏸️"),
          option("gamble", "أختار اتجاهًا عشوائيًا", "🎰"),
          option("maximum", "أستخدم أكبر حجم", "💣"),
        ],
        answer: "avoid",
        explanation:
          "غياب الخطة مع اقتراب الخبر يجعل الانتظار أكثر انضباطًا.",
        boss: true,
      },
    ],
  },

  {
    id: "psychology-planet",
    name: "كوكب نفسية المتداول",
    subtitle: "سيطر على الخوف والطمع",
    icon: "🧠",
    color: "#ff5f6d",
    badge: {
      id: "emotion-master",
      name: "قاهر الطمع",
      icon: "🧠",
    },
    stages: [
      {
        title: "مرآة الطمع",
        kind: "choice",
        lesson:
          "الطمع قد يدفع المتداول لتجاوز الخطة وزيادة المخاطرة.",
        prompt: "حققت عدة صفقات ناجحة. ما التصرف الأفضل؟",
        options: [
          option("plan", "أستمر وفق الخطة نفسها", "📋"),
          option("double", "أضاعف المخاطرة بسبب الثقة", "🔥"),
          option("all", "أخاطر بكل الرصيد", "💥"),
        ],
        answer: "plan",
        explanation:
          "النتائج السابقة لا تضمن الصفقة التالية، لذلك لا تغيّر الخطة عاطفيًا.",
      },
      {
        title: "منطقة الخوف",
        kind: "zone",
        lesson:
          "الخوف قد يظهر عندما يغلق المتداول الصفقة قبل تحقق شروط خطته.",
        prompt: "حدد منطقة القرار العاطفي في الرسم.",
        pattern: "emotion",
        zones: [
          { id: "target", label: "الهدف المخطط", position: "top" },
          { id: "panic", label: "إغلاق بدافع الخوف", position: "middle" },
          { id: "stop", label: "الوقف المخطط", position: "bottom" },
        ],
        answer: "panic",
        explanation:
          "إغلاق الصفقة في المنتصف دون سبب من الخطة قد يكون قرارًا عاطفيًا.",
      },
      {
        title: "روتين الهدوء",
        kind: "sequence",
        lesson:
          "التوقف والتنفس ومراجعة الخطة يقللان القرارات المتسرعة.",
        prompt: "رتّب روتين استعادة الانضباط.",
        items: [
          { id: "review", label: "مراجعة الخطة" },
          { id: "stop", label: "التوقف عن الضغط" },
          { id: "breathe", label: "التنفس والهدوء" },
          { id: "return", label: "العودة عند الاستعداد" },
        ],
        answer: ["stop", "breathe", "review", "return"],
        explanation:
          "توقف أولًا، اهدأ، راجع خطتك ثم عد فقط عندما تصبح مستعدًا.",
      },
      {
        title: "مقياس الانفعال",
        kind: "slider",
        lesson:
          "عندما يرتفع الانفعال، يكون التوقف أكثر حكمة من التداول.",
        prompt: "اضبط مستوى الانفعال الذي يستوجب التوقف.",
        min: 0,
        max: 10,
        step: 1,
        initial: 3,
        answer: 8,
        tolerance: 0,
        unit: "/10",
        explanation:
          "عند المستوى 8 من 10، التوقف والهدوء هو القرار المطلوب.",
      },
      {
        title: "نسخة المتداول الغاضب",
        kind: "scenario",
        lesson:
          "التداول الانتقامي محاولة عاطفية لتعويض خسارة بسرعة.",
        prompt:
          "تم تفعيل وقف الخسارة وشعرت بالغضب. ما القرار الصحيح؟",
        options: [
          option("break", "أبتعد قليلًا وأراجع القرار", "🧘"),
          option("revenge", "أفتح صفقة عكسية فورًا", "⚔️"),
          option("double", "أضاعف الحجم للتعويض", "🔥"),
        ],
        answer: "break",
        explanation:
          "الابتعاد المؤقت يساعد على منع التداول الانتقامي.",
        boss: true,
      },
    ],
  },

  {
    id: "discipline-arena",
    name: "بطولة المتداول المنضبط",
    subtitle: "الاختبار النهائي للمغامرة",
    icon: "👑",
    color: "#f6c85f",
    badge: {
      id: "disciplined-trader",
      name: "المتداول المنضبط",
      icon: "👑",
    },
    stages: [
      {
        title: "اختبار الخطة",
        kind: "choice",
        lesson:
          "الصفقة الجيدة تبدأ بأسباب واضحة ووقف وهدف ومخاطرة محسوبة.",
        prompt: "أي خطة هي الأكثر اكتمالًا؟",
        options: [
          option("complete", "اتجاه + منطقة + وقف + هدف + مخاطرة", "✅"),
          option("feeling", "الدخول اعتمادًا على الشعور", "💭"),
          option("random", "اختيار عشوائي دون وقف", "🎲"),
        ],
        answer: "complete",
        explanation:
          "الخطة الكاملة تحدد سبب القرار ومكان إبطاله والمخاطرة والهدف.",
      },
      {
        title: "ساحة القرار",
        kind: "zone",
        lesson:
          "الدخول الأفضل يكون من منطقة تخدم الخطة وليس من منتصف الحركة.",
        prompt: "حدد منطقة الدخول التعليمية الأكثر انضباطًا للشراء.",
        pattern: "final",
        zones: [
          { id: "chase", label: "مطاردة القمة", position: "top" },
          { id: "random", label: "منتصف الحركة", position: "middle" },
          { id: "planned", label: "منطقة الدعم المخططة", position: "bottom" },
        ],
        answer: "planned",
        explanation:
          "الانتظار عند المنطقة المخططة أفضل من مطاردة السعر بعد ارتفاعه.",
      },
      {
        title: "الخطة الذهبية",
        kind: "sequence",
        lesson:
          "الانضباط يعني تنفيذ عملية ثابتة قبل وأثناء وبعد الصفقة.",
        prompt: "رتّب العملية الكاملة للمتداول المنضبط.",
        items: [
          { id: "journal", label: "تسجيل النتيجة" },
          { id: "analysis", label: "تحليل السوق" },
          { id: "manage", label: "إدارة الصفقة وفق الخطة" },
          { id: "risk", label: "تحديد المخاطرة" },
        ],
        answer: ["analysis", "risk", "manage", "journal"],
        explanation:
          "حلل، وحدد المخاطرة، وأدر القرار وفق الخطة، ثم سجل النتيجة.",
      },
      {
        title: "ميزان الانضباط",
        kind: "slider",
        lesson:
          "نجاح المتداول التعليمي هنا يقاس بالالتزام بالخطة لا بصفقة واحدة.",
        prompt: "اضبط نسبة الانضباط المطلوبة للفوز بالبطولة.",
        min: 0,
        max: 100,
        step: 5,
        initial: 50,
        answer: 90,
        tolerance: 1,
        unit: "%",
        explanation:
          "البطولة تتطلب انضباطًا بنسبة 90% لإكمال الاختبار.",
      },
      {
        title: "عرش Forex4Ever",
        kind: "scenario",
        lesson:
          "الهدف النهائي هو حماية رأس المال واتخاذ قرارات منظمة.",
        prompt:
          "الفرصة غير مكتملة لكنك تريد إنهاء البطولة بسرعة. ماذا تفعل؟",
        options: [
          option("wait", "أنتظر اكتمال الشروط", "👑"),
          option("rush", "أدخل فقط لإنهاء المرحلة", "🏃"),
          option("risk", "أرفع المخاطرة للحصول على نقاط", "💥"),
        ],
        answer: "wait",
        explanation:
          "المتداول المنضبط لا يدخل لإثبات شيء؛ بل ينتظر اكتمال خطته.",
        boss: true,
      },
    ],
  },
];

let stageNumber = 0;

export const WORLDS = rawWorlds.map((world, worldIndex) => ({
  ...world,
  worldIndex,
  stages: world.stages.map((stage, stageIndex) => {
    stageNumber += 1;

    return {
      ...stage,
      id: `${world.id}-${stageIndex + 1}`,
      number: stageNumber,
      worldIndex,
      stageIndex,
      xp: stage.boss ? 250 : 100 + stageIndex * 20,
      coins: stage.boss ? 100 : 30 + stageIndex * 10,
    };
  }),
}));

export const ALL_STAGES = WORLDS.flatMap((world) =>
  world.stages.map((stage) => ({
    ...stage,
    worldName: world.name,
    worldIcon: world.icon,
    worldColor: world.color,
    worldBadge: world.badge,
  }))
);

export const TOTAL_STAGES = ALL_STAGES.length;
