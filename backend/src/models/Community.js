import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Community name is required'],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Community description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters long'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
        type: String,
        required: [true, 'Community category is required'],
        enum: {
            values: ['environmental', 'education', 'healthcare', 'social-welfare', 'animal-welfare', 'arts-culture', 'community-development', 'other'],
            message: '{VALUE} is not a supported category'
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Community owner is required']
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['admin', 'moderator', 'member'],
            default: 'member'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    location: {
        type: String,
        required: [true, 'Community location is required'],
        trim: true
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    guidelines: {
        type: String,
        trim: true,
        maxlength: [2000, 'Guidelines cannot exceed 2000 characters']
    },
    tags: [{
        type: String,
        trim: true
    }],
    socialLinks: {
        website: String,
        facebook: String,
        twitter: String,
        instagram: String,
        linkedin: String
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
communitySchema.index({ name: 1 }, { unique: true });
communitySchema.index({ category: 1 });
communitySchema.index({ location: 1 });
communitySchema.index({ tags: 1 });

// Virtual for member count
communitySchema.virtual('memberCount').get(function() {
    return this.members.length;
});

// Methods
communitySchema.methods.isMember = function(userId) {
    return this.members.some(member => member.user.toString() === userId.toString());
};

communitySchema.methods.getMemberRole = function(userId) {
    const member = this.members.find(m => m.user.toString() === userId.toString());
    return member ? member.role : null;
};

communitySchema.methods.addMember = function(userId, role = 'member') {
    if (!this.isMember(userId)) {
        this.members.push({ user: userId, role });
        return true;
    }
    return false;
};

communitySchema.methods.removeMember = function(userId) {
    const initialLength = this.members.length;
    this.members = this.members.filter(member => member.user.toString() !== userId.toString());
    return this.members.length !== initialLength;
};

// Query helpers
communitySchema.statics.findByCategory = function(category) {
    return this.find({ category }).populate('owner', 'name email');
};

communitySchema.statics.findByLocation = function(location) {
    return this.find({ 
        location: new RegExp(location, 'i')
    }).populate('owner', 'name email');
};

export const Community = mongoose.model('Community', communitySchema);