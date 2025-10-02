'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { EditPost } from './edit-post';
import { usePosts } from '@/contexts/post-context';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { 
    Heart, 
    MessageCircle, 
    MoreHorizontal, 
    Edit3, 
    Trash2, 
    Send,
    Clock,
    User,
    ThumbsUp,
    Smile,
    Eye,
    AlertTriangle
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from './ui/alert-dialog';
import type { Post, Comment, Reaction } from '@/contexts/post-context';

interface PostDisplayProps {
    post: Post;
}

const reactionTypes = [
    { type: 'like', emoji: '👍', label: 'Like', color: 'text-blue-600' },
    { type: 'love', emoji: '❤️', label: 'Love', color: 'text-red-600' },
    { type: 'care', emoji: '🤗', label: 'Care', color: 'text-yellow-600' },
    { type: 'haha', emoji: '😄', label: 'Haha', color: 'text-orange-600' },
    { type: 'wow', emoji: '😮', label: 'Wow', color: 'text-purple-600' },
    { type: 'sad', emoji: '😢', label: 'Sad', color: 'text-gray-600' },
    { type: 'angry', emoji: '😠', label: 'Angry', color: 'text-red-800' }
] as const;

const categoryConfig = {
    'Volunteer Experience': { icon: '🤝', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'Community Service': { icon: '🏘️', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    'Environmental Action': { icon: '🌱', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    'Healthcare Initiative': { icon: '🏥', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    'Education Support': { icon: '📚', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    'Animal Welfare': { icon: '🐾', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    'Disaster Relief': { icon: '🆘', bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
    'Fundraising': { icon: '💰', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    'Social Impact': { icon: '🌟', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    'Personal Story': { icon: '📖', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
    'Achievement': { icon: '🏆', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    'Other': { icon: '📝', bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
};

// Accept optional searchText prop for highlighting
interface PostDisplayWithSearchProps extends PostDisplayProps {
    searchText?: string;
}

export function PostDisplay({ post, searchText }: PostDisplayWithSearchProps) {
    // Highlight helper
    function highlightText(text: string, highlight: string) {
        if (!highlight || highlight.trim() === '') return text;
        const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, i) =>
            regex.test(part)
                ? <mark key={i} className="bg-yellow-200 text-yellow-900 px-1 rounded">{part}</mark>
                : part
        );
    }
    const [comment, setComment] = useState('');
    const [isCommenting, setIsCommenting] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const { addComment, deleteComment, toggleReaction, deletePost } = usePosts();
    const { user } = useAuth();
    const { toast } = useToast();

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast({
                title: 'Error',
                description: 'Please login to comment',
                variant: 'destructive'
            });
            return;
        }

        try {
            setIsCommenting(true);
            await addComment(post._id, comment);
            setComment('');
            toast({
                title: 'Success',
                description: 'Comment added successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to add comment',
                variant: 'destructive'
            });
        } finally {
            setIsCommenting(false);
        }
    };

    const handleReaction = async (type: Reaction['type']) => {
        if (!user) {
            toast({
                title: 'Error',
                description: 'Please login to react',
                variant: 'destructive'
            });
            return;
        }

        try {
            await toggleReaction(post._id, type);
            setShowReactions(false);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update reaction',
                variant: 'destructive'
            });
        }
    };

    const handleDelete = async () => {
        if (!user || user._id !== post.user._id) return;

        try {
            await deletePost(post._id);
            toast({
                title: 'Success',
                description: 'Post deleted successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete post',
                variant: 'destructive'
            });
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!user) return;

        try {
            await deleteComment(post._id, commentId);
            toast({
                title: 'Success',
                description: 'Comment deleted successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete comment',
                variant: 'destructive'
            });
        }
    };

    const userReaction = user 
        ? post.reactions.find(reaction => reaction.user._id === user._id)?.type 
        : null;

    const categoryStyle = categoryConfig[post.category as keyof typeof categoryConfig] || categoryConfig['Other'];

    return (
        <article className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
            {/* Header */}
            <div className="p-6 pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-md">
                            <Image
                                src={post.user.profilePicture || '/placeholder-user.jpg'}
                                alt={post.user.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-900">{post.user.name}</h3>
                                <User className="w-4 h-4 text-blue-500" />
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                <time>
                                    {format(new Date(post.createdAt), 'MMM d, yyyy • h:mm a')}
                                    {post.updatedAt !== post.createdAt && (
                                        <span className="ml-1 text-amber-600 font-medium">(edited)</span>
                                    )}
                                </time>
                            </div>
                        </div>
                    </div>
                    
                    {user && user._id === post.user._id && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                                    <Edit3 className="mr-2 h-4 w-4" />
                                    Edit Post
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="text-red-600"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Post
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="px-6 space-y-4">
                {/* Category Badge */}
                <div className="flex items-center gap-2">
                    <Badge 
                        variant="secondary" 
                        className={`${categoryStyle.bg} ${categoryStyle.text} border ${categoryStyle.border} font-semibold px-3 py-1`}
                    >
                        <span className="mr-1 text-sm">{categoryStyle.icon}</span>
                        {post.category}
                    </Badge>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                    {highlightText(post.title, searchText || '')}
                </h2>

                {/* Description */}
                <p className="text-gray-700 leading-relaxed">
                    {highlightText(post.description, searchText || '')}
                </p>
            </div>

            {/* Image */}
            <div className="relative aspect-[16/10] mx-6 my-4 rounded-xl overflow-hidden bg-gray-100">
                <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Engagement Stats */}
            <div className="px-6 py-3 bg-gray-50/50">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                        {post.reactions.length > 0 && (
                            <div className="flex items-center gap-1">
                                <div className="flex -space-x-1">
                                    {reactionTypes.slice(0, 3).map(({ emoji }) => (
                                    <span key={emoji} className="flex w-6 h-6 bg-white rounded-full border shadow-sm text-sm items-center justify-center">
                                        {emoji}
                                    </span>
                                    ))}
                                </div>
                                <span className="ml-1 font-medium">
                                    {post.reactions.length} {post.reactions.length === 1 ? 'reaction' : 'reactions'}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span className="font-medium">
                            {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
                        </span>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="px-6 py-3">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Button
                            variant={userReaction ? "default" : "ghost"}
                            className={`flex items-center gap-2 flex-1 ${userReaction ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'hover:bg-blue-50 hover:text-blue-600'}`}
                            onClick={() => setShowReactions(!showReactions)}
                        >
                            {userReaction ? (
                                <>
                                    <span className="text-lg">
                                        {reactionTypes.find(r => r.type === userReaction)?.emoji}
                                    </span>
                                    {reactionTypes.find(r => r.type === userReaction)?.label}
                                </>
                            ) : (
                                <>
                                    <ThumbsUp className="w-4 h-4" />
                                    React
                                </>
                            )}
                        </Button>
                        
                        {showReactions && (
                            <div className="absolute bottom-full left-0 mb-2 flex items-center gap-1 p-3 bg-white rounded-xl shadow-lg border z-10">
                                {reactionTypes.map(({ type, emoji, label, color }) => (
                                    <button
                                        key={type}
                                        onClick={() => handleReaction(type)}
                                        className="group relative p-2 hover:scale-125 transition-transform duration-200"
                                        title={label}
                                    >
                                        <span className="text-xl">{emoji}</span>
                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {label}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 flex-1 hover:bg-green-50 hover:text-green-600"
                        onClick={() => setShowComments(!showComments)}
                    >
                        <MessageCircle className="w-4 h-4" />
                        Comment
                    </Button>
                </div>
            </div>

            {/* Comments Section */}
            {(showComments || post.comments.length > 0) && (
                <>
                    <Separator />
                    <div className="px-6 py-4 space-y-4">
                        {post.comments.length > 0 && (
                            <div className="space-y-3">
                                {post.comments.map((comment: Comment) => (
                                    <div key={comment._id} className="flex gap-3 group">
                                        <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-sm">
                                            <Image
                                                src={comment.user.profilePicture || '/placeholder-user.jpg'}
                                                alt={comment.user.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="bg-gray-100 rounded-2xl px-4 py-3 relative">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-semibold text-gray-900 text-sm">
                                                        {comment.user.name}
                                                    </span>
                                                    <time className="text-xs text-gray-500">
                                                        {format(new Date(comment.createdAt), 'MMM d • h:mm a')}
                                                    </time>
                                                </div>
                                                <p className="text-gray-800 leading-relaxed">
                                                    {comment.content}
                                                </p>
                                                {user && (user._id === comment.user._id || user._id === post.user._id) && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteComment(comment._id)}
                                                        className="absolute top-2 right-2 h-6 w-6 p-0 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add Comment Form */}
                        <form onSubmit={handleAddComment} className="flex gap-3">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-sm">
                                <Image
                                    src={
                                        // user?.profilePicture || 
                                        '/placeholder-user.jpg'}
                                    alt={user?.name || 'User'}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 flex gap-2">
                                <Textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder={user ? "Write a thoughtful comment..." : "Please login to comment"}
                                    required
                                    disabled={!user || isCommenting}
                                    className="min-h-[44px] resize-none border-2 focus:border-blue-500 rounded-xl"
                                />
                                <Button 
                                    type="submit" 
                                    disabled={isCommenting || !user || !comment.trim()}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
                                >
                                    {isCommenting ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </>
            )}

            {/* Edit Post Modal */}
            <EditPost 
                post={post} 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            Delete Post
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this post? This action cannot be undone.
                            All comments and reactions will be permanently removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Delete Post
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </article>
    );
}