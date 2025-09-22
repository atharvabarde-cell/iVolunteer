import Post from '../models/Post.js';
import { deleteImage } from '../config/cloudinary.js';

// Create a new post
export const createPost = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const post = new Post({
            user: req.user._id,
            description: req.body.description,
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

// Get all posts with pagination
export const getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'name profilePicture')
            .populate('comments.user', 'name profilePicture')
            .populate('reactions.user', 'name profilePicture');

        const total = await Post.countDocuments();
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