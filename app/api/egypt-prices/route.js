import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

const TROY_OUNCE_IN_GRAMS = 31.1034768;

const currencyDetails = {
  USD: { name: "الدولار الأمريكي", flag: "🇺🇸" },
  EUR: { name: "اليورو", flag: "🇪🇺" },
  GBP: { name: "الجنيه الإسترليني", flag: "🇬🇧" },
  SAR: { name: "الريال السعودي", flag: "🇸🇦" },
  AED: { name: "الدرهم الإماراتي", flag: "🇦🇪" },
  KWD: { name: "الدينار الكويتي", flag: "🇰🇼" },
  QAR: { name: "الريال القطري", flag: "🇶🇦" },
  BHD: { name: "الدينار البحريني", flag: "🇧🇭" },
  OMR: { name: "الريال العُماني", flag: "🇴🇲" },
  CNY: { name: "اليوان الصيني", flag: "🇨🇳" },
  TRY: { name: "الليرة التركية", flag: "🇹🇷" },
};

const karats = [
  { karat: 24, label: "عيار 24", purity: 24 / 24 },
  { karat: 22, label: "عيار 22", purity: 22 / 24 },
  { karat: 21, label: "عيار 21", purity: 21 / 24 },
  { karat: 18, label: "عيار 18", purity: 18 / 24 },
  { karat: 14, label: "عيار 14", purity: 14 / 24 },
];

const barWeights = [
  { weight: 1, label: "1 جرام" },
  { weight: 2.5, label: "2.5 جرام" },
  { weight: 5, label: "5 جرام" },
  { weight: 10, label: "10 جرام" },
  { weight: 20, label: "20 جرام" },
  { weight: 31.1034768, label: "أونصة — 31.1 جرام" },
  { weight: 50, label: "50 جرام" },
  { weight: 100, label: "100 جرام" },
  { weight: 250, label: "250 جرام" },
  { weight: 500, label: "500 جرام" },
  { weight: 1000, label: "1 كيلوجرام" },
];

async function fetchGoldPrice(apiKey) {
  const response = await fetch("https://www.goldapi.io/api/XAU/USD", {
    headers: {
      "x-access-token": apiKey,
      "Content-Type": "application/json",
    },
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error(`Gold API returned status ${response.status}`);
  }

  const data = await response.json();
  const ouncePrice = Number(data.price);

  if (!Number.isFinite(ouncePrice) || ouncePrice <= 0) {
    throw new Error("Gold API returned an invalid gold price");
  }

  return ouncePrice;
}

async function fetchExchangeRates(apiKey) {
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`,
    {
      next: {
        revalidate: 300,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Exchange Rate API returned status ${response.status}`);
  }

  const data = await response.json();

  if (data.result !== "success" || !data.conversion_rates) {
    throw new Error("Exchange Rate API returned invalid data");
  }

  const usdToEgp = Number(data.conversion_rates.EGP);

  if (!Number.isFinite(usdToEgp) || usdToEgp <= 0) {
    throw new Error("EGP exchange rate is unavailable");
  }

  return {
    rates: data.conversion_rates,
    lastUpdate:
      data.time_last_update_utc ||
      data.time_last_update_unix ||
      new Date().toISOString(),
  };
}

const getEgyptPrices = unstable_cache(
  async () => {
    const goldApiKey = process.env.GOLD_API_KEY;
    const exchangeApiKey = process.env.EXCHANGE_RATE_API_KEY;

    if (!goldApiKey || !exchangeApiKey) {
      throw new Error("Required server environment variables are missing");
    }

    const [goldOunceUsd, exchangeData] = await Promise.all([
      fetchGoldPrice(goldApiKey),
      fetchExchangeRates(exchangeApiKey),
    ]);

    const { rates, lastUpdate } = exchangeData;
    const usdToEgp = Number(rates.EGP);

    // سعر الأونصة بالجنيه المصري
    const goldOunceEgp = goldOunceUsd * usdToEgp;

    // سعر جرام الذهب عيار 24
    const gram24Price = goldOunceEgp / TROY_OUNCE_IN_GRAMS;

    // أسعار عيارات الذهب
    const goldKarats = karats.map((item) => ({
      karat: item.karat,
      label: item.label,
      purity: `${((item.karat / 24) * 100).toFixed(1)}%`,
      price: gram24Price * item.purity,
    }));

    const gram21Price = gram24Price * (21 / 24);

    // الجنيه الذهب: 8 جرامات عيار 21
    const goldPoundPrice = gram21Price * 8;

    // السبائك عيار 24
    const goldBars = barWeights.map((item) => ({
      weight: item.weight,
      label: item.label,
      price: gram24Price * item.weight,
    }));

    // أسعار العملات مقابل الجنيه المصري
    const currencies = Object.entries(currencyDetails)
      .map(([code, details]) => {
        const currencyRateAgainstUsd = Number(rates[code]);

        if (
          !Number.isFinite(currencyRateAgainstUsd) ||
          currencyRateAgainstUsd <= 0
        ) {
          return null;
        }

        return {
          code,
          name: details.name,
          flag: details.flag,
          rate:
            code === "USD"
              ? usdToEgp
              : usdToEgp / currencyRateAgainstUsd,
        };
      })
      .filter(Boolean);

    return {
      gold: {
        ounceUsd: goldOunceUsd,
        ounceEgp: goldOunceEgp,
        gram24: gram24Price,
        goldPound: goldPoundPrice,
        karats: goldKarats,
        bars: goldBars,
      },
      currencies,
      sources: {
        gold: "GoldAPI",
        currencies: "ExchangeRate-API",
      },
      providerLastUpdate: lastUpdate,
      fetchedAt: new Date().toISOString(),
    };
  },
  ["forex4ever-egypt-prices-v1"],
  {
    revalidate: 300,
  }
);

export async function GET() {
  try {
    const prices = await getEgyptPrices();

    return NextResponse.json(
      {
        success: true,
        ...prices,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "public, s-maxage=300, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("Egypt prices API error:", error.message);

    return NextResponse.json(
      {
        success: false,
        message:
          "تعذر تحديث الأسعار حاليًا. يرجى المحاولة مرة أخرى بعد قليل.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
