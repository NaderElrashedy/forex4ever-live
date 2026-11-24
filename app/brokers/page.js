"use client";

import Link from "next/link";
import { useState } from "react";

const WIKIDATA_API = "https://www.wikidata.org/w/api.php";

async function requestWikidata(params) {
  const query = new URLSearchParams({
    ...params,
    format: "json",
    origin: "*",
  });

  const response = await fetch(`${WIKIDATA_API}?${query.toString()}`);

  if (!response.ok) {
    throw new Error("تعذر الاتصال بمصدر البيانات.");
  }

  return response.json();
}

function getClaimValue(claims, property) {
  return claims?.[property]?.[0]?.mainsnak?.datavalue?.value ?? null;
}

function getEntityId(claims, property) {
  const value = getClaimValue(claims, property);
  return value?.id || null;
}

function getYear(timeValue) {
  if (!timeValue?.time) return null;

  const match = timeValue.time.match(/[+-](\d{4,})-/);
  return match ? match[1] : null;
}

function getPreferredText(values) {
  return values?.ar?.value || values?.en?.value || null;
}

function getCommonsImageUrl(fileName) {
  if (!fileName) return null;

  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
    fileName
  )}?width=320`;
}

function isValidWebsite(url) {
  if (!url) return false;

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:";
  } catch {
    return false;
  }
}

export default function BrokersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selectedBroker, setSelectedBroker] = useState(null);

  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const [searchError, setSearchError] = useState("");
  const [detailsError, setDetailsError] = useState("");

  async function searchEntities(term, language) {
    const data = await requestWikidata({
      action: "wbsearchentities",
      search: term,
      language,
      uselang: language,
      type: "item",
      limit: "12",
    });

    return data.search || [];
  }

  async function handleSearch(event) {
    event.preventDefault();

    const cleanTerm = searchTerm.trim();

    if (cleanTerm.length < 2) {
      setSearchError("اكتب حرفين على الأقل للبحث عن الشركة.");
      return;
    }

    setIsSearching(true);
    setSearchError("");
    setDetailsError("");
    setSelectedBroker(null);
    setResults([]);

    try {
      let searchResults = await searchEntities(cleanTerm, "ar");

      /*
        إذا لم نجد نتائج كافية بالعربية،
        نبحث بالإنجليزية ونمنع تكرار الشركات.
      */
      if (searchResults.length < 5) {
        const englishResults = await searchEntities(cleanTerm, "en");

        const combinedResults = [...searchResults, ...englishResults];

        searchResults = combinedResults.filter(
          (item, index, array) =>
            array.findIndex((result) => result.id === item.id) === index
        );
      }

      setResults(searchResults.slice(0, 12));

      if (searchResults.length === 0) {
        setSearchError(
          "لم نجد نتائج مطابقة. جرّب كتابة الاسم الرسمي للشركة باللغة الإنجليزية."
        );
      }
    } catch (error) {
      console.error(error);
      setSearchError(
        "تعذر البحث الآن. يرجى المحاولة مرة أخرى بعد قليل."
      );
    } finally {
      setIsSearching(false);
    }
  }

  async function getRelatedLabels(entityIds) {
    const validIds = entityIds.filter(Boolean);

    if (validIds.length === 0) {
      return {};
    }

    const data = await requestWikidata({
      action: "wbgetentities",
      ids: validIds.join("|"),
      props: "labels",
      languages: "ar|en",
    });

    const labels = {};

    Object.entries(data.entities || {}).forEach(([id, entity]) => {
      labels[id] =
        entity.labels?.ar?.value ||
        entity.labels?.en?.value ||
        id;
    });

    return labels;
  }

  async function handleSelectBroker(result) {
    setIsLoadingDetails(true);
    setDetailsError("");
    setSelectedBroker(null);

    try {
      const data = await requestWikidata({
        action: "wbgetentities",
        ids: result.id,
        props: "labels|descriptions|claims",
        languages: "ar|en",
      });

      const entity = data.entities?.[result.id];

      if (!entity || entity.missing !== undefined) {
        throw new Error("لم يتم العثور على تفاصيل الشركة.");
      }

      const claims = entity.claims || {};

      /*
        خصائص Wikidata المستخدمة:

        P17  = الدولة
        P571 = تاريخ التأسيس
        P856 = الموقع الرسمي
        P154 = الشعار
        P749 = الشركة الأم
      */
      const countryId = getEntityId(claims, "P17");
      const parentCompanyId = getEntityId(claims, "P749");

      const relatedLabels = await getRelatedLabels([
        countryId,
        parentCompanyId,
      ]);

      const websiteValue = getClaimValue(claims, "P856");
      const logoFileName = getClaimValue(claims, "P154");
      const inceptionValue = getClaimValue(claims, "P571");

      setSelectedBroker({
        id: result.id,
        name:
          getPreferredText(entity.labels) ||
          result.label ||
          result.id,
        description:
          getPreferredText(entity.descriptions) ||
          result.description ||
          "لا يوجد وصف متوفر لهذه الشركة.",
        country: countryId
          ? relatedLabels[countryId] || countryId
          : null,
        parentCompany: parentCompanyId
          ? relatedLabels[parentCompanyId] || parentCompanyId
          : null,
        foundationYear: getYear(inceptionValue),
        website: isValidWebsite(websiteValue)
          ? websiteValue
          : null,
        logo: getCommonsImageUrl(logoFileName),
        sourceUrl: `https://www.wikidata.org/wiki/${result.id}`,
        fetchedAt: new Intl.DateTimeFormat("ar-EG", {
          dateStyle: "long",
          timeStyle: "short",
        }).format(new Date()),
      });

      window.setTimeout(() => {
        document
          .getElementById("broker-details")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (error) {
      console.error(error);
      setDetailsError(
        "تعذر جلب تفاصيل هذه الشركة. حاول اختيار نتيجة أخرى."
      );
    } finally {
      setIsLoadingDetails(false);
    }
  }

  function resetSearch() {
    setSearchTerm("");
    setResults([]);
    setSelectedBroker(null);
    setSearchError("");
    setDetailsError("");
  }

  return (
    <main className="page" dir="rtl">
      <div className="container">
        {/* رأس الصفحة */}
        <header className="pageHeader">
          <Link href="/" className="backLink">
            العودة إلى الرئيسية
          </Link>

          <div className="titleArea">
            <span className="badge">Forex4Ever</span>

            <h1>دليل شركات التداول</h1>

            <p>
              ابحث عن المعلومات الأساسية المتاحة عن شركات التداول
              والمؤسسات المالية من خلال Wikidata.
            </p>
          </div>
        </header>

        {/* تنبيه مهم */}
        <section className="notice">
          <span className="noticeIcon">⚠️</span>

          <div>
            <strong>تنبيه مهم</strong>

            <p>
              ظهور الشركة في هذا الدليل لا يعني أنها مرخصة أو موصى بها.
              بيانات Wikidata قد تكون ناقصة أو قديمة، ويجب التحقق من
              الترخيص من الموقع الرسمي للجهة الرقابية قبل التعامل مع
              أي شركة.
            </p>
          </div>
        </section>

        {/* البحث */}
        <section className="searchSection">
          <div className="sectionHeading">
            <span>🔎</span>

            <div>
              <h2>البحث عن شركة</h2>
              <p>
                يمكنك كتابة الاسم بالعربية أو الإنجليزية، مثل Exness أو
                eToro.
              </p>
            </div>
          </div>

          <form className="searchForm" onSubmit={handleSearch}>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="اكتب اسم شركة التداول..."
              aria-label="اسم شركة التداول"
              autoComplete="off"
            />

            <button
              type="submit"
              className="searchButton"
              disabled={isSearching}
            >
              {isSearching ? "جاري البحث..." : "بحث"}
            </button>

            {(results.length > 0 || selectedBroker) && (
              <button
                type="button"
                className="resetButton"
                onClick={resetSearch}
              >
                مسح
              </button>
            )}
          </form>

          {searchError && (
            <div className="errorMessage">{searchError}</div>
          )}
        </section>

        {/* حالة التحميل */}
        {isSearching && (
          <section className="loadingBox">
            <div className="loader" />
            <p>جاري البحث في قاعدة بيانات Wikidata...</p>
          </section>
        )}

        {/* نتائج البحث */}
        {!isSearching && results.length > 0 && (
          <section className="resultsSection">
            <div className="resultsTitle">
              <h2>نتائج البحث</h2>
              <span>{results.length} نتيجة</span>
            </div>

            <div className="resultsGrid">
              {results.map((result) => (
                <article className="resultCard" key={result.id}>
                  <div className="resultTop">
                    <span className="companyIcon">🏢</span>

                    <span className="entityId">{result.id}</span>
                  </div>

                  <h3>{result.label || "اسم غير متوفر"}</h3>

                  <p>
                    {result.description ||
                      "لا يوجد وصف متوفر لهذه النتيجة."}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleSelectBroker(result)}
                    disabled={isLoadingDetails}
                  >
                    {isLoadingDetails
                      ? "جاري التحميل..."
                      : "عرض معلومات الشركة"}
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {detailsError && (
          <div className="errorMessage detailsError">
            {detailsError}
          </div>
        )}

        {/* تفاصيل الشركة */}
        {selectedBroker && (
          <section
            className="detailsSection"
            id="broker-details"
          >
            <div className="detailsHeader">
              <div className="logoBox">
                {selectedBroker.logo ? (
                  <img
                    src={selectedBroker.logo}
                    alt={`شعار ${selectedBroker.name}`}
                  />
                ) : (
                  <span>🏢</span>
                )}
              </div>

              <div className="companyHeading">
                <span className="detailsBadge">
                  معلومات من Wikidata
                </span>

                <h2>{selectedBroker.name}</h2>
                <p>{selectedBroker.description}</p>
              </div>
            </div>

            <div className="infoGrid">
              <div className="infoCard">
                <span>🌍</span>
                <div>
                  <small>الدولة</small>
                  <strong>
                    {selectedBroker.country || "غير متوفر"}
                  </strong>
                </div>
              </div>

              <div className="infoCard">
                <span>📅</span>
                <div>
                  <small>سنة التأسيس</small>
                  <strong>
                    {selectedBroker.foundationYear || "غير متوفر"}
                  </strong>
                </div>
              </div>

              <div className="infoCard">
                <span>🏛️</span>
                <div>
                  <small>الشركة الأم</small>
                  <strong>
                    {selectedBroker.parentCompany || "غير متوفر"}
                  </strong>
                </div>
              </div>

              <div className="infoCard">
                <span>🔗</span>
                <div>
                  <small>معرّف Wikidata</small>
                  <strong>{selectedBroker.id}</strong>
                </div>
              </div>
            </div>

            <div className="actionLinks">
              {selectedBroker.website && (
                <a
                  href={selectedBroker.website}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="primaryLink"
                >
                  زيارة الموقع المسجل للشركة
                </a>
              )}

              <a
                href={selectedBroker.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="secondaryLink"
              >
                عرض مصدر البيانات
              </a>
            </div>

            {!selectedBroker.website && (
              <p className="missingWebsite">
                الموقع الرسمي غير متوفر ضمن بيانات Wikidata لهذه
                النتيجة.
              </p>
            )}

            <div className="verificationWarning">
              <strong>حالة التحقق من الترخيص: غير متحقق منه</strong>

              <p>
                لا يوفر هذا البحث تحققًا مباشرًا من التراخيص. يجب
                مراجعة سجل الجهة الرقابية الرسمي والتأكد من تطابق
                الاسم القانوني ورقم الترخيص ونطاق الموقع.
              </p>
            </div>

            <div className="fetchDate">
              آخر جلب للبيانات: {selectedBroker.fetchedAt}
            </div>
          </section>
        )}

        {/* التقييمات */}
        {selectedBroker && (
          <section className="reviewsSection">
            <div className="sectionHeading">
              <span>⭐</span>

              <div>
                <h2>تقييمات مستخدمي Forex4Ever</h2>
                <p>
                  سيتم تفعيل التقييمات بعد ربطها بقاعدة بيانات Supabase
                  ونظام تسجيل الدخول ومراجعة الإدارة.
                </p>
              </div>
            </div>

            <div className="comingSoon">
              <span>🔒</span>

              <div>
                <strong>التقييمات غير مفعّلة حاليًا</strong>

                <p>
                  لن نعرض تقييمات وهمية أو محفوظة على جهاز واحد فقط.
                  سيتم تفعيلها لاحقًا بصورة صحيحة بحيث يكون لكل مستخدم
                  تقييم واحد، ولا يظهر إلا بعد موافقة الإدارة.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* مصادر البيانات */}
        <section className="sourceSection">
          <h2>عن مصدر البيانات</h2>

          <ul>
            <li>
              المعلومات الأساسية يتم جلبها من Wikidata عند إجراء البحث.
            </li>

            <li>
              قد لا تظهر بعض الشركات أو قد تكون بياناتها غير مكتملة.
            </li>

            <li>
              لا تمثل البيانات توصية بالتعامل مع أي شركة.
            </li>

            <li>
              يجب التحقق من التراخيص من السجلات الرسمية للجهات
              الرقابية.
            </li>

            <li>
              استخدام الخدمة يخضع لسياسات وشروط استخدام Wikimedia
              وWikidata.
            </li>
          </ul>
        </section>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top right,
              rgba(212, 175, 55, 0.1),
              transparent 30%
            ),
            #07090d;
          color: #f5f5f5;
          padding: 32px 16px 70px;
          font-family: Arial, sans-serif;
        }

        .container {
          width: min(1150px, 100%);
          margin: 0 auto;
        }

        .pageHeader {
          margin-bottom: 24px;
        }

        .backLink {
          display: inline-flex;
          color: #d4af37;
          text-decoration: none;
          border: 1px solid rgba(212, 175, 55, 0.35);
          border-radius: 10px;
          padding: 10px 16px;
          margin-bottom: 28px;
          transition: 0.2s ease;
        }

        .backLink:hover {
          background: rgba(212, 175, 55, 0.1);
        }

        .titleArea {
          text-align: center;
          max-width: 760px;
          margin: 0 auto;
        }

        .badge,
        .detailsBadge {
          display: inline-flex;
          color: #d4af37;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 999px;
          padding: 7px 14px;
          font-size: 14px;
        }

        h1 {
          font-size: clamp(32px, 5vw, 52px);
          margin: 18px 0 14px;
          color: #ffffff;
        }

        .titleArea p {
          color: #b9bec8;
          font-size: 17px;
          line-height: 1.9;
          margin: 0;
        }

        .notice {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          background: rgba(255, 193, 7, 0.08);
          border: 1px solid rgba(255, 193, 7, 0.27);
          border-radius: 16px;
          padding: 18px;
          margin: 30px 0 22px;
        }

        .noticeIcon {
          font-size: 24px;
        }

        .notice strong {
          color: #f1c84b;
        }

        .notice p {
          color: #d5d5d5;
          line-height: 1.8;
          margin: 7px 0 0;
        }

        .searchSection,
        .resultsSection,
        .detailsSection,
        .reviewsSection,
        .sourceSection {
          background: #10131a;
          border: 1px solid #252a34;
          border-radius: 20px;
          padding: 24px;
          margin-top: 22px;
        }

        .sectionHeading {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          margin-bottom: 20px;
        }

        .sectionHeading > span {
          font-size: 25px;
        }

        .sectionHeading h2,
        .resultsTitle h2,
        .sourceSection h2 {
          color: #ffffff;
          margin: 0 0 7px;
        }

        .sectionHeading p {
          color: #9fa6b2;
          line-height: 1.7;
          margin: 0;
        }

        .searchForm {
          display: flex;
          gap: 10px;
        }

        .searchForm input {
          flex: 1;
          min-width: 0;
          background: #090b10;
          color: #ffffff;
          border: 1px solid #303640;
          border-radius: 12px;
          padding: 15px 16px;
          font-size: 16px;
          outline: none;
        }

        .searchForm input:focus {
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
        }

        .searchButton,
        .resetButton,
        .resultCard button {
          border: 0;
          border-radius: 12px;
          padding: 14px 22px;
          cursor: pointer;
          font-weight: 700;
          transition: 0.2s ease;
        }

        .searchButton,
        .resultCard button {
          color: #0b0d11;
          background: #d4af37;
        }

        .searchButton:hover,
        .resultCard button:hover {
          background: #ebca5b;
        }

        .resetButton {
          color: #ffffff;
          background: #292e38;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .errorMessage {
          color: #ffb4b4;
          background: rgba(255, 70, 70, 0.08);
          border: 1px solid rgba(255, 70, 70, 0.25);
          border-radius: 12px;
          padding: 14px;
          margin-top: 15px;
        }

        .detailsError {
          margin-top: 22px;
        }

        .loadingBox {
          text-align: center;
          color: #c4c8d0;
          padding: 40px 20px;
        }

        .loader {
          width: 38px;
          height: 38px;
          margin: 0 auto 14px;
          border: 3px solid #313641;
          border-top-color: #d4af37;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .resultsTitle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 18px;
        }

        .resultsTitle span {
          color: #d4af37;
        }

        .resultsGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .resultCard {
          display: flex;
          flex-direction: column;
          background: #0a0d12;
          border: 1px solid #252b35;
          border-radius: 16px;
          padding: 18px;
          min-height: 245px;
        }

        .resultTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .companyIcon {
          font-size: 25px;
        }

        .entityId {
          color: #d4af37;
          background: rgba(212, 175, 55, 0.08);
          padding: 5px 9px;
          border-radius: 8px;
          font-size: 13px;
        }

        .resultCard h3 {
          color: #ffffff;
          margin: 18px 0 10px;
        }

        .resultCard p {
          flex: 1;
          color: #9ea5b1;
          line-height: 1.7;
          margin: 0 0 18px;
        }

        .detailsSection {
          scroll-margin-top: 20px;
          border-color: rgba(212, 175, 55, 0.38);
        }

        .detailsHeader {
          display: flex;
          align-items: center;
          gap: 22px;
          padding-bottom: 24px;
          border-bottom: 1px solid #292e38;
        }

        .logoBox {
          display: grid;
          place-items: center;
          width: 120px;
          height: 120px;
          flex-shrink: 0;
          background: #ffffff;
          border-radius: 18px;
          overflow: hidden;
          padding: 12px;
        }

        .logoBox img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .logoBox span {
          font-size: 48px;
        }

        .companyHeading h2 {
          color: #ffffff;
          font-size: 30px;
          margin: 12px 0 9px;
        }

        .companyHeading p {
          color: #b1b6c0;
          line-height: 1.8;
          margin: 0;
        }

        .infoGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-top: 24px;
        }

        .infoCard {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #090c11;
          border: 1px solid #252b35;
          border-radius: 14px;
          padding: 17px;
        }

        .infoCard > span {
          font-size: 24px;
        }

        .infoCard small {
          display: block;
          color: #8e96a3;
          margin-bottom: 6px;
        }

        .infoCard strong {
          color: #ffffff;
          word-break: break-word;
        }

        .actionLinks {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 24px;
        }

        .primaryLink,
        .secondaryLink {
          display: inline-flex;
          justify-content: center;
          text-decoration: none;
          border-radius: 12px;
          padding: 13px 18px;
          font-weight: 700;
        }

        .primaryLink {
          color: #0a0c10;
          background: #d4af37;
        }

        .secondaryLink {
          color: #d4af37;
          border: 1px solid rgba(212, 175, 55, 0.45);
        }

        .missingWebsite {
          color: #aeb4be;
          margin: 18px 0 0;
        }

        .verificationWarning {
          background: rgba(255, 152, 0, 0.07);
          border: 1px solid rgba(255, 152, 0, 0.25);
          border-radius: 14px;
          padding: 17px;
          margin-top: 22px;
        }

        .verificationWarning strong {
          color: #ffbf5b;
        }

        .verificationWarning p {
          color: #c6c9cf;
          line-height: 1.8;
          margin: 8px 0 0;
        }

        .fetchDate {
          color: #858d99;
          font-size: 14px;
          margin-top: 18px;
        }

        .comingSoon {
          display: flex;
          gap: 14px;
          background: #090c11;
          border: 1px solid #292f39;
          border-radius: 15px;
          padding: 18px;
        }

        .comingSoon > span {
          font-size: 25px;
        }

        .comingSoon strong {
          color: #ffffff;
        }

        .comingSoon p {
          color: #a7aeba;
          line-height: 1.8;
          margin: 7px 0 0;
        }

        .sourceSection ul {
          color: #adb3be;
          line-height: 2;
          margin: 14px 0 0;
          padding-right: 22px;
        }

        @media (max-width: 900px) {
          .resultsGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .infoGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 620px) {
          .page {
            padding: 20px 12px 50px;
          }

          .searchSection,
          .resultsSection,
          .detailsSection,
          .reviewsSection,
          .sourceSection {
            padding: 18px;
            border-radius: 16px;
          }

          .searchForm {
            flex-direction: column;
          }

          .searchForm button {
            width: 100%;
          }

          .resultsGrid,
          .infoGrid {
            grid-template-columns: 1fr;
          }

          .detailsHeader {
            flex-direction: column;
            align-items: flex-start;
          }

          .logoBox {
            width: 100px;
            height: 100px;
          }

          .companyHeading h2 {
            font-size: 25px;
          }

          .actionLinks {
            flex-direction: column;
          }

          .primaryLink,
          .secondaryLink {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
