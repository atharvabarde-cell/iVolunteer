'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGroups } from '@/contexts/groups-context';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { 
    Send, 
    Image as ImageIcon, 
    Users, 
    ArrowLeft, 
    Crown, 
    Settings,
    MoreVertical,
    MessageSquare
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Message {
    _id: string;
    sender: {
        _id: string;
        name: string;
        email: string;
    };
    content: string;
    messageType: 'text' | 'image' | 'announcement';
    imageUrl?: string;
    createdAt: string;
}

interface GroupChatProps {
    groupId: string;
    onBack?: () => void;
}

export function GroupChat({ groupId, onBack }: GroupChatProps) {
    const { currentGroup, getGroup, sendMessage, getMessages, loading } = useGroups();
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [messagesLoading, setMessagesLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (groupId) {
            loadGroupData();
        }
    }, [groupId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadGroupData = async () => {
        try {
            setMessagesLoading(true);
            await getGroup(groupId);
            const messagesData = await getMessages(groupId);
            setMessages(messagesData.data || []);
        } catch (error: any) {
            toast({
                title: 'Failed to load group',
                description: error.message || 'Please try again',
                variant: 'destructive'
            });
        } finally {
            setMessagesLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            toast({
                title: 'Authentication required',
                description: 'Please log in to send messages',
                variant: 'destructive'
            });
            return;
        }

        if (!newMessage.trim()) return;

        try {
            setSending(true);
            const message = await sendMessage(groupId, newMessage.trim());
            setMessages(prev => [...prev, message]);
            setNewMessage('');
        } catch (error: any) {
            toast({
                title: 'Failed to send message',
                description: error.message || 'Please try again',
                variant: 'destructive'
            });
        } finally {
            setSending(false);
        }
    };

    const isCreator = currentGroup?.creator._id === user?._id;
    const isAdmin = currentGroup?.userRole === 'admin' || isCreator;

    if (loading || messagesLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-[600px] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-emerald-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <MessageSquare className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <p className="text-gray-600">Loading group chat...</p>
                </div>
            </div>
        );
    }

    if (!currentGroup) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-[600px] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">Group not found</p>
                    {onBack && (
                        <Button onClick={onBack} variant="outline" className="mt-4">
                            Go Back
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-[700px] flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-emerald-500/5 rounded-t-2xl">
                {onBack && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="flex-shrink-0"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                )}
                
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {currentGroup.imageUrl ? (
                        <img 
                            src={currentGroup.imageUrl} 
                            alt={currentGroup.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                    ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-emerald-600 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                            {currentGroup.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {currentGroup.memberCount} members
                        </p>
                    </div>

                    {isCreator && (
                        <Crown className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    )}
                </div>

                <Button variant="ghost" size="sm" className="flex-shrink-0">
                    <MoreVertical className="w-4 h-4" />
                </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No messages yet</p>
                        <p className="text-sm text-gray-400">Be the first to start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => {
                        const isOwnMessage = message.sender._id === user?._id;
                        
                        return (
                            <div
                                key={message._id}
                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                                    {!isOwnMessage && (
                                        <p className="text-xs text-gray-500 mb-1 px-3">
                                            {message.sender.name}
                                        </p>
                                    )}
                                    
                                    <div
                                        className={`px-4 py-2 rounded-2xl ${
                                            isOwnMessage
                                                ? 'bg-gradient-to-r from-primary to-emerald-600 text-white rounded-br-md'
                                                : 'bg-gray-100 text-gray-900 rounded-bl-md'
                                        }`}
                                    >
                                        {message.messageType === 'image' && message.imageUrl ? (
                                            <div className="space-y-2">
                                                <img
                                                    src={message.imageUrl}
                                                    alt="Shared image"
                                                    className="rounded-lg max-w-full h-auto"
                                                />
                                                {message.content && (
                                                    <p className="text-sm">{message.content}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm whitespace-pre-wrap">
                                                {message.content}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <p className={`text-xs mt-1 px-3 ${
                                        isOwnMessage ? 'text-right text-gray-500' : 'text-left text-gray-500'
                                    }`}>
                                        {format(new Date(message.createdAt), 'HH:mm')}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            {user && currentGroup.isMember ? (
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                disabled={sending}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full"
                                disabled={sending}
                            >
                                <ImageIcon className="w-4 h-4 text-gray-400" />
                            </Button>
                        </div>
                        
                        <Button
                            type="submit"
                            disabled={sending || !newMessage.trim()}
                            size="sm"
                            className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white rounded-full px-4 py-3"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="p-4 border-t border-gray-200 text-center">
                    <p className="text-gray-500">
                        {!user ? 'Sign in to participate in the chat' : 'Join the group to send messages'}
                    </p>
                </div>
            )}
        </div>
    );
}