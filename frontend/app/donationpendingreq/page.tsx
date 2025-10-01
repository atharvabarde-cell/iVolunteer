"use client";

import React, { useState, useEffect } from "react";
import { useAdmin, DonationEventItem } from "@/contexts/admin-context";

const PendingDonationEventsPage = () => {
  const { 
    pendingDonationEvents, 
    fetchPendingDonationEvents, 
    handleUpdateDonationEventStatus 
  } = useAdmin();
  
  const [denialReasons, setDenialReasons] = useState<{ [key: string]: string }>({});
  const [showApproveConfirm, setShowApproveConfirm] = useState<string | null>(null);
  const [showDenyConfirm, setShowDenyConfirm] = useState<string | null>(null);
  const [showRejectInput, setShowRejectInput] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingDonationEvents();
  }, []);

  const onApprove = async (id: string) => {
    setLoadingAction(id);
    try {
      await handleUpdateDonationEventStatus(id, "approved");
    } finally {
      setLoadingAction(null);
      setShowApproveConfirm(null);
    }
  };

  const onDeny = async (id: string) => {
    const reason = denialReasons[id];
    if (!reason?.trim()) {
      alert("Please enter a denial reason");
      return;
    }
    
    setLoadingAction(id);
    try {
      await handleUpdateDonationEventStatus(id, "rejected");
      setDenialReasons((prev) => ({ ...prev, [id]: "" }));
      setShowRejectInput(null);
    } finally {
      setLoadingAction(null);
      setShowDenyConfirm(null);
    }
  };

  const startRejectProcess = (id: string) => {
    setShowRejectInput(id);
    setDenialReasons((prev) => ({ ...prev, [id]: "" }));
  };

  const cancelRejectProcess = (id: string) => {
    setShowRejectInput(null);
    setDenialReasons((prev) => ({ ...prev, [id]: "" }));
  };

  const getEventById = (id: string) => {
    return pendingDonationEvents.find(event => event._id === id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Pending Donation Events</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Review and manage donation event submissions awaiting approval. Ensure all events meet community guidelines.
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-50 rounded-full">
            <span className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></span>
            <span className="text-sm font-medium text-green-700">
              {pendingDonationEvents.length} donation event{pendingDonationEvents.length !== 1 ? 's' : ''} pending review
            </span>
          </div>
        </div>

        {/* Events Table */}
        {pendingDonationEvents.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-50 mb-4">
                <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-500 text-lg">
                No pending donation events to review. New submissions will appear here automatically.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Donation Event Details
                    </th>
                    <th scope="col" className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Organization
                    </th>
                    <th scope="col" className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingDonationEvents.map((event: DonationEventItem) => (
                    <tr key={event._id} className="hover:bg-gray-50 transition-colors duration-150 group">
                      <td className="px-8 py-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                              {event.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {event.description || "No description provided"}
                            </p>
                            {event.targetAmount && (
                              <div className="flex items-center mt-2 text-sm font-medium text-green-600">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                Target: ${event.targetAmount}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                            {event.organization}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-sm font-semibold text-gray-900 bg-green-50 px-3 py-2 rounded-lg inline-block">
                          {event.date}
                        </div>
                        <div className="text-sm text-gray-500 mt-1 font-medium">{event.time}</div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col space-y-3 min-w-[200px]">
                          {/* Approve Button */}
                          <button
                            onClick={() => setShowApproveConfirm(event._id)}
                            disabled={loadingAction === event._id}
                            className="group relative inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            {loadingAction === event._id ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Approve Donation
                              </>
                            )}
                          </button>

                          {/* Reject Button & Input */}
                          {showRejectInput === event._id ? (
                            <div className="space-y-3 animate-in fade-in duration-200">
                              <div className="relative">
                                <textarea
                                  placeholder="Please provide a reason for rejection..."
                                  className="block w-full px-4 py-3 text-sm border border-red-200 rounded-xl placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 resize-none"
                                  rows={3}
                                  value={denialReasons[event._id] || ""}
                                  onChange={(e) =>
                                    setDenialReasons((prev) => ({ ...prev, [event._id]: e.target.value }))
                                  }
                                  autoFocus
                                />
                                <div className="absolute top-2 right-2">
                                  <span className={`text-xs ${denialReasons[event._id]?.length > 10 ? 'text-green-500' : 'text-red-400'}`}>
                                    {denialReasons[event._id]?.length || 0}/10
                                  </span>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => cancelRejectProcess(event._id)}
                                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => setShowDenyConfirm(event._id)}
                                  disabled={!denialReasons[event._id]?.trim() || denialReasons[event._id]?.trim().length < 10}
                                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
                                >
                                  Submit Rejection
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => startRejectProcess(event._id)}
                              disabled={loadingAction === event._id}
                              className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Reject Donation
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Approve Confirmation Modal */}
        {showApproveConfirm && (
          <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-gray-200 animate-in zoom-in duration-200">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-2xl mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Approve Donation Event?</h3>
              <p className="text-gray-600 text-center mb-2">
                You are about to approve the donation event:
              </p>
              <p className="text-lg font-semibold text-gray-900 text-center mb-6">
                "{getEventById(showApproveConfirm)?.title}"
              </p>
              <p className="text-sm text-gray-500 text-center mb-6">
                This donation event will be published and visible to all users. This action can be reversed later.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowApproveConfirm(null)}
                  className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 hover:shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onApprove(showApproveConfirm)}
                  disabled={loadingAction === showApproveConfirm}
                  className="flex-1 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl disabled:opacity-50 transition-all duration-200 hover:shadow-sm"
                >
                  {loadingAction === showApproveConfirm ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Approving...
                    </span>
                  ) : (
                    "Yes, Approve Donation"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Deny Confirmation Modal */}
        {showDenyConfirm && (
          <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-gray-200 animate-in zoom-in duration-200">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-2xl mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Reject Donation Event?</h3>
              <p className="text-gray-600 text-center mb-2">
                You are about to reject the donation event:
              </p>
              <p className="text-lg font-semibold text-gray-900 text-center mb-6">
                "{getEventById(showDenyConfirm)?.title}"
              </p>
              
              <div className="bg-red-50 rounded-xl p-4 mb-6 border border-red-100">
                <p className="text-sm font-medium text-red-800 mb-2">Reason for rejection:</p>
                <p className="text-sm text-red-700">{denialReasons[showDenyConfirm]}</p>
              </div>

              <p className="text-sm text-gray-500 text-center mb-6">
                This action cannot be undone. The event organizer will be notified of the rejection reason.
              </p>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDenyConfirm(null)}
                  className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 hover:shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onDeny(showDenyConfirm)}
                  disabled={loadingAction === showDenyConfirm}
                  className="flex-1 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl disabled:opacity-50 transition-all duration-200 hover:shadow-sm"
                >
                  {loadingAction === showDenyConfirm ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Rejecting...
                    </span>
                  ) : (
                    "Yes, Reject Donation"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingDonationEventsPage;