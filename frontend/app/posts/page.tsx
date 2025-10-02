'use client';

import { useEffect, useState, useMemo } from 'react';
import { CreatePost } from '@/components/create-post';
import { PostDisplay } from '@/components/post-display';
import { usePosts } from '@/contexts/post-context';
import { useAuth } from '@/contexts/auth-context';
import { Header } from '@/components/header';
import Footer from '@/components/Footer';
import { Loader2, RefreshCcw, MessageSquare, Users, Sparkles } from 'lucide-react';
import { format, subDays, isAfter } from 'date-fns';
// Category options (should match categoryConfig in post-display)
const categoryOptions = [
    'All',
    'Volunteer Experience',
    'Community Service',
    'Environmental Action',
    'Healthcare Initiative',
    'Education Support',
    'Animal Welfare',
    'Disaster Relief',
    'Fundraising',
    'Social Impact',
    'Personal Story',
    'Achievement',
    'Other',
];

const timeOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'Last 24 Hours', value: '24h' },
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
];

import React from 'react';
import { Button } from '@/components/ui/button';

// CreatePostSection component for toggling form
function CreatePostSection() {
    const [showForm, setShowForm] = React.useState(false);
    return (
        <div className="mb-12">
            {!showForm ? (
                <div className="flex justify-center">
                    <Button
                        onClick={() => setShowForm(true)}
                        className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        + Create Post
                    </Button>
                </div>
            ) : (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-primary/10">
                    <div className="flex justify-end mb-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowForm(false)}
                            className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                        >
                            Cancel
                        </Button>
                    </div>
                    <CreatePost />
                </div>
            )}
        </div>
    );
}

export default function PostsPage() {
    const { posts, loading, error, getPosts } = usePosts();
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedTime, setSelectedTime] = useState('all');
    const [searchText, setSearchText] = useState('');
    // Filtering logic
    const filteredPosts = useMemo(() => {
        let filtered = posts;
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(post => post.category === selectedCategory);
        }
        if (selectedTime !== 'all') {
            const now = new Date();
            let compareDate = null;
            if (selectedTime === '24h') compareDate = subDays(now, 1);
            else if (selectedTime === '7d') compareDate = subDays(now, 7);
            else if (selectedTime === '30d') compareDate = subDays(now, 30);
            if (compareDate) {
                filtered = filtered.filter(post => isAfter(new Date(post.createdAt), compareDate));
            }
        }
        if (searchText.trim() !== '') {
            const lower = searchText.toLowerCase();
            filtered = filtered.filter(post =>
                post.title.toLowerCase().includes(lower) ||
                post.description.toLowerCase().includes(lower)
            );
        }
        return filtered;
    }, [posts, selectedCategory, selectedTime, searchText]);

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
                    <CreatePostSection />
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


                {/* Filter Controls */}
                <div className="flex flex-wrap gap-6 mb-10 justify-center items-end bg-gradient-to-r from-blue-50 via-emerald-50 to-pink-50 rounded-2xl p-6 shadow-md border border-primary/10">
                    {/* Search Input */}
                    <div className="flex flex-col items-start w-full max-w-md">
                        <label htmlFor="search-posts" className="text-sm font-semibold text-primary mb-2 flex items-center gap-1">
                            <span role="img" aria-label="Search">🔍</span> Search Posts
                        </label>
                        <input
                            id="search-posts"
                            type="text"
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            placeholder="Search by title or description..."
                            className="rounded-xl border border-primary/20 bg-white px-4 py-2 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all w-full"
                        />
                    </div>
                    <div className="flex flex-col items-start">
                        <label htmlFor="category-filter" className="text-sm font-semibold text-primary mb-2 flex items-center gap-1">
                            <span role="img" aria-label="Category">📂</span> Category
                        </label>
                        <div className="relative w-48">
                            <select
                                id="category-filter"
                                value={selectedCategory}
                                onChange={e => setSelectedCategory(e.target.value)}
                                className="appearance-none w-full rounded-xl border border-primary/20 bg-white px-4 py-2 pr-10 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                            >
                                {categoryOptions.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary text-lg">▼</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-start">
                        <label htmlFor="time-filter" className="text-sm font-semibold text-primary mb-2 flex items-center gap-1">
                            <span role="img" aria-label="Time">⏰</span> Time
                        </label>
                        <div className="relative w-48">
                            <select
                                id="time-filter"
                                value={selectedTime}
                                onChange={e => setSelectedTime(e.target.value)}
                                className="appearance-none w-full rounded-xl border border-primary/20 bg-white px-4 py-2 pr-10 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                            >
                                {timeOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary text-lg">▼</span>
                        </div>
                    </div>
                </div>

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
                            {filteredPosts.map((post) => (
                                <PostDisplay key={post._id} post={post} searchText={searchText} />
                            ))}

                            {filteredPosts.length === 0 && (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mb-6">
                                        <MessageSquare className="w-10 h-10 text-slate-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-700 mb-3">No posts found</h3>
                                    <p className="text-slate-500 text-lg">
                                        {user ? 'Try changing your filter criteria.' : 'Sign in to create the first post!'}
                                    </p>
                                </div>
                            )}

                            {filteredPosts.length > 0 && hasMore && (
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