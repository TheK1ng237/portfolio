"use client";

import React, { useEffect, useId, useState } from "react";

import Hero from "./component/HERO";
import TestimonialsSection from "./component/TestimonialsSection";
import { useTranslations } from "next-intl";

/* -------------------------------------------------------------------------- */
/*  Données                                                                   */
/* -------------------------------------------------------------------------- */

type TextileKind = "NDOP" | "ADINKRA" | "TOGHU" | "KENTE";

const TEXTILE_COLORS: Record<TextileKind, { color: string; hue: number }> = {
  NDOP: { color: "#FFC82C", hue: 46 },
  ADINKRA: { color: "#FF3B56", hue: 352 },
  TOGHU: { color: "#FFE57F", hue: 47 },
  KENTE: { color: "#FFB300", hue: 44 },
};



export default function Home() {
  const t = useTranslations("HomePage");
  

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0D18] font-azurio text-[#F8F9FA]">
      {/* 1. HERO */}
      <Hero />

      
      {/* 5. TÉMOIGNAGES */}
      <TestimonialsSection />

      
    </div>
  );
}