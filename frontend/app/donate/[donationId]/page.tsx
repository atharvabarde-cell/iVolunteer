'use client'

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useDonationEvent } from "@/contexts/donationevents-context";
import api from "@/lib/api";
import { toast } from "react-toastify";
import {
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Target,
  ArrowLeft,
  Tag,
  Image as ImageIcon,
  Building,
  Globe,
  Phone,
  Mail,
  MapPinIcon,
  IndianRupee,
  TrendingUp,
  CheckCircle,
  Heart,
} from "lucide-react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DonationDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const donationId = params.donationId as string;
  
  const { handleRazorpayPayment } = useDonationEvent();
  const [donationEvent, setDonationEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donating, setDonating] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>("");

  const quickAmounts = [100, 250, 500, 1000, 2500, 5000];
  const token = typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;

  // Fetch single donation event with NGO details
  const fetchDonationDetails = async () => {
    if (!donationId) return;
    
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching donation details for:', donationId);
      
      const response = await api.get(`/v1/donation-event/${donationId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });

      const responseData = response.data as any;
      if (responseData.success && responseData.event) {
        console.log('Donation event fetched successfully:', responseData.event);
        console.log('NGO Details:', responseData.event.ngoId);
        setDonationEvent(responseData.event);
      } else {
        throw new Error("Donation event not found");
      }
    } catch (err: any) {
      console.error('Error fetching donation event:', err);
      const errorMessage = err.response?.data?.message || "Failed to fetch donation event details";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonationDetails();
  }, [donationId]);

  const handleQuickDonate = async (amount: number) => {
    if (!donationEvent?._id) return;
    
    setDonating(true);
    try {
      await handleRazorpayPayment(donationEvent._id, amount);
      // Refresh donation details to get updated amounts
      setTimeout(() => fetchDonationDetails(), 1000);
    } catch (err) {
      console.error("Donation failed:", err);
    } finally {
      setDonating(false);
    }
  };

  const handleCustomDonate = async () => {
    if (!donationEvent?._id || !customAmount) return;
    
    const amount = Number(customAmount);
    if (amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setDonating(true);
    try {
      await handleRazorpayPayment(donationEvent._id, amount);
      setCustomAmount("");
      // Refresh donation details to get updated amounts
      setTimeout(() => fetchDonationDetails(), 1000);
    } catch (err) {
      console.error("Donation failed:", err);
    } finally {
      setDonating(false);
    }
  };

  const getProgressPercentage = () => {
    if (!donationEvent) return 0;
    return Math.min(100, Math.round((donationEvent.collectedAmount / donationEvent.goalAmount) * 100));
  };

  const getRemainingAmount = () => {
    if (!donationEvent) return 0;
    return Math.max(0, donationEvent.goalAmount - donationEvent.collectedAmount);
  };

  const isDonationCompleted = () => {
    return donationEvent && donationEvent.collectedAmount >= donationEvent.goalAmount;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading donation details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !donationEvent) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <div className="text-red-600 text-4xl mb-2">⚠️</div>
              <h2 className="text-red-800 text-xl font-semibold mb-2">
                {error ? "Error" : "Donation Event Not Found"}
              </h2>
              <p className="text-red-600 mb-4">
                {error || "The donation event you're looking for could not be found."}
              </p>
              <button
                onClick={() => router.back()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const progress = getProgressPercentage();
  const remainingAmount = getRemainingAmount();
  const isCompleted = isDonationCompleted();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Donations
          </button>

          {/* Donation Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            {/* Header Image/Gradient */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 h-64 md:h-80 flex items-center justify-center">
              <div className="text-center text-white">
                <Heart className="h-16 w-16 mx-auto mb-4 opacity-80" />
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{donationEvent.title}</h1>
                <p className="text-white/90">{donationEvent.ngoId?.name || "NGO"}</p>
              </div>
            </div>

            {/* Completion Status */}
            {isCompleted && (
              <div className="bg-green-50 border-b border-green-200 px-6 py-3">
                <div className="flex items-center justify-center text-green-700 text-sm font-medium">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Goal Achieved! Thank you for your support.
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">About This Campaign</h2>
                <p className="text-gray-600 leading-relaxed">
                  {donationEvent.description || "No description available for this donation campaign."}
                </p>
              </div>

              {/* NGO Information */}
              {donationEvent.ngoId && typeof donationEvent.ngoId === 'object' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">About the Organization</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Organization Basic Info */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Building className="h-5 w-5 text-blue-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Organization Name</p>
                          <p className="text-sm text-gray-600">
                            {donationEvent.ngoId.name}
                          </p>
                        </div>
                      </div>

                      {donationEvent.ngoId.organizationType && (
                        <div className="flex items-start space-x-3">
                          <Tag className="h-5 w-5 text-purple-600 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Organization Type</p>
                            <p className="text-sm text-gray-600 capitalize">
                              {donationEvent.ngoId.organizationType.replace('-', ' ')}
                            </p>
                          </div>
                        </div>
                      )}

                      {donationEvent.ngoId.yearEstablished && (
                        <div className="flex items-start space-x-3">
                          <Calendar className="h-5 w-5 text-green-600 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Established</p>
                            <p className="text-sm text-gray-600">
                              {donationEvent.ngoId.yearEstablished}
                            </p>
                          </div>
                        </div>
                      )}

                      {donationEvent.ngoId.organizationSize && (
                        <div className="flex items-start space-x-3">
                          <Building className="h-5 w-5 text-orange-600 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Organization Size</p>
                            <p className="text-sm text-gray-600">
                              {donationEvent.ngoId.organizationSize} employees
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      {donationEvent.ngoId.email && (
                        <div className="flex items-start space-x-3">
                          <Mail className="h-5 w-5 text-red-600 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Email</p>
                            <a 
                              href={`mailto:${donationEvent.ngoId.email}`}
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {donationEvent.ngoId.email}
                            </a>
                          </div>
                        </div>
                      )}

                      {donationEvent.ngoId.contactNumber && (
                        <div className="flex items-start space-x-3">
                          <Phone className="h-5 w-5 text-green-600 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Phone</p>
                            <a 
                              href={`tel:${donationEvent.ngoId.contactNumber}`}
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {donationEvent.ngoId.contactNumber}
                            </a>
                          </div>
                        </div>
                      )}

                      {donationEvent.ngoId.websiteUrl && (
                        <div className="flex items-start space-x-3">
                          <Globe className="h-5 w-5 text-blue-600 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Website</p>
                            <a 
                              href={donationEvent.ngoId.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              Visit Website
                            </a>
                          </div>
                        </div>
                      )}

                      {donationEvent.ngoId.address && (
                        <div className="flex items-start space-x-3">
                          <MapPinIcon className="h-5 w-5 text-purple-600 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Address</p>
                            <div className="text-sm text-gray-600">
                              {donationEvent.ngoId.address.street && (
                                <p>{donationEvent.ngoId.address.street}</p>
                              )}
                              <p>
                                {[
                                  donationEvent.ngoId.address.city,
                                  donationEvent.ngoId.address.state,
                                  donationEvent.ngoId.address.zip
                                ].filter(Boolean).join(', ')}
                              </p>
                              {donationEvent.ngoId.address.country && (
                                <p>{donationEvent.ngoId.address.country}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Organization Description */}
                  {donationEvent.ngoId.ngoDescription && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">About Us</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {donationEvent.ngoId.ngoDescription}
                      </p>
                    </div>
                  )}

                  {/* Focus Areas */}
                  {donationEvent.ngoId.focusAreas && donationEvent.ngoId.focusAreas.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Focus Areas</h3>
                      <div className="flex flex-wrap gap-2">
                        {donationEvent.ngoId.focusAreas.map((area: string, index: number) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize"
                          >
                            {area.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Donation Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Campaign Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Campaign Duration */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Start Date</p>
                        <p className="text-sm text-gray-600">
                          {new Date(donationEvent.startDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-red-600 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">End Date</p>
                        <p className="text-sm text-gray-600">
                          {new Date(donationEvent.endDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Goals */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Target className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Goal Amount</p>
                        <p className="text-sm text-gray-600">
                          ₹{donationEvent.goalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <TrendingUp className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Collected Amount</p>
                        <p className="text-sm text-gray-600">
                          ₹{donationEvent.collectedAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Donation Progress Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Progress</h3>
                
                {/* Progress Stats */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-gray-600">
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm">
                        ₹{donationEvent.collectedAmount.toLocaleString()} raised of ₹{donationEvent.goalAmount.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-gray-500">{progress}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        isCompleted ? "bg-green-500" : progress > 75 ? "bg-blue-500" : "bg-green-400"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Remaining Amount */}
                  {!isCompleted && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-900">₹{remainingAmount.toLocaleString()}</span> more needed
                      </p>
                    </div>
                  )}
                </div>

                {/* Donation Actions */}
                {!isCompleted ? (
                  <div className="space-y-4">
                    {/* Quick Amount Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      {quickAmounts.slice(0, 4).map((amount) => (
                        <Button
                          key={amount}
                          onClick={() => handleQuickDonate(amount)}
                          disabled={donating}
                          variant="outline"
                          className="text-sm py-2 px-3 hover:bg-green-50 hover:border-green-300"
                        >
                          ₹{amount}
                        </Button>
                      ))}
                    </div>

                    {/* Custom Amount */}
                    <div className="space-y-2">
                      <Input
                        type="number"
                        placeholder="Enter custom amount"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="text-center"
                      />
                      <Button
                        onClick={handleCustomDonate}
                        disabled={donating || !customAmount}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        {donating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <Heart className="h-4 w-4 mr-2" />
                            Donate Now
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-medium text-green-900 mb-1">Goal Achieved!</h4>
                      <p className="text-sm text-green-700">
                        Thank you for helping us reach our goal. Your support made this possible!
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Campaign Status */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      donationEvent.status === 'completed' ? 'bg-green-100 text-green-700' :
                      donationEvent.status === 'active' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {donationEvent.status === 'active' ? 'Active' : 'Completed'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Campaign Duration</span>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.ceil((new Date(donationEvent.endDate).getTime() - new Date(donationEvent.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DonationDetailsPage;