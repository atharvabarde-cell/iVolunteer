"use client";

import { useEffect, useState } from "react";
import {
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";


export function Header() {
  const [open, setOpen] = useState(false);

  const baseNavItems = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/posts", label: "Posts" },
    { href: "/volunteer", label: "Volunteer" },
    { href: "/donate", label: "Donate" },
    { href: "/activities", label: "Activities" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* ==== Logo / Brand ==== */}
        <div className="flex items-center gap-3">
          <span className="text-gray-800 leading-none">
            <span className="font-bold text-4xl ">i</span>{" "}
            <span className="text-3xl">Volunteer</span>
          </span>
        </div>

        {/* ==== Nav (desktop) ==== */}
        <nav className="hidden md:flex items-center gap-8">
          {baseNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-700 hover:text-blue-600 transition"
            >
              {item.label}
            </Link>
          ))}
          <div>
            <button className="ml-4 rounded-sm hover:scale-95 px-5 py-2 text-sm font-semibold transition-all border">
              <Link href="/auth">Sign up</Link>
            </button>

            <button className="ml-4 rounded-sm bg-black hover:scale-95 px-5 py-2 text-sm font-semibold text-white transition-all">
              <Link href="/auth">Login</Link>
            </button>
          </div>
        </nav>

        {/* ==== Mobile menu button ==== */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden rounded p-2 hover:bg-gray-100"
        >
          {open ? (
            <X className="h-5 w-5 text-gray-700" />
          ) : (
            <Menu className="h-5 w-5 text-gray-700" />
          )}
        </button>
      </div>

      {/* ==== Mobile Nav (animated) ==== */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full left-0 w-full h-screen md:hidden border-t border-gray-200 bg-white shadow-lg z-50"
          >
            <nav className="flex flex-col gap-2 px-8 py-8">
              {baseNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-green-600 transition py-3"
                >
                  {item.label}
                </Link>
              ))}

              {/* Divider */}
              <div className="my-3 border-t border-gray-200"></div>

              {/* Auth buttons */}
              <button className="w-full rounded-md border px-5 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition">
                <Link href="/auth">Sign up</Link>
              </button>
              <button className="mt-2 w-full rounded-md bg-black px-5 py-2 text-sm font-semibold text-white shadow hover:bg-gray-900 transition">
                <Link href="/auth">Login</Link>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
