"use client"; // required if using Next.js App Router

import React, { createContext, useContext, useState, ReactNode } from "react";


interface AdminInfo {
  id: string;
  name: string;
  email: string;
}

export interface RequestItem {
  id: number;
  name: string;
  type: "NGO" | "Corporate";
  submitted: string;
}

export interface AdminContextType {
  isAdmin: boolean;
  adminInfo: AdminInfo | null;
  loginAdmin: (info: AdminInfo) => void;
  logoutAdmin: () => void;

  totalUser: number;
  setTotalUser: React.Dispatch<React.SetStateAction<number>>;

  activeNgo: number;
  setActiveNgo: React.Dispatch<React.SetStateAction<number>>;

  corporatePartner: number;
  setCorporatePartner: React.Dispatch<React.SetStateAction<number>>;

  pendingReq: number;
  setPendingReq: React.Dispatch<React.SetStateAction<number>>;

  requests: RequestItem[];
  denialReason: string;
  selectedId: number | null;
  setDenialReason: React.Dispatch<React.SetStateAction<string>>;
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
  handleApprove: (id: number) => void;
  handleDeny: (id: number) => void;
}


// 2. Create context with default values
const AdminContext = createContext<AdminContextType | undefined>(undefined);

// 3. Provider component
export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);

  const [totalUser, setTotalUser] = useState<number>(1421);
  const [activeNgo, setActiveNgo] = useState<number>(24);
  const [corporatePartner, setCorporatePartner] = useState<number>(10);
  const [pendingReq, setPendingReq] = useState<number>(8);

  const [requests, setRequests] = useState<RequestItem[]>([
    { id: 1, name: "Green Earth Initiative", type: "NGO", submitted: "2 days ago" },
    { id: 2, name: "Tech Solutions Inc.", type: "Corporate", submitted: "5 days ago" },
  ]);
  const [denialReason, setDenialReason] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const loginAdmin = (info: AdminInfo) => {
    setAdminInfo(info);
    setIsAdmin(true);
  };

  const logoutAdmin = () => {
    setAdminInfo(null);
    setIsAdmin(false);
  };

  const handleApprove = (id: number) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    // Add API call if needed
  };

   const handleDeny = (id: number) => {
    if (!denialReason.trim()) return alert("Please provide a denial reason");
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setDenialReason("");
    setSelectedId(null);
    // Add API call if needed
  };


  const value = {
    isAdmin,adminInfo,
    loginAdmin,logoutAdmin,
    totalUser,setTotalUser,activeNgo,setActiveNgo,corporatePartner,setCorporatePartner,pendingReq,setPendingReq,
    requests,denialReason,selectedId,setDenialReason,setSelectedId,handleApprove,handleDeny,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

// 4. Custom hook for easier usage
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
