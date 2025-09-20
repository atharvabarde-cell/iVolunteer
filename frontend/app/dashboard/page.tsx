"use client";

import Adminstats from "@/components/Adminstats";
import Approvalqueueadmin from "@/components/Approvalqueueadmin";
import CSRAnalytics from "@/components/Csranalytics";
import Dailyquote from "@/components/Dailyquote";
import Eventbutton from "@/components/Eventbutton";
import Footer from "@/components/Footer";
import { Header } from "@/components/header";
import Ngoanalytics from "@/components/Ngoanalytics";
import Ngoeventtable from "@/components/Ngoeventtable";
import Sponsorshipopp from "@/components/Sponsorshipopp";
import Useractivity from "@/components/Useractivity";
import Useranalytics from "@/components/Useranalytics";
import Usermanagementtable from "@/components/Usermanagementtable";
import Userrewardstoredash from "@/components/Userrewardstoredash";

import { useEffect, useState } from "react";

// Example role-based dashboard components
function AdminDashboard() {
  return (
    <section className="bg-[#f4f7fb] h-full w-full min-w-[350px]">
      <Header />
      <div className="p-6">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 text-xl mt-1">
          A powerful yet effortless way to manage the iVolunteer platform.
        </p>
      </div>
      <Adminstats />
      <h2 className="text-3xl font-semibold mb-4 text-start ml-8 mt-3">
        User Management
      </h2>
      <Usermanagementtable />
      <Approvalqueueadmin />
      <Footer/>
    </section>
  );
}

function NGODashboard() {
  return <section  className="bg-[#f4f7fb] h-full min-w-[350px]">
    <Header/>
    <Ngoanalytics/>
    <Eventbutton/>
    <Ngoeventtable/>
    <Footer/>
  </section>
}

function VolunteerDashboard() {
  return <section className="w-full h-full bg-gray-50 min-w-[350px]">
    <Header/>
    <Useranalytics/>
    <Dailyquote/>
    <Useractivity/>
    <Userrewardstoredash/>
    <Footer/>
  </section>
}

function CorporateDashboard() {
  return <section>
    <Header/>
    <Sponsorshipopp/>
    <CSRAnalytics/>
    <Footer/>
  </section>;
}

export default function Page() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  if (!role) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  switch (role) {
    case "admin":
      return <AdminDashboard />;
    case "ngo":
      return <NGODashboard />;
    case "volunteer":
      return <VolunteerDashboard />;
    case "corporate":
      return <CorporateDashboard />;
    default:
      return <p className="p-6">No role found. Please log in.</p>;
  }
}
