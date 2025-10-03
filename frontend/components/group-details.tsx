'use client';

import React, { useState, useEffect } from 'react';
import { useGroups } from '@/contexts/groups-context';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { 
    Users, 
    MessageSquare, 
    Calendar, 
    Globe, 
    Lock, 
    UserPlus, 
    Crown,
    ArrowLeft,
    Settings,
    UserMinus,
    Trash2,
    Info
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { GroupChat } from './group-chat';

interface GroupDetailsProps {
    groupId: string;
    onBack?: () => void;
}

export function GroupDetails({ groupId, onBack }: GroupDetailsProps) {
    const { currentGroup, getGroup, joinGroup, leaveGroup, deleteGroup, loading } = useGroups();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'chat' | 'members' | 'info'>('chat');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (groupId) {
            getGroup(groupId);
        }
    }, [groupId]);

    const handleJoin = async () => {
        if (!user) {
            toast({
                title: 'Authentication required',
                description: 'Please log in to join groups',
                variant: 'destructive'
            });
            return;
        }

        try {
            setActionLoading(true);
            await joinGroup(groupId);
            toast({
                title: 'Successfully joined!',
                description: `Welcome to ${currentGroup?.name}`,
            });
        } catch (error: any) {
            toast({
                title: 'Failed to join group',
                description: error.message || 'Please try again',
                variant: 'destructive'
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleLeave = async () => {
        if (!currentGroup) return;

        try {
            setActionLoading(true);
            await leaveGroup(groupId);
            toast({
                title: 'Left group',
                description: `You've left ${currentGroup.name}`,
            });
            if (onBack) onBack();
        } catch (error: any) {
            toast({
                title: 'Failed to leave group',
                description: error.message || 'Please try again',
                variant: 'destructive'
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!currentGroup) return;

        if (!confirm(`Are you sure you want to delete ${currentGroup.name}? This action cannot be undone.`)) {
            return;
        }

        try {
            setActionLoading(true);
            await deleteGroup(groupId);
            toast({
                title: 'Group deleted',
                description: `${currentGroup.name} has been deleted`,
            });
            if (onBack) onBack();
        } catch (error: any) {
            toast({
                title: 'Failed to delete group',
                description: error.message || 'Please try again',
                variant: 'destructive'
            });
        } finally {
            setActionLoading(false);
        }
    };

    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            'Environmental Action': 'bg-green-100 text-green-800',
            'Community Service': 'bg-blue-100 text-blue-800',
            'Healthcare Initiative': 'bg-red-100 text-red-800',
            'Education Support': 'bg-purple-100 text-purple-800',
            'Animal Welfare': 'bg-orange-100 text-orange-800',
            'Disaster Relief': 'bg-yellow-100 text-yellow-800',
            'Fundraising': 'bg-pink-100 text-pink-800',
            'Social Impact': 'bg-indigo-100 text-indigo-800',
            'Skills Development': 'bg-emerald-100 text-emerald-800',
            'General Discussion': 'bg-gray-100 text-gray-800',
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-[700px] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-emerald-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Users className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <p className="text-gray-600">Loading group details...</p>
                </div>
            </div>
        );
    }

    if (!currentGroup) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-[700px] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Group not found</p>
                    {onBack && (
                        <Button onClick={onBack} variant="outline">
                            Go Back
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    const isCreator = currentGroup.creator._id === user?._id;
    const isMember = currentGroup.isMember;

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 min-h-[700px] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 via-emerald-500/10 to-blue-500/10 p-6 border-b border-gray-200">
                <div className="flex items-start gap-4">
                    {onBack && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBack}
                            className="mt-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    )}
                    
                    <div className="flex items-start gap-4 flex-1">
                        <div className="relative">
                            {currentGroup.imageUrl ? (
                                <img 
                                    src={currentGroup.imageUrl} 
                                    alt={currentGroup.name}
                                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                            ) : (
                                <div className="w-20 h-20 bg-gradient-to-br from-primary to-emerald-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                                    <Users className="w-10 h-10 text-white" />
                                </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
                                {currentGroup.isPrivate ? (
                                    <Lock className="w-4 h-4 text-orange-600" />
                                ) : (
                                    <Globe className="w-4 h-4 text-emerald-600" />
                                )}
                            </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                        {currentGroup.name}
                                        {isCreator && <Crown className="w-5 h-5 text-yellow-500 inline ml-2" />}
                                    </h1>
                                    <p className="text-gray-600 mb-3">by {currentGroup.creator.name}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>{currentGroup.memberCount} members</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{format(new Date(currentGroup.createdAt), 'MMM d, yyyy')}</span>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(currentGroup.category)}`}>
                                        {currentGroup.category}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-2">
                                    {!isMember ? (
                                        <Button
                                            onClick={handleJoin}
                                            disabled={actionLoading}
                                            className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white"
                                        >
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            Join Group
                                        </Button>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            {isCreator ? (
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm">
                                                        <Settings className="w-4 h-4" />
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={handleDelete}
                                                        disabled={actionLoading}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleLeave}
                                                    disabled={actionLoading}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <UserMinus className="w-4 h-4 mr-2" />
                                                    Leave
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="flex gap-8 px-6">
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'chat'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <MessageSquare className="w-4 h-4 inline mr-2" />
                        Chat
                    </button>
                    <button
                        onClick={() => setActiveTab('members')}
                        className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'members'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <Users className="w-4 h-4 inline mr-2" />
                        Members ({currentGroup.memberCount})
                    </button>
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'info'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <Info className="w-4 h-4 inline mr-2" />
                        About
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="flex-1">
                {activeTab === 'chat' && (
                    <div className="h-[500px]">
                        <GroupChat groupId={groupId} />
                    </div>
                )}

                {activeTab === 'members' && (
                    <div className="p-6">
                        <div className="space-y-4">
                            {currentGroup.members?.map((member) => (
                                <div key={member.user._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {member.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-gray-900">{member.user.name}</p>
                                            {member.user._id === currentGroup.creator._id && (
                                                <Crown className="w-4 h-4 text-yellow-500" />
                                            )}
                                            {member.role === 'admin' && member.user._id !== currentGroup.creator._id && (
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                    Admin
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Joined {format(new Date(member.joinedAt), 'MMM d, yyyy')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'info' && (
                    <div className="p-6 space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                            <p className="text-gray-700 leading-relaxed">{currentGroup.description}</p>
                        </div>

                        {currentGroup.tags && currentGroup.tags.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {currentGroup.tags.map((tag, index) => (
                                        <span 
                                            key={index}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Group Settings</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Privacy:</span>
                                    <span className="flex items-center gap-1">
                                        {currentGroup.isPrivate ? (
                                            <>
                                                <Lock className="w-4 h-4 text-orange-600" />
                                                Private
                                            </>
                                        ) : (
                                            <>
                                                <Globe className="w-4 h-4 text-emerald-600" />
                                                Public
                                            </>
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Max Members:</span>
                                    <span>{currentGroup.maxMembers}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Member Invites:</span>
                                    <span>{currentGroup.settings?.allowMemberInvites ? 'Allowed' : 'Not Allowed'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Join Approval:</span>
                                    <span>{currentGroup.settings?.requireApproval ? 'Required' : 'Not Required'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}