import Post from '../models/Post.js';
import { deleteImage } from '../config/cloudinary.js';

// Get all available categories
export const getCategories = async (req, res) => {
    try {
        const categories = [
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
        
        res.json({ categories });
    } catch (error) {
        console.error('Error getting categories:', error);
        res.status(500).json({ message: 'Error getting categories' });
    }
};

// Create a new post
export const createPost = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const { title, category, description } = req.body;

        // Validate required fields
        if (!title || !category || !description) {
            return res.status(400).json({ 
                message: 'Title, category, and description are required' 
            });
        }

        const post = new Post({
            user: req.user._id,
            title: title.trim(),
            category,
            description: description.trim(),
            imageUrl: req.file.path,
            cloudinaryPublicId: req.file.filename
        });

        await post.save();
        await post.populate('user', 'name profilePicture');
        
        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post' });
    }
};

// Get all posts with pagination and optional category filtering
export const getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { category } = req.query;

        // Build query object
        const query = {};
        if (category && category !== 'all') {
            query.category = category;
        }

        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'name profilePicture')
            .populate('comments.user', 'name profilePicture')
            .populate('reactions.user', 'name profilePicture');

        const total = await Post.countDocuments(query);
        res.json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPosts: total
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
};

// Add a comment to a post
export const addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = {
            user: req.user._id,
            content: req.body.content
        };

        post.comments.push(comment);
        await post.save();
        await post.populate('comments.user', 'name profilePicture');

        res.json(post.comments[post.comments.length - 1]);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Error adding comment' });
    }
};

// Delete a comment from a post
export const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if the user is the owner of the comment or the post
        if (comment.user.toString() !== req.user._id.toString() && 
            post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        post.comments.pull(commentId);
        await post.save();

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Error deleting comment' });
    }
};

// Add or update reaction to a post
export const toggleReaction = async (req, res) => {
    try {
        const { postId } = req.params;
        const { type } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user already reacted
        const existingReaction = post.reactions.find(
            reaction => reaction.user.toString() === req.user._id.toString()
        );

        if (existingReaction) {
            if (existingReaction.type === type) {
                // Remove reaction if same type
                post.reactions = post.reactions.filter(
                    reaction => reaction.user.toString() !== req.user._id.toString()
                );
            } else {
                // Update reaction type
                existingReaction.type = type;
            }
        } else {
            // Add new reaction
            post.reactions.push({
                user: req.user._id,
                type
            });
        }

        await post.save();
        await post.populate('reactions.user', 'name profilePicture');

        res.json(post.reactions);
    } catch (error) {
        console.error('Error toggling reaction:', error);
        res.status(500).json({ message: 'Error toggling reaction' });
    }
};

// Update a post
export const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user is the owner of the post
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }

        // Update title if provided
        if (req.body.title !== undefined) {
            post.title = req.body.title.trim();
        }

        // Update category if provided
        if (req.body.category !== undefined) {
            post.category = req.body.category;
        }

        // Update description if provided
        if (req.body.description !== undefined) {
            post.description = req.body.description.trim();
        }

        // Update image if provided
        if (req.file) {
            // Delete old image from Cloudinary
            await deleteImage(post.cloudinaryPublicId);
            
            // Update with new image
            post.imageUrl = req.file.path;
            post.cloudinaryPublicId = req.file.filename;
        }

        // Reset all comments when post is updated
        post.comments = [];

        await post.save();
        await post.populate('user', 'name profilePicture');
        await post.populate('comments.user', 'name profilePicture');
        await post.populate('reactions.user', 'name profilePicture');

        res.json(post);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Error updating post' });
    }
};

// Delete a post
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user is the owner of the post
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        // Delete image from Cloudinary
        await deleteImage(post.cloudinaryPublicId);
        
        // Delete post from database
        await post.deleteOne();

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Error deleting post' });
    }
};