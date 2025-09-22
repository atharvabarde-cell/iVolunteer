'use client';

import { useEffect, useState } from 'react';
import { CreatePost } from '@/components/create-post';
import { PostDisplay } from '@/components/post-display';
import { usePosts } from '@/contexts/post-context';
import { useAuth } from '@/contexts/auth-context';
import { Loader2, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PostsPage() {
    const { posts, loading, error, getPosts } = usePosts();
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadPosts = async (page = 1) => {
        try {
            const response = await getPosts(page);
            setHasMore(response.currentPage < response.totalPages);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadPosts(1);
        setIsRefreshing(false);
    };

    useEffect(() => {
        loadPosts();
    }, []);

    if (error) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="text-center py-8 space-y-4">
                    <p className="text-red-500">Failed to load posts</p>
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        className="flex items-center gap-2"
                        disabled={isRefreshing}
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Community Posts</h1>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={loading || isRefreshing}
                    className="flex items-center gap-2"
                >
                    <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>
            
            {user ? (
                <div className="mb-8">
                    <CreatePost />
                </div>
            ) : (
                <div className="mb-8 p-6 bg-white rounded-lg shadow text-center">
                    <h2 className="text-lg font-semibold mb-2">Want to share your volunteer experience?</h2>
                    <p className="text-gray-600 mb-4">Sign in to create posts and share your journey with the community.</p>
                    <Button asChild>
                        <a href="/auth">Sign In to Post</a>
                    </Button>
                </div>
            )}

            <div className="space-y-8">
                {loading && currentPage === 1 ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                ) : (
                    <>
                        {posts.map((post) => (
                            <PostDisplay key={post._id} post={post} />
                        ))}

                        {posts.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No posts yet. {user ? 'Be the first to post!' : 'Sign in to create a post!'}</p>
                            </div>
                        )}

                        {posts.length > 0 && hasMore && (
                            <div className="text-center pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => loadPosts(currentPage + 1)}
                                    disabled={loading}
                                    className="flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        'Load More'
                                    )}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}