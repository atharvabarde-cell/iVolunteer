import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { upload } from '../config/cloudinary.js';
import {
    createPost,
    getPosts,
    addComment,
    toggleReaction,
    deletePost
} from '../controllers/post.controller.js';

const router = express.Router();

// Get all posts (public route)
router.get('/', getPosts);

// Protected routes (require authentication)
router.post('/', authMiddleware, upload.single('image'), createPost);
router.post('/:postId/comments', authMiddleware, addComment);
router.post('/:postId/reactions', authMiddleware, toggleReaction);
router.delete('/:postId', authMiddleware, deletePost);

export default router;
