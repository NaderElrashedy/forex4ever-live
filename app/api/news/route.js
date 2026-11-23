import { NextResponse } from "next/server";

const NEWS_QUERY =
  '("Federal Reserve" OR inflation OR "interest rates" OR economy OR forex OR gold OR oil OR markets OR sanctions OR tariffs OR war OR election OR cryptocurrency)';

function getCategory(article) {
  const text = `${article.title || ""} ${article.description || ""}`.toLowerCase();

  if (
    text.includes("gold") ||
    text.includes("silver") ||
    text.includes("metal")
  ) {
    return "gold";
  }

  if (
    text.includes("bitcoin") ||
    text.includes("crypto") ||
    text.includes("ethereum") ||
    text.includes("blockchain")
  ) {
    return "crypto";
  }

  if (
    text.includes("forex") ||
    text.includes("currency") ||
    text.includes("dollar") ||
    text.includes("euro") ||
    text.includes("yen") ||
    text.includes("pound")
  ) {
    return "forex";
  }

  if (
    text.includes("stock") ||
    text.includes("nasdaq") ||
    text.includes("dow jones") ||
    text.includes("s&p 500") ||
    text.includes("shares") ||
    text.includes("wall street")
  ) {
    return "stocks";
  }

  if (
    text.includes("war") ||
    text.includes("election") ||
    text.includes("sanction") ||
    text.includes("tariff") ||
    text.includes("government") ||
    text.includes("president") ||
    text.includes("geopolitical")
  ) {
    return "politics";
  }

  return "economy";
}

function getImpact(article) {
  const text = `${article.title || ""} ${article.description || ""}`.toLowerCase();

  const highImpactWords = [
    "federal reserve",
    "interest rate",
    "inflation",
    "cpi",
    "nonfarm",
    "payroll",
    "employment",
    "unemployment",
    "central bank",
    "ecb",
    "bank of england",
    "war",
    "sanction",
    "tariff",
    "recession",
    "emergency",
  ];

  const mediumImpactWords = [
    "gold",
    "oil",
    "dollar",
    "euro",
    "bitcoin",
    "stock market",
    "nasdaq",
    "dow jones",
    "economy",
    "gdp",
    "trade",
  ];

  if (highImpactWords.some((word) => text.includes(word))) {
    return "high";
  }

  if (mediumImpactWords.some((word) => text.includes(word))) {
    return "medium";
  }

  return "low";
}

export async function GET() {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: "لم تتم إضافة GNEWS_API_KEY إلى متغيرات البيئة في Vercel.",
      },
      { status: 500 }
    );
  }

  try {
    const url = new URL("https://gnews.io/api/v4/search");

    url.searchParams.set("q", NEWS_QUERY);
    url.searchParams.set("lang", "en");
    url.searchParams.set("max", "10");
    url.searchParams.set("sortby", "publishedAt");
    url.searchParams.set("apikey", apiKey);

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },

      // جلب بيانات جديدة من GNews كل 30 دقيقة لتقليل استهلاك الباقة.
      next: {
        revalidate: 1800,
      },
    });

    if (!response.ok) {
      console.error(
        "GNews request failed:",
        response.status,
        await response.text()
      );

      return NextResponse.json(
        {
          error:
            "تعذر جلب الأخبار حاليًا. تحقق من مفتاح GNews والحد المتاح في حسابك.",
        },
        { status: 502 }
      );
    }

    const data = await response.json();

    const articles = Array.isArray(data.articles)
      ? data.articles.map((article, index) => ({
          id: `${article.publishedAt || "news"}-${index}`,
          title: article.title || "خبر جديد",
          description:
            article.description || "اضغط لقراءة تفاصيل الخبر من المصدر.",
          url: article.url || "#",
          image: article.image || "",
          publishedAt: article.publishedAt || null,
          source: article.source?.name || "مصدر إخباري",
          sourceUrl: article.source?.url || "",
          category: getCategory(article),
          impact: getImpact(article),
        }))
      : [];

    return NextResponse.json(
      {
        articles,
        updatedAt: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "public, s-maxage=1800, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    console.error("News API error:", error);

    return NextResponse.json(
      {
        error: "حدث خطأ غير متوقع أثناء تحميل الأخبار.",
      },
      { status: 500 }
    );
  }
}
