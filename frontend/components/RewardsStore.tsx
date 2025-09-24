"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Gift, Coins, Zap, ShoppingCart, Loader2 } from "lucide-react";
import { useUser } from "@/contexts/user-context";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "react-toastify";
import api from "@/lib/api";

interface RewardItem {
  id: string;
  title: string;
  coins: number;
  image: string;
  popular?: boolean;
  description?: string;
}

const RewardsStore = () => {
  const { activeCoins, refreshUserStats } = useUser();
  const { user } = useAuth();
  const [purchasingItem, setPurchasingItem] = useState<string | null>(null);

  const rewards: RewardItem[] = [
    {
      id: "coffee",
      title: "Coffee Voucher",
      coins: 100,
      image: "/images/coupon1.jpg",
      popular: true,
      description: "Get a free coffee at your favorite cafe"
    },
    {
      id: "tshirt",
      title: "iVolunteer T-Shirt",
      coins: 250,
      image: "/images/volunteer.jpg",
      description: "Official iVolunteer merchandise"
    },
    {
      id: "book",
      title: "Book Voucher",
      coins: 150,
      image: "/images/education.avif",
      description: "₹500 worth book voucher"
    },
    {
      id: "plant",
      title: "Plant a Tree",
      coins: 50,
      image: "/images/treeplanting.avif",
      popular: true,
      description: "Plant a tree in your name"
    },
    {
      id: "meal",
      title: "Meal Donation",
      coins: 75,
      image: "/images/food.avif",
      description: "Provide a meal to someone in need"
    },
    {
      id: "badge",
      title: "Digital Badge",
      coins: 25,
      image: "/images/dailyreward.jpg",
      description: "Special achievement badge"
    }
  ];

  const handlePurchase = async (item: RewardItem) => {
    if (!user) {
      toast.error("Please login to purchase rewards");
      return;
    }

    if (activeCoins < item.coins) {
      toast.error("Insufficient coins! Keep volunteering to earn more.");
      return;
    }

    if (purchasingItem) return;

    try {
      setPurchasingItem(item.id);
      const token = localStorage.getItem("auth-token");

      const response = await api.post("/v1/rewards/spend",
        {
          amount: item.coins,
          itemName: item.title,
          itemId: item.id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      const responseData = response.data as any;
      if (responseData.success !== false) {
        toast.success(`Successfully purchased ${item.title}!`);
        // Refresh user stats to get updated coin count
        await refreshUserStats();
      } else {
        toast.error("Failed to purchase item. Please try again.");
      }
    } catch (error: any) {
      console.error("Purchase failed:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setPurchasingItem(null);
    }
  };

  return (
    <div className="px-4 py-8 md:px-8 md:py-12 lg:px-16 bg-gray-50">
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Gift className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-800">Rewards Store</h2>
        </div>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Exchange your hard-earned coins for exciting rewards and merchandise. Your current balance: 
          <span className="font-semibold text-blue-600 ml-1">{activeCoins} coins</span>
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col"
            >
              <div className="relative">
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src={reward.image}
                    alt={reward.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      (e.target as HTMLImageElement).src = "/placeholder.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  
                  {reward.popular && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                        <Zap className="w-3 h-3" fill="currentColor" />
                        Popular
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {reward.title}
                </h3>
                
                {reward.description && (
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    {reward.description}
                  </p>
                )}
                
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-600 font-medium">
                      <Coins className="w-5 h-5" />
                      <span>{reward.coins} coins</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handlePurchase(reward)}
                    disabled={!user || activeCoins < reward.coins || purchasingItem === reward.id}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {purchasingItem === reward.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : activeCoins < reward.coins ? (
                      <>
                        <Coins className="w-4 h-4" />
                        Need {reward.coins - activeCoins} more coins
                      </>
                    ) : !user ? (
                      "Login to Purchase"
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Redeem Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Want to see more rewards?</p>
          <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-2 mx-auto">
            View all rewards
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardsStore;