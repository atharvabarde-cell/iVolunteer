import { useAdmin } from "@/contexts/admin-context";
import Link from "next/link";

interface CTAButtonProps {
  className?: string;
}

const PendingRequestsCTA = ({ className = "" }: CTAButtonProps) => {
  const { pendingEvents } = useAdmin();
  const pendingCount = pendingEvents.length;
  const hasPending = pendingCount > 0;

  return (
    <Link href="/pendingrequest" passHref>
      <div className={`
        group relative bg-white border rounded-2xl p-6 m-5 mt-5
        hover:shadow-xl transition-all duration-300
        cursor-pointer overflow-hidden
        ${hasPending 
          ? 'border-blue-200 hover:border-blue-300' 
          : 'border-gray-100 hover:border-gray-200'
        }
        ${className}
      `}>
        {/* Conditional background gradient */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
          ${hasPending 
            ? 'bg-gradient-to-br from-blue-50/50 to-indigo-100/30' 
            : 'bg-gradient-to-br from-gray-50 to-gray-100/30'
          }`} />
        
        {/* Main content */}
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl transition-colors duration-300
                ${hasPending 
                  ? 'bg-blue-100 group-hover:bg-blue-200' 
                  : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                <svg className={`w-6 h-6 transition-colors duration-300
                  ${hasPending ? 'text-blue-600' : 'text-gray-400'}`} 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className={`text-lg font-bold transition-colors
                  ${hasPending ? 'text-gray-900 group-hover:text-blue-900' : 'text-gray-500'}`}>
                  Pending Events
                </h2>
                <p className="text-sm text-gray-500">
                  {hasPending ? 'Requires your review' : 'All caught up'}
                </p>
              </div>
            </div>
            
            {/* Count badge - only show when there are pending events */}
            {hasPending && (
              <span className="bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                {pendingCount}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {hasPending 
              ? `There ${pendingCount === 1 ? 'is' : 'are'} currently ${pendingCount} event${pendingCount !== 1 ? 's' : ''} awaiting your approval. Review and manage event submissions to ensure they meet community guidelines.`
              : 'All events have been reviewed and approved. Check back later for new event submissions.'
            }
          </p>

          {/* Action section */}
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium transition-colors
              ${hasPending ? 'text-blue-600 group-hover:text-blue-700' : 'text-gray-500'}`}>
              {hasPending ? 'Review events' : 'View events'}
            </span>
            <svg className={`w-5 h-5 transition-colors duration-300 transform group-hover:translate-x-1
              ${hasPending ? 'text-gray-400 group-hover:text-blue-500' : 'text-gray-300'}`} 
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PendingRequestsCTA;