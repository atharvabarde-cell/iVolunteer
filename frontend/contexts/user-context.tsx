"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type UserContextType = {
  activeCoins: number;
  totalCoinsEarned: number;
  totalSpend: number;
  badges: number;
  streak: string;
  setActiveCoins: (value: number) => void;
  setTotalCoinsEarned: (value: number) => void;
  setTotalSpend: (value: number) => void;
  setBadges: (value: number) => void;
  setStreak: (value: string) => void;
};

// default values
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [activeCoins, setActiveCoins] = useState(1250);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(3500);
  const [totalSpend, setTotalSpend] = useState(2250);
  const [badges, setBadges] = useState(12);
  const [streak, setStreak] = useState("5 days");

  return (
    <UserContext.Provider
      value={{
        activeCoins,
        totalCoinsEarned,
        totalSpend,
        badges,
        streak,
        setActiveCoins,
        setTotalCoinsEarned,
        setTotalSpend,
        setBadges,
        setStreak,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used inside a UserProvider");
  }
  return context;
};
