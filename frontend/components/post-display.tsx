'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { EditPost } from './edit-post';
import { usePosts } from '@/contexts/post-context';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import type { Post, Comment, Reaction } from '@/contexts/post-context';

interface PostDisplayProps {
    post: Post;
}

const reactionTypes = [
    { type: 'like', emoji: '👍' },
    { type: 'love', emoji: '❤️' },
    { type: 'care', emoji: '🤗' },
    { type: 'haha', emoji: '😄' },
    { type: 'wow', emoji: '😮' },
    { type: 'sad', emoji: '😢' },
    { type: 'angry', emoji: '😠' }
] as const;

export function PostDisplay({ post }: PostDisplayProps) {
    const [comment, setComment] = useState('');
    const [isCommenting, setIsCommenting] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

    // const userReaction = null;

    return (
        <article className="bg-white rounded-lg shadow space-y-4 p-4">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image
                            src={post.user.profilePicture || '/placeholder-user.jpg'}
                            alt={post.user.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold">{post.user.name}</h3>
                        <time className="text-sm text-gray-500">
                            {format(new Date(post.createdAt), 'PPpp')}
                            {post.updatedAt !== post.createdAt && (
                                <span className="ml-1">(edited)</span>
                            )}
                        </time>
                    </div>
                </div>
                {user && user._id === post.user._id && (
                    <div className="flex gap-2">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                )}
            </header>

            <p className="text-gray-700">{post.description}</p>

            <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                    src={post.imageUrl}
                    alt="Post image"
                    fill
                    className="object-cover"
                />
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {post.reactions.length > 0 && (
                        <span className="text-sm text-gray-500">
                            {post.reactions.length} reactions
                        </span>
                    )}
                </div>
                <span className="text-sm text-gray-500">
                    {post.comments.length} comments
                </span>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t">
                <div className="relative">
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2"
                        onClick={() => setShowReactions(!showReactions)}
                    >
                        {userReaction ? (
                            reactionTypes.find(r => r.type === userReaction)?.emoji
                        ) : '👍'} {' '}
                        React
                    </Button>
                    {showReactions && (
                        <div className="absolute bottom-full left-0 flex items-center gap-1 p-2 bg-white rounded-lg shadow-lg">
                            {reactionTypes.map(({ type, emoji }) => (
                                <button
                                    key={type}
                                    onClick={() => handleReaction(type)}
                                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {post.comments.length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                    {post.comments.map((comment: Comment) => (
                        <div key={comment._id} className="flex items-start gap-2">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                <Image
                                    src={comment.user.profilePicture || '/placeholder-user.jpg'}
                                    alt={comment.user.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 bg-gray-100 rounded-lg p-2">
                                <div className="flex items-baseline justify-between">
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-semibold">{comment.user.name}</span>
                                        <time className="text-xs text-gray-500">
                                            {format(new Date(comment.createdAt), 'PPpp')}
                                        </time>
                                    </div>
                                    {user && (user._id === comment.user._id || user._id === post.user._id) && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteComment(comment._id)}
                                            className="h-auto p-1 text-xs text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </div>
                                <p className="text-gray-700">{comment.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <form onSubmit={handleAddComment} className="pt-4 border-t">
                <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    required
                    disabled={!user}
                />
                <div className="flex justify-end mt-2">
                    <Button type="submit" disabled={isCommenting || !user}>
                        {isCommenting ? 'Posting...' : 'Post Comment'}
                    </Button>
                </div>
            </form>

            {/* Edit Post Modal */}
            <EditPost 
                post={post} 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
            />
        </article>
    );
}