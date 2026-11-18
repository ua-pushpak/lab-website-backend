const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    nameHindi: String,
    title: String,
    titleHindi: String,
    role: {
        type: String,
        enum: ['PI', 'Co-PI', 'researcher', 'engineer', 'student', 'advisor'],
        required: true,
    },
    email: String,
    photoUrl: String,
    bio: String,
    bioHindi: String,
    researchInterests: [String],
    publications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Publication',
    }],
    socialLinks: {
        linkedin: String,
        github: String,
        twitter: String,
        googleScholar: String,
    },
    skills: [{
        label: String,
        value: Number,
    }],
    featured: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

    isVisible: {
    type: Boolean,
    default: true,
    },
});

module.exports = mongoose.model('TeamMember', teamMemberSchema);