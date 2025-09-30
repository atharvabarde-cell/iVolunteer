"use client";

import React from "react";
import Link from "next/link";
import { useAdmin } from "@/contexts/admin-context";

interface CTAButtonProps {
  className?: string;
}

const DonationReqCTA = ({ className = "" }: CTAButtonProps) => {
  const { pendingDonationEvents } = useAdmin();
  const pendingCount = pendingDonationEvents.length;
  const hasPending = pendingCount > 0;

  return (
    <Link href="/donationpendingreq" passHref>
      <div className={`
        group relative bg-white border rounded-2xl p-6 m-5 mt-5
        hover:shadow-xl transition-all duration-300
        cursor-pointer overflow-hidden
        ${hasPending 
          ? 'border-green-200 hover:border-green-300' 
          : 'border-gray-100 hover:border-gray-200'
        }
        ${className}
      `}>
        {/* Conditional background gradient */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
          ${hasPending 
            ? 'bg-gradient-to-br from-green-50/50 to-emerald-100/30' 
            : 'bg-gradient-to-br from-gray-50 to-gray-100/30'
          }`} />
        
        {/* Main content */}
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl transition-colors duration-300
                ${hasPending 
                  ? 'bg-green-100 group-hover:bg-green-200' 
                  : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                <svg className={`w-6 h-6 transition-colors duration-300
                  ${hasPending ? 'text-green-600' : 'text-gray-400'}`} 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h2 className={`text-lg font-bold transition-colors
                  ${hasPending ? 'text-gray-900 group-hover:text-green-900' : 'text-gray-500'}`}>
                  Pending Donations
                </h2>
                <p className="text-sm text-gray-500">
                  {hasPending ? 'Requires your review' : 'All caught up'}
                </p>
              </div>
            </div>
            
            {/* Count badge - only show when there are pending donations */}
            {hasPending && (
              <span className="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                {pendingCount}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {hasPending 
              ? `There ${pendingCount === 1 ? 'is' : 'are'} currently ${pendingCount} donation event${pendingCount !== 1 ? 's' : ''} awaiting your approval. Review and manage donation submissions to ensure they meet community guidelines.`
              : 'All donation events have been reviewed and approved. Check back later for new donation submissions.'
            }
          </p>

          {/* Action section */}
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium transition-colors
              ${hasPending ? 'text-green-600 group-hover:text-green-700' : 'text-gray-500'}`}>
              {hasPending ? 'Review donations' : 'View donations'}
            </span>
            <svg className={`w-5 h-5 transition-colors duration-300 transform group-hover:translate-x-1
              ${hasPending ? 'text-gray-400 group-hover:text-green-500' : 'text-gray-300'}`} 
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DonationReqCTA;