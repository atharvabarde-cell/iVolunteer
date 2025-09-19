"use client";

import Coinsystem from "@/components/Coinsystem";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Gamified from "@/components/Gamified";
import { Header } from "@/components/header";
import Howitworks from "@/components/Howitworks";
import Hero from "@/components/ui/Hero";

import React from "react";

const page = () => {
  return (
    <div className="min-w-[350px]">
      <Header />
      <Hero />
      <Gamified />
      <Howitworks />
      <Coinsystem />
      <Faq />
      <Footer />
    </div>
  );
};

export default page;
