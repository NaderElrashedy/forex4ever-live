"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
  const pathname = usePathname();

  const standaloneGame =
    process.env.NEXT_PUBLIC_STANDALONE_GAME === "true";

  const hideHeader =
    standaloneGame ||
    pathname === "/tmgm-quest" ||
    pathname.startsWith("/tmgm-quest/");

  if (hideHeader) {
    return null;
  }

  return <Header />;
}
