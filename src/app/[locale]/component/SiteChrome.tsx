"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function SiteChrome({
  children,
  header,
  footer,
  decorations,
}: {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  decorations?: ReactNode;
}) {
  const pathname = usePathname() || "";
  const isAdminRoute = pathname.split("/").includes("admin");
  const isProjectRoute = pathname.split("/").includes("PROJECT");

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#07090e] text-[#f5f5f0] selection:bg-[#FFC82C] selection:text-black">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="print:hidden">
        {decorations}
        {header}
      </div>
      <main className="relative z-10 flex-grow">
        {children}
      </main>
      <div className="print:hidden">
        {!isProjectRoute && footer}
      </div>
    </div>
  );
}