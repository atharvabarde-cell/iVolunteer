"use client";

import { useEffect, useState } from "react";

// Example role-based dashboard components
function UserDashboard() {
  return <h1 className="text-2xl font-bold">User Dashboard</h1>;
}

function NGODashboard() {
  return <h1 className="text-2xl font-bold">NGO Dashboard</h1>;
}

function VolunteerDashboard() {
  return <h1 className="text-2xl font-bold">Volunteer Dashboard</h1>;
}

function CorporateDashboard() {
  return <h1 className="text-2xl font-bold">Corporate Dashboard</h1>;
}

export default function Page() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // ✅ Fetch role from localStorage (set during login/signup)
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  if (!role) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  switch (role) {
    case "user":
      return <UserDashboard />;
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
