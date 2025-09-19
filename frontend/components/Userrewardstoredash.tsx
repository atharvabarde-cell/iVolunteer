import React from "react";
import Image from "next/image";
import { Gift, Coins, Zap } from "lucide-react";

const rewards = [
  {
    id: 1,
    title: "$25 Gift Card",
    coins: 500,
    image: "/images/coupon1.jpg",
    popular: false
  },
  {
    id: 2,
    title: "iVolunteer T-Shirt",
    coins: 1000,
    image: "/images/c2.jpg",
    popular: true
  },
  {
    id: 3,
    title: "$50 Gift Card",
    coins: 1000,
    image: "/images/coupon1.jpg",
    popular: false
  },
  {
    id: 4,
    title: "iVolunteer Water Bottle",
    coins: 750,
    image: "/images/c2.jpg",
    popular: true
  },
];

const Userrewardstoredash = () => {
  return (
    <div className="px-4 py-8 md:px-8 md:py-12 lg:px-16 bg-gray-50">
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Gift className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-800">Rewards Store</h2>
        </div>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Exchange your hard-earned coins for exciting rewards and merchandise.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col"
            >
              <div className="relative">
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src={reward.image}
                    alt={reward.title}
                    fill
                    className="object-cover"
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
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {reward.title}
                </h3>
                
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-600 font-medium">
                      <Coins className="w-5 h-5" />
                      <span>{reward.coins} coins</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <Gift className="w-4 h-4" />
                    Redeem Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Want to see more rewards?</p>
          <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-2 mx-auto">
            View all rewards
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Userrewardstoredash;