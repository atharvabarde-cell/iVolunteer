'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { usePosts } from '@/contexts/post-context';
import { useToast } from '@/hooks/use-toast';
import type { Post } from '@/contexts/post-context';

interface EditPostProps {
    post: Post;
    isOpen: boolean;
    onClose: () => void;
}

export function EditPost({ post, isOpen, onClose }: EditPostProps) {
    const [description, setDescription] = useState(post.description);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(post.imageUrl);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { updatePost } = usePosts();
    const { toast } = useToast();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter a description',
                variant: 'destructive'
            });
            return;
        }

        // Show confirmation if post has comments
        if (post.comments.length > 0 && !showConfirmation) {
            setShowConfirmation(true);
            return;
        }

        try {
            setIsUpdating(true);
            const formData = new FormData();
            formData.append('description', description);
            
            if (image) {
                formData.append('image', image);
            }

            await updatePost(post._id, formData);
            
            toast({
                title: 'Success',
                description: 'Post updated successfully. All comments have been reset.',
            });
            
            onClose();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update post',
                variant: 'destructive'
            });
        } finally {
            setIsUpdating(false);
            setShowConfirmation(false);
        }
    };

    const handleCancel = () => {
        // Reset to original values
        setDescription(post.description);
        setImage(null);
        setImagePreview(post.imageUrl);
        setShowConfirmation(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md mx-auto">
                <DialogHeader>
                    <DialogTitle>Edit Post</DialogTitle>
                </DialogHeader>
                
                {!showConfirmation ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {post.comments.length > 0 && (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                <p className="text-sm text-yellow-800">
                                    ⚠️ <strong>Note:</strong> Updating this post will remove all {post.comments.length} existing comment{post.comments.length > 1 ? 's' : ''} to maintain content relevance.
                                </p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Description
                            </label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What's on your mind?"
                                required
                                rows={4}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Update Image (optional)
                            </label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>

                        {imagePreview && (
                            <div className="relative aspect-video rounded-lg overflow-hidden">
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        <div className="flex gap-2 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isUpdating}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating ? 'Updating...' : 'Update Post'}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                            <div className="flex items-start gap-3">
                                <div className="text-red-600 text-xl">⚠️</div>
                                <div>
                                    <h3 className="font-semibold text-red-800 mb-2">Confirm Update</h3>
                                    <p className="text-sm text-red-700 mb-3">
                                        This post currently has <strong>{post.comments.length} comment{post.comments.length > 1 ? 's' : ''}</strong>. 
                                        Updating the post will permanently delete all comments. This action cannot be undone.
                                    </p>
                                    <p className="text-sm text-red-700">
                                        Are you sure you want to proceed?
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowConfirmation(false)}
                                disabled={isUpdating}
                            >
                                Go Back
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleSubmit}
                                disabled={isUpdating}
                            >
                                {isUpdating ? 'Updating...' : 'Yes, Update Post'}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}