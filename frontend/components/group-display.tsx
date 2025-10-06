'use client';

import React from 'react';
import { Users, MessageSquare, Calendar, Globe, Lock, UserPlus, UserMinus, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGroups } from '@/contexts/groups-context';
import { useAuth } from '@/contexts/auth-context';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Group {
    _id: string;
    name: string;
    description: string;
    creator: {
        _id: string;
        name: string;
        email: string;
    };
    category: string;
    imageUrl?: string;
    isPrivate: boolean;
    memberCount: number;
    userRole?: 'creator' | 'admin' | 'member' | null;
    isMember?: boolean;
    createdAt: string;
    tags: string[];
}

interface GroupCardProps {
    group: Group;
    onJoin?: (group: Group) => void;
    onView?: (group: Group) => void;
}

export function GroupCard({ group, onJoin, onView }: GroupCardProps) {
    const { joinGroup, leaveGroup, loading } = useGroups();
    const { user } = useAuth();

    // Debug logging
    React.useEffect(() => {
        console.log('GroupCard Debug:', {
            groupId: group._id,
            groupName: group.name,
            isMember: group.isMember,
            userRole: group.userRole,
            userId: user?.id || user?._id
        });
    }, [group, user]);

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
            await joinGroup(group._id);
            toast({
                title: 'Successfully joined!',
                description: `Welcome to ${group.name}`,
            });
            if (onJoin) {
                onJoin(group);
            }
        } catch (error: any) {
            toast({
                title: 'Failed to join group',
                description: error.message || 'Please try again',
                variant: 'destructive'
            });
        }
    };

    const handleLeave = async () => {
        if (!user) {
            toast({
                title: 'Authentication required',
                description: 'Please log in to leave groups',
                variant: 'destructive'
            });
            return;
        }

        // Don't allow creator to leave their own group
        if (group.userRole === 'creator') {
            toast({
                title: 'Cannot leave group',
                description: 'You are the creator of this group. Delete the group instead.',
                variant: 'destructive'
            });
            return;
        }

        try {
            await leaveGroup(group._id);
            toast({
                title: 'Left group',
                description: `You have left ${group.name}`,
            });
        } catch (error: any) {
            toast({
                title: 'Failed to leave group',
                description: error.message || 'Please try again',
                variant: 'destructive'
            });
        }
    };

    const handleView = () => {
        if (onView) {
            onView(group);
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

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                    {group.imageUrl ? (
                        <img 
                            src={group.imageUrl} 
                            alt={group.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                    ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-full flex items-center justify-center">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
                        {group.isPrivate ? (
                            <Lock className="w-3 h-3 text-orange-600" />
                        ) : (
                            <Globe className="w-3 h-3 text-emerald-600" />
                        )}
                    </div>
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                            {group.name}
                        </h3>
                        {group.userRole === 'creator' && (
                            <Crown className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                        )}
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                        <span>by {group.creator?.name || 'Deleted User'}</span>
                        <span className="text-gray-400">•</span>
                        <span>{format(new Date(group.createdAt), 'MMM d, yyyy')}</span>
                    </p>
                </div>
            </div>

            {/* Category Badge */}
            <div className="mb-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(group.category)}`}>
                    {group.category}
                </span>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {group.description}
            </p>

            {/* Tags */}
            {group.tags && group.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {group.tags.slice(0, 3).map((tag, index) => (
                        <span 
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                        >
                            #{tag}
                        </span>
                    ))}
                    {group.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                            +{group.tags.length - 3} more
                        </span>
                    )}
                </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{group.memberCount} members</span>
                </div>
                <div className="flex items-center gap-1">
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span>Host messaging</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                {group.isMember ? (
                    <>
                        <Button
                            onClick={handleView}
                            className="flex-1 bg-primary hover:bg-primary/90 text-white"
                        >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            View Group
                        </Button>
                        {/* Show Leave button only for non-creators */}
                        {group.userRole !== 'creator' && (
                            <Button
                                onClick={handleLeave}
                                disabled={loading}
                                variant="outline"
                                className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                                <UserMinus className="w-4 h-4 mr-2" />
                                Leave
                            </Button>
                        )}
                    </>
                ) : (
                    <>
                        <Button
                            variant="outline"
                            onClick={handleView}
                            className="flex-1"
                        >
                            View Details
                        </Button>
                        <Button
                            onClick={handleJoin}
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white"
                        >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Join
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

interface GroupListProps {
    groups: Group[];
    loading?: boolean;
    onJoin?: (group: Group) => void;
    onView?: (group: Group) => void;
}

export function GroupList({ groups, loading, onJoin, onView }: GroupListProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-pulse">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-5 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (groups.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-6">
                    <Users className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">No groups found</h3>
                <p className="text-gray-500 text-lg">
                    Be the first to create a volunteer group!
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
                <GroupCard
                    key={group._id}
                    group={group}
                    onJoin={onJoin}
                    onView={onView}
                />
            ))}
        </div>
    );
}