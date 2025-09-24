import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { EventsProvider } from "@/contexts/events-context";
import { AdminProvider } from "@/contexts/admin-context";
import { UserProvider } from "@/contexts/user-context";
import { ToastContainer } from "react-toastify";
import { PostProvider } from "@/contexts/post-context"

export const metadata: Metadata = {
  title: "Impact Rewards - Volunteer Platform",
  description: "Connect volunteers with NGOs and make a difference",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <AuthProvider>
          <UserProvider>
            <AdminProvider>
              <EventsProvider>
                <PostProvider>{children}</PostProvider>
              </EventsProvider>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                closeOnClick
                pauseOnHover
                draggable
                theme="light"
              />
            </AdminProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
