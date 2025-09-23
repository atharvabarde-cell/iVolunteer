"use client";

import { GeistSans } from "@/lib/font";

export default function FontsStyles() {
  return (
    <style>{`
      html {
        font-family: ${GeistSans.style.fontFamily};
        --font-sans: ${GeistSans.variable};
      }
    `}</style>
  );
}
