import { NextResponse } from "next/server";

export function middleware(request) {
  const standaloneGame = process.env.STANDALONE_GAME === "true";

  // المشروع الأصلي يعمل بشكل طبيعي
  if (!standaloneGame) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // السماح لملفات Next.js والصور والخطوط بالعمل
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // عرض اللعبة مباشرة في الصفحة الرئيسية
  if (pathname === "/") {
    const gameUrl = request.nextUrl.clone();
    gameUrl.pathname = "/tmgm-quest";

    return NextResponse.rewrite(gameUrl);
  }

  // السماح لملفات ومسار اللعبة
  if (pathname.startsWith("/tmgm-quest")) {
    return NextResponse.next();
  }

  // منع فتح باقي صفحات موقع Forex4Ever
  const homeUrl = request.nextUrl.clone();
  homeUrl.pathname = "/";

  return NextResponse.redirect(homeUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
