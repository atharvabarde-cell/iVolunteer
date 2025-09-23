"use client";

import { ReactNode } from "react";
import { NGOProvider } from "@/contexts/ngo-context";
import { AuthProvider } from "@/contexts/auth-context";
// import { EventsProvider } from "@/contexts/events-context";
import { AdminProvider } from "@/contexts/admin-context";
import { UserProvider } from "@/contexts/user-context";
import { ToastContainer } from "react-toastify";
import { CorporateProvider } from "@/contexts/corporate-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <AdminProvider>
        <AuthProvider>
          <NGOProvider>
            <CorporateProvider>
              {children}
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                closeOnClick
                pauseOnHover
                draggable
                theme="light"
              />
            </CorporateProvider>
          </NGOProvider>
        </AuthProvider>
      </AdminProvider>
    </UserProvider>
  );
}
