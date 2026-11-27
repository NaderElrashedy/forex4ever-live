"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
  const pathname = usePathname();

  const hideHeader =
    pathname === "/tmgm-quest" ||
    pathname.startsWith("/tmgm-quest/");

  if (hideHeader) {
    return null;
  }

  return <Header />;
}
