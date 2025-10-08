"use client";

import React, { useState } from "react";
import { useParticipationRequest } from "@/contexts/participation-request-context";
import { useAuth } from "@/contexts/auth-context";
import { Users, Clock, CheckCircle, XCircle, User, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export const PendingParticipationRequests: React.FC = () => {
  const { user } = useAuth();
  const { 
    incomingRequests, 
    loadingIncoming, 
    acceptRequest, 
    rejectRequest,
    stats 
  } = useParticipationRequest();

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Return early if user is not NGO
  if (!user || user.role !== "ngo") {
    return null;
  }

  const pendingRequests = incomingRequests.filter(req => req.status === "pending");

  const handleAccept = async (requestId: string) => {
    setIsSubmitting(true);
    try {
      await acceptRequest(requestId);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectClick = (requestId: string) => {
    setSelectedRequestId(requestId);
    setRejectionReason("");
    setShowRejectDialog(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedRequestId) return;
    
    setIsSubmitting(true);
    try {
      const success = await rejectRequest(selectedRequestId, rejectionReason.trim() || undefined);
      if (success) {
        setShowRejectDialog(false);
        setSelectedRequestId(null);
        setRejectionReason("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectCancel = () => {
    setShowRejectDialog(false);
    setSelectedRequestId(null);
    setRejectionReason("");
  };

  if (loadingIncoming) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Participation Requests</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-500">Loading requests...</span>
        </div>
      </div>
    );
  }

  if (pendingRequests.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Participation Requests</h3>
          {stats && stats.pending > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {stats.pending} pending
            </span>
          )}
        </div>
        <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No pending participation requests</p>
          <p className="text-sm mt-1">New requests will appear here automatically</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Participation Requests</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {pendingRequests.length} pending
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <div 
              key={request._id} 
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-900">{request.userId.name}</span>
                    <span className="text-gray-500 text-sm">({request.userId.email})</span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">{request.eventId.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{request.eventId.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        Requested {new Date(request.createdAt).toLocaleDateString()} at{" "}
                        {new Date(request.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>

                  {request.message && (
                    <div className="bg-gray-50 rounded p-3 mb-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Message:</span> "{request.message}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    onClick={() => handleAccept(request._id)}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRejectClick(request._id)}
                    disabled={isSubmitting}
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rejection Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Participation Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this participation request. This will be visible to the user.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., This event requires specific skills that weren't mentioned in your profile..."
              rows={4}
              maxLength={500}
            />
            
            <div className="text-xs text-gray-500 text-right">
              {rejectionReason.length}/500 characters
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={handleRejectCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectConfirm}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isSubmitting ? "Rejecting..." : "Reject Request"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};