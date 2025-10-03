import Group from '../models/Group.js';
import { User } from '../models/User.js';
import { cloudinary } from '../config/cloudinary.js';

// Create a new group
export const createGroup = async (req, res) => {
    try {
        const { name, description, category, isPrivate, maxMembers, tags, allowMemberInvites, requireApproval } = req.body;
        const userId = req.user._id || req.user.id;

        // Check if user already has too many groups as creator
        const userGroupsCount = await Group.countDocuments({ creator: userId });
        if (userGroupsCount >= 10) {
            return res.status(400).json({ 
                success: false, 
                message: 'You can only create up to 10 groups' 
            });
        }

        let imageUrl = null;
        let cloudinaryPublicId = null;

        // Handle image upload if provided
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'volunteer-groups',
                    transformation: [
                        { width: 400, height: 400, crop: 'fill' },
                        { quality: 'auto' }
                    ]
                });
                imageUrl = result.secure_url;
                cloudinaryPublicId = result.public_id;
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Failed to upload group image' 
                });
            }
        }

        const group = new Group({
            name,
            description,
            creator: userId,
            category,
            imageUrl,
            cloudinaryPublicId,
            isPrivate: isPrivate === 'true' || isPrivate === true,
            maxMembers: parseInt(maxMembers) || 100,
            tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
            settings: {
                allowMemberInvites: allowMemberInvites !== 'false',
                requireApproval: requireApproval === 'true' || requireApproval === true
            },
            members: [{
                user: userId,
                role: 'admin',
                joinedAt: new Date()
            }]
        });

        await group.save();
        await group.populate([
            { path: 'creator', select: 'name email' },
            { path: 'members.user', select: 'name email' }
        ]);

        res.status(201).json({
            success: true,
            message: 'Group created successfully',
            data: group
        });
    } catch (error) {
        console.error('Create group error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create group' 
        });
    }
};

// Get all groups (with pagination and filters)
export const getGroups = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 12, 
            category, 
            search, 
            isPrivate,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const query = {};

        // Filter by category
        if (category && category !== 'All') {
            query.category = category;
        }

        // Filter by privacy
        if (isPrivate !== undefined) {
            query.isPrivate = isPrivate === 'true';
        } else {
            // By default, show only public groups unless user is member
            query.isPrivate = false;
        }

        // Search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const groups = await Group.find(query)
            .populate('creator', 'name email')
            .populate('members.user', 'name email')
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await Group.countDocuments(query);

        // Add member count to each group
        const groupsWithStats = groups.map(group => ({
            ...group,
            memberCount: group.members.length,
            recentActivity: group.updatedAt
        }));

        res.json({
            success: true,
            data: groupsWithStats,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalGroups: total,
                hasMore: page * limit < total
            }
        });
    } catch (error) {
        console.error('Get groups error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch groups' 
        });
    }
};

// Get user's groups
export const getUserGroups = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { type = 'all' } = req.query; // 'created', 'joined', 'all'

        let query = {};

        if (type === 'created') {
            query.creator = userId;
        } else if (type === 'joined') {
            query = {
                'members.user': userId,
                creator: { $ne: userId }
            };
        } else {
            query = {
                $or: [
                    { creator: userId },
                    { 'members.user': userId }
                ]
            };
        }

        const groups = await Group.find(query)
            .populate('creator', 'name email')
            .populate('members.user', 'name email')
            .sort({ updatedAt: -1 })
            .lean();

        const groupsWithStats = groups.map(group => ({
            ...group,
            memberCount: group.members.length,
            userRole: group.creator.toString() === userId ? 'creator' : 
                     group.members.find(m => m.user._id.toString() === userId)?.role || 'member'
        }));

        res.json({
            success: true,
            data: groupsWithStats
        });
    } catch (error) {
        console.error('Get user groups error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch user groups' 
        });
    }
};

// Get single group details
export const getGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user?._id || req.user?.id;

        const group = await Group.findById(groupId)
            .populate('creator', 'name email')
            .populate('members.user', 'name email')
            .populate('messages.sender', 'name email');

        if (!group) {
            return res.status(404).json({ 
                success: false, 
                message: 'Group not found' 
            });
        }

        // Check if user can access this group
        if (group.isPrivate && userId && !group.isMember(userId)) {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied to private group' 
            });
        }

        const groupData = {
            ...group.toObject(),
            memberCount: group.members.length,
            userRole: userId ? (
                group.creator.toString() === userId ? 'creator' : 
                group.members.find(m => m.user._id.toString() === userId)?.role || null
            ) : null,
            isMember: userId ? group.isMember(userId) : false
        };

        res.json({
            success: true,
            data: groupData
        });
    } catch (error) {
        console.error('Get group error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch group details' 
        });
    }
};

// Join a group
export const joinGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id || req.user.id;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ 
                success: false, 
                message: 'Group not found' 
            });
        }

        if (group.isMember(userId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'You are already a member of this group' 
            });
        }

        if (group.members.length >= group.maxMembers) {
            return res.status(400).json({ 
                success: false, 
                message: 'Group has reached maximum capacity' 
            });
        }

        const success = group.addMember(userId);
        if (!success) {
            return res.status(400).json({ 
                success: false, 
                message: 'Failed to join group' 
            });
        }

        await group.save();
        await group.populate('members.user', 'name email');

        res.json({
            success: true,
            message: 'Successfully joined the group',
            data: group
        });
    } catch (error) {
        console.error('Join group error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to join group' 
        });
    }
};

// Leave a group
export const leaveGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id || req.user.id;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ 
                success: false, 
                message: 'Group not found' 
            });
        }

        if (group.creator.toString() === userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Group creator cannot leave. Transfer ownership or delete the group.' 
            });
        }

        const success = group.removeMember(userId);
        if (!success) {
            return res.status(400).json({ 
                success: false, 
                message: 'You are not a member of this group' 
            });
        }

        await group.save();

        res.json({
            success: true,
            message: 'Successfully left the group'
        });
    } catch (error) {
        console.error('Leave group error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to leave group' 
        });
    }
};

// Send message to group
export const sendMessage = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { content, messageType = 'text' } = req.body;
        const userId = req.user._id || req.user.id;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ 
                success: false, 
                message: 'Group not found' 
            });
        }

        if (!group.isMember(userId)) {
            return res.status(403).json({ 
                success: false, 
                message: 'Only group members can send messages' 
            });
        }

        let imageUrl = null;
        let cloudinaryPublicId = null;

        // Handle image upload for image messages
        if (messageType === 'image' && req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'group-messages',
                    transformation: [
                        { width: 800, height: 600, crop: 'limit' },
                        { quality: 'auto' }
                    ]
                });
                imageUrl = result.secure_url;
                cloudinaryPublicId = result.public_id;
            } catch (uploadError) {
                console.error('Message image upload error:', uploadError);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Failed to upload message image' 
                });
            }
        }

        const message = {
            sender: userId,
            content: content || '',
            messageType,
            imageUrl,
            cloudinaryPublicId,
            createdAt: new Date()
        };

        group.messages.push(message);
        group.updatedAt = new Date();
        await group.save();

        await group.populate('messages.sender', 'name email');
        const newMessage = group.messages[group.messages.length - 1];

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: newMessage
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send message' 
        });
    }
};

// Get group messages
export const getMessages = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        const userId = req.user._id || req.user.id;

        const group = await Group.findById(groupId)
            .populate('messages.sender', 'name email')
            .lean();

        if (!group) {
            return res.status(404).json({ 
                success: false, 
                message: 'Group not found' 
            });
        }

        if (!group.members.some(member => member.user.toString() === userId)) {
            return res.status(403).json({ 
                success: false, 
                message: 'Only group members can view messages' 
            });
        }

        // Sort messages by creation date (newest first for pagination)
        const sortedMessages = group.messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedMessages = sortedMessages.slice(startIndex, endIndex);

        res.json({
            success: true,
            data: paginatedMessages.reverse(), // Reverse to show oldest first in chat
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(group.messages.length / limit),
                totalMessages: group.messages.length,
                hasMore: endIndex < group.messages.length
            }
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch messages' 
        });
    }
};

// Delete a group (only creator)
export const deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id || req.user.id;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ 
                success: false, 
                message: 'Group not found' 
            });
        }

        if (group.creator.toString() !== userId) {
            return res.status(403).json({ 
                success: false, 
                message: 'Only group creator can delete the group' 
            });
        }

        // Delete group image from cloudinary if exists
        if (group.cloudinaryPublicId) {
            try {
                await cloudinary.uploader.destroy(group.cloudinaryPublicId);
            } catch (cloudinaryError) {
                console.error('Failed to delete group image from cloudinary:', cloudinaryError);
            }
        }

        // Delete message images from cloudinary
        for (const message of group.messages) {
            if (message.cloudinaryPublicId) {
                try {
                    await cloudinary.uploader.destroy(message.cloudinaryPublicId);
                } catch (cloudinaryError) {
                    console.error('Failed to delete message image from cloudinary:', cloudinaryError);
                }
            }
        }

        await Group.findByIdAndDelete(groupId);

        res.json({
            success: true,
            message: 'Group deleted successfully'
        });
    } catch (error) {
        console.error('Delete group error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete group' 
        });
    }
};