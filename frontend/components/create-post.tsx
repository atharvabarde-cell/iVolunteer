'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { usePosts } from '@/contexts/post-context';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { Loader2, ImagePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CreatePost() {
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
        
        const fileInput = fileInputRef.current;
        if (!fileInput?.files?.[0]) {
            toast({
                title: 'Error',
                description: 'Please select an image to upload',
                variant: 'destructive'
            });
            return;
        }

        if (!description.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter a description',
                variant: 'destructive'
            });
            return;
        }

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('description', description.trim());
            formData.append('image', fileInput.files[0]);

            await createPost(formData);

            // Reset form
            setDescription('');
            fileInput.value = '';
            setImagePreview(null);
            
            toast({
                title: 'Success',
                description: 'Post created successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to create post',
                variant: 'destructive'
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
            <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's on your mind?"
                required
                disabled={isUploading}
                className="min-h-[100px] resize-none"
            />
            
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-2"
                    >
                        <ImagePlus className="w-4 h-4" />
                        Choose Image
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        required
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={isUploading}
                    />
                    <Button type="submit" disabled={isUploading} className="ml-auto">
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Posting...
                            </>
                        ) : (
                            'Post'
                        )}
                    </Button>
                </div>

                {imagePreview && (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                        <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-contain"
                        />
                        {!isUploading && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => {
                                    setImagePreview(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                            >
                                Remove
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </form>
    );
}