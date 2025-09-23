"use client";
import api from "@/lib/api";
import React, { createContext, useContext, useState, useEffect } from "react";

interface Opportunity {
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
  participants: string;
  goal: string;
  category: string;
  featured: boolean;
}

interface CorporateContextType {
  opportunities: Opportunity[];
  fetchOpportunities: () => Promise<void>;
}

const CorporateContext = createContext<CorporateContextType | undefined>(undefined);

export const CorporateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  const fetchOpportunities = async () => {
    try {
      const res = await api.get("/v1/event/sponsorship");
      const data = res.data;

      // Map API data to your Opportunity type
      const mapped = (data.availableSponsorEvent || []).map((item: any) => ({
        title: item.title,
        description: item.description,
        image: item.images?.[0] || "/images/default-event.avif", // fallback
        date: new Date(item.date).toLocaleDateString(),
        location: item.location,
        participants: `${item.participants?.length || 0} / ${item.participantsNeeded || 0}`,
        goal: item.goal || `${item.sponsorshipAmount || 0} USD`,
        category: item.category,
        featured: false,
      }));

      setOpportunities(mapped);
    } catch (error) {
      console.error("Failed to fetch opportunities", error);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  return (
    <CorporateContext.Provider value={{ opportunities, fetchOpportunities }}>
      {children}
    </CorporateContext.Provider>
  );
};

export const useCorporate = () => {
  const context = useContext(CorporateContext);
  if (!context) {
    throw new Error("useCorporate must be used within a CorporateProvider");
  }
  return context;
};
