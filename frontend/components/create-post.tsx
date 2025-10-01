'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { usePosts } from '@/contexts/post-context';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { ImagePlus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const POST_CATEGORIES = [
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
    'Other'
];

export function CreatePost() {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { createPost } = usePosts();
    const { toast } = useToast();
    const { user } = useAuth();
    const router = useRouter();

    if (!user) {
        router.push('/auth');
        return null;
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast({
                    title: 'Error',
                    description: 'Image size should be less than 5MB',
                    variant: 'destructive'
                });
                fileInputRef.current!.value = '';
                return;
            }

            if (!file.type.startsWith('image/')) {
                toast({
                    title: 'Error',
                    description: 'Please upload an image file',
                    variant: 'destructive'
                });
                fileInputRef.current!.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

        const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim()) {
            toast({
                title: "Missing Title",
                description: "Please provide a title for your post.",
                variant: "destructive",
                duration: 4000,
            });
            return;
        }
        
        if (!category) {
            toast({
                title: "Missing Category",
                description: "Please select a category for your post.",
                variant: "destructive",
                duration: 4000,
            });
            return;
        }
        
        if (!description.trim()) {
            toast({
                title: "Missing Description",
                description: "Please provide a description for your post.",
                variant: "destructive",
                duration: 4000,
            });
            return;
        }

        const selectedFile = fileInputRef.current?.files?.[0];
        if (!selectedFile) {
            toast({
                title: "Missing Photo",
                description: "Please select an image to upload with your post.",
                variant: "destructive",
                duration: 4000,
            });
            return;
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (selectedFile.size > maxSize) {
            toast({
                title: "File Too Large",
                description: "Please choose an image smaller than 5MB.",
                variant: "destructive",
                duration: 4000,
            });
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(selectedFile.type)) {
            toast({
                title: "Invalid File Type",
                description: "Please select a JPG, PNG, or GIF image.",
                variant: "destructive",
                duration: 4000,
            });
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('title', title.trim());
            formData.append('category', category);
            formData.append('description', description.trim());
            formData.append('image', selectedFile);

            await createPost(formData);
            
            // Show success message
            toast({
                title: "Post Published! 🎉",
                description: "Your story has been shared with the community successfully.",
                duration: 5000,
            });
            
            // Reset form
            setTitle('');
            setCategory('');
            setDescription('');
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error: any) {
            console.error('Error creating post:', error);
            
            // Handle specific error types
            let errorTitle = "Publication Failed";
            let errorDescription = "Something went wrong while publishing your post. Please try again.";
            
            if (error?.message?.includes('network') || error?.message?.includes('Network')) {
                errorTitle = "Network Error";
                errorDescription = "Please check your internet connection and try again.";
            } else if (error?.message?.includes('file') || error?.message?.includes('image') || error?.message?.includes('upload')) {
                errorTitle = "Image Upload Failed";
                errorDescription = "There was an issue uploading your image. Please try with a different photo.";
            } else if (error?.response?.data?.message) {
                errorDescription = error.response.data.message;
            } else if (error?.message) {
                errorDescription = error.message;
            }
            
            toast({
                title: errorTitle,
                description: errorDescription,
                variant: "destructive",
                duration: 6000,
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <ImagePlus className="w-6 h-6" />
                        Share Your Story
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">
                        Tell the community about your volunteer experience or impact
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title Field */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                            Title *
                        </Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Give your post a catchy title..."
                            required
                            disabled={isUploading}
                            maxLength={200}
                            className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Make it engaging and descriptive</span>
                            <span>{title.length}/200</span>
                        </div>
                    </div>

                    {/* Category Field */}
                    <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
                            Category *
                        </Label>
                        <Select
                            value={category}
                            onValueChange={setCategory}
                            disabled={isUploading}
                        >
                            <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-all duration-200">
                                <SelectValue placeholder="Choose the best category for your post" />
                            </SelectTrigger>
                            <SelectContent>
                                {POST_CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat} className="py-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">
                                                {cat === 'Volunteer Experience' && '🤝'}
                                                {cat === 'Community Service' && '🏘️'}
                                                {cat === 'Environmental Action' && '🌱'}
                                                {cat === 'Healthcare Initiative' && '🏥'}
                                                {cat === 'Education Support' && '📚'}
                                                {cat === 'Animal Welfare' && '🐾'}
                                                {cat === 'Disaster Relief' && '🆘'}
                                                {cat === 'Fundraising' && '💰'}
                                                {cat === 'Social Impact' && '🌟'}
                                                {cat === 'Personal Story' && '📖'}
                                                {cat === 'Achievement' && '🏆'}
                                                {cat === 'Other' && '📝'}
                                            </span>
                                            {cat}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Description Field */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                            Description *
                        </Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Share your story, experience, or thoughts in detail. What happened? How did it make you feel? What impact did you make?"
                            required
                            disabled={isUploading}
                            className="min-h-[120px] resize-none border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                        />
                        <p className="text-xs text-gray-500">
                            Describe your experience, what you learned, and the impact you made
                        </p>
                    </div>

                    {/* Image Upload Section */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700">
                            Photo *
                        </Label>
                        
                        {!imagePreview ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors duration-200">
                                <div 
                                    className="p-8 text-center cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                        <ImagePlus className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                        Upload a photo
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-4">
                                        Choose an image that best represents your story
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={isUploading}
                                        className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                                    >
                                        Choose Photo
                                    </Button>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Maximum size: 5MB • Supported: JPG, PNG, GIF
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative group">
                                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200">
                                    <Image
                                        src={imagePreview}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200" />
                                    {!isUploading && (
                                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="bg-white/90 hover:bg-white text-gray-700"
                                            >
                                                Change
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="bg-red-500/90 hover:bg-red-500 text-white"
                                                onClick={() => {
                                                    setImagePreview(null);
                                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            required
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={isUploading}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <Button 
                            type="submit" 
                            disabled={isUploading || !title.trim() || !category || !description.trim()}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 h-12 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    <ImagePlus className="mr-2 h-5 w-5" />
                                    Publish Post
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}