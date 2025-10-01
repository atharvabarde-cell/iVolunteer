"use client";

import { ReactNode } from "react";
import { NGOProvider } from "@/contexts/ngo-context";
import { AuthProvider } from "@/contexts/auth-context";
// import { EventsProvider } from "@/contexts/events-context";
import { AdminProvider } from "@/contexts/admin-context";
import { UserProvider } from "@/contexts/user-context";
import { PostProvider } from "@/contexts/post-context";
import { ToastContainer } from "react-toastify";
import { CorporateProvider } from "@/contexts/corporate-context";
import { DonationEventProvider } from "@/contexts/donationevents-context";
import { PointsProvider } from "@/contexts/points-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
      <PointsProvider>
      <AuthProvider>
        <UserProvider>
          <AdminProvider>
            <NGOProvider>
              <CorporateProvider>
                <PostProvider>
                  <DonationEventProvider>
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
                  </DonationEventProvider>
                </PostProvider>
              </CorporateProvider>
            </NGOProvider>
          </AdminProvider>
        </UserProvider>
      </AuthProvider>
    </PointsProvider>
  );
}
