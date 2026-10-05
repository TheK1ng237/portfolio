import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thek1ng237 | Full-Stack Developer",
  description: "Portfolio Afro-Futuriste",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
