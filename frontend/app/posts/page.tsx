'use client';

import { useEffect, useState } from 'react';
import { CreatePost } from '@/components/create-post';
import { PostDisplay } from '@/components/post-display';
import { usePosts } from '@/contexts/post-context';
import { useAuth } from '@/contexts/auth-context';
import { Header } from '@/components/header';
import Footer from '@/components/Footer';
import { Loader2, RefreshCcw, MessageSquare, Users, Sparkles } from 'lucide-react';
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
            <div className="min-h-screen bg-background relative overflow-hidden">
                {/* Decorative gradient blobs */}
                <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-gradient-to-tr from-pink-300/30 via-yellow-200/30 to-emerald-200/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-[-80px] w-80 h-80 bg-gradient-to-br from-blue-300/20 via-purple-200/20 to-pink-200/20 rounded-full blur-2xl animate-bounce" style={{ animationDuration: "7s" }}></div>
                
                <Header />
                <main className="relative px-4 sm:px-6 md:px-8 pb-24 max-w-4xl mx-auto">
                    <div className="text-center py-16 space-y-6">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2 font-serif">Oops! Something went wrong</h2>
                        <p className="text-slate-600 text-lg">Failed to load community posts</p>
                        <Button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            {isRefreshing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Refreshing...
                                </>
                            ) : (
                                <>
                                    <RefreshCcw className="w-4 h-4 mr-2" />
                                    Try Again
                                </>
                            )}
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Decorative gradient blobs */}
            <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-gradient-to-tr from-pink-300/30 via-yellow-200/30 to-emerald-200/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-40 right-[-80px] w-80 h-80 bg-gradient-to-br from-blue-300/20 via-purple-200/20 to-pink-200/20 rounded-full blur-2xl animate-bounce" style={{ animationDuration: "7s" }}></div>
            <div className="absolute bottom-[-80px] left-20 w-96 h-96 bg-gradient-to-tr from-orange-200/20 via-rose-100/20 to-yellow-100/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "5s" }}></div>

            <Header />
            <main className="relative px-4 sm:px-6 md:px-8 pb-24 max-w-4xl mx-auto">
                {/* Page Header */}
                <section className="mt-12 mb-12 text-center">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-emerald-500/10 px-6 py-3 rounded-full mb-6">
                        <MessageSquare className="w-6 h-6 text-primary" />
                        <span className="text-primary font-semibold">Community Hub</span>
                        <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 font-serif">Community Posts</h1>
                    <p className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto">Share your volunteer journey, inspire others, and connect with like-minded changemakers in our community</p>
                </section>

                {/* Stats Section */}
                <section className="mb-12 flex gap-4 justify-center">
                    <div className="flex-1 max-w-xs flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg hover:scale-105 transition-transform duration-300">
                        <Users className="w-6 h-6 mb-2" />
                        <span className="text-xl font-bold">{posts.length}</span>
                        <span className="text-sm uppercase">Active Posts</span>
                    </div>
                    <div className="flex-1 max-w-xs flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg hover:scale-105 transition-transform duration-300">
                        <MessageSquare className="w-6 h-6 mb-2" />
                        <span className="text-xl font-bold">Community</span>
                        <span className="text-sm uppercase">Sharing</span>
                    </div>
                </section>

                {/* Refresh Button */}
                <div className="flex justify-center mb-8">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={loading || isRefreshing}
                        className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-primary/20 hover:bg-primary/5 transition-all duration-300"
                    >
                        <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh Posts
                    </Button>
                </div>
                
                {/* Create Post Section */}
                {user ? (
                    <div className="mb-12">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-primary/10">
                            <CreatePost />
                        </div>
                    </div>
                ) : (
                    <div className="mb-12">
                        <div className="bg-gradient-to-br from-primary/5 to-emerald-500/5 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-primary/10 text-center">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-emerald-600 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">Want to share your volunteer experience?</h2>
                            <p className="text-slate-600 text-lg mb-6 max-w-md mx-auto">Sign in to create posts and share your journey with the community.</p>
                            <Button 
                                asChild
                                className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                <a href="/auth">Sign In to Post</a>
                            </Button>
                        </div>
                    </div>
                )}

                {/* Posts Content */}
                <div className="space-y-8">
                    {loading && currentPage === 1 ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                            <p className="text-slate-600 text-lg">Loading community posts...</p>
                        </div>
                    ) : (
                        <>
                            {posts.map((post) => (
                                <div key={post._id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-primary/10 overflow-hidden hover:shadow-xl transition-all duration-300">
                                    <PostDisplay post={post} />
                                </div>
                            ))}

                            {posts.length === 0 && (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mb-6">
                                        <MessageSquare className="w-10 h-10 text-slate-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-700 mb-3">No posts yet</h3>
                                    <p className="text-slate-500 text-lg">
                                        {user ? 'Be the first to share your volunteer experience!' : 'Sign in to create the first post!'}
                                    </p>
                                </div>
                            )}

                            {posts.length > 0 && hasMore && (
                                <div className="text-center pt-8">
                                    <Button
                                        onClick={() => loadPosts(currentPage + 1)}
                                        disabled={loading}
                                        className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                Loading More Posts...
                                            </>
                                        ) : (
                                            'Load More Posts'
                                        )}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}