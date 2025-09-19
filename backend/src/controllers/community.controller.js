import { Community } from '../models/Community.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Create a new community
export const createCommunity = asyncHandler(async (req, res) => {
    const { name, description, category, location, isPrivate, guidelines, tags, socialLinks } = req.body;

    // Check if community with same name exists
    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) {
        throw new ApiError(400, 'Community with this name already exists');
    }

    const community = await Community.create({
        name,
        description,
        category,
        location,
        isPrivate,
        guidelines,
        tags,
        socialLinks,
        owner: req.user._id,
        members: [{ user: req.user._id, role: 'admin' }]
    });

    return res.status(201).json(
        new ApiResponse(201, community, 'Community created successfully')
    );
});

// Get all communities with filters
export const getCommunities = asyncHandler(async (req, res) => {
    const { 
        category, 
        location, 
        search, 
        tag,
        page = 1,
        limit = 10,
        sort = 'createdAt'
    } = req.query;

    const query = {};
    
    if (category) query.category = category;
    if (location) query.location = new RegExp(location, 'i');
    if (tag) query.tags = tag;
    if (search) {
        query.$or = [
            { name: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') }
        ];
    }

    const communities = await Community.find(query)
        .populate('owner', 'name email')
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit);

    const total = await Community.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            communities,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        }, 'Communities fetched successfully')
    );
});

// Get a single community by ID
export const getCommunity = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const community = await Community.findById(id)
        .populate('owner', 'name email')
        .populate('members.user', 'name email')
        .populate('events');

    if (!community) {
        throw new ApiError(404, 'Community not found');
    }

    return res.status(200).json(
        new ApiResponse(200, community, 'Community fetched successfully')
    );
});

// Update a community
export const updateCommunity = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const community = await Community.findById(id);
    
    if (!community) {
        throw new ApiError(404, 'Community not found');
    }

    // Check if user is owner or admin
    const userRole = community.getMemberRole(req.user._id);
    if (userRole !== 'admin' && community.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'You do not have permission to update this community');
    }

    // Prevent updating critical fields
    delete updates.owner;
    delete updates.members;
    delete updates.events;

    const updatedCommunity = await Community.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
    ).populate('owner', 'name email');

    return res.status(200).json(
        new ApiResponse(200, updatedCommunity, 'Community updated successfully')
    );
});

// Join a community
export const joinCommunity = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const community = await Community.findById(id);
    
    if (!community) {
        throw new ApiError(404, 'Community not found');
    }

    if (community.isMember(req.user._id)) {
        throw new ApiError(400, 'You are already a member of this community');
    }

    community.addMember(req.user._id);
    await community.save();

    return res.status(200).json(
        new ApiResponse(200, community, 'Successfully joined the community')
    );
});

// Leave a community
export const leaveCommunity = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const community = await Community.findById(id);
    
    if (!community) {
        throw new ApiError(404, 'Community not found');
    }

    if (!community.isMember(req.user._id)) {
        throw new ApiError(400, 'You are not a member of this community');
    }

    // Owner cannot leave the community
    if (community.owner.toString() === req.user._id.toString()) {
        throw new ApiError(400, 'Community owner cannot leave the community');
    }

    community.removeMember(req.user._id);
    await community.save();

    return res.status(200).json(
        new ApiResponse(200, null, 'Successfully left the community')
    );
});

// Delete a community
export const deleteCommunity = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const community = await Community.findById(id);
    
    if (!community) {
        throw new ApiError(404, 'Community not found');
    }

    // Only owner can delete the community
    if (community.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'Only the community owner can delete the community');
    }

    await community.remove();

    return res.status(200).json(
        new ApiResponse(200, null, 'Community deleted successfully')
    );
});