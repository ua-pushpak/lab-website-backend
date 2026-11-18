const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
    labName: {
        type: String,
        default: 'DroneLab',
    },
    labTagline: {
        type: String,
        default: 'Research Center',
    },
    heroTitle: {
        type: String,
        default: 'Shaping the Future of Autonomous Flight',
    },
    heroSubtitle: {
        type: String,
        default: 'Pioneering research in drone technology, autonomous systems, and aerial robotics.',
    },
    heroTagline: {
        type: String,
        default: 'Advanced Drone Research',
    },
    aboutText: {
        type: String,
        default: 'We push the boundaries of what is possible in the sky.',
    },
    contactEmail: {
        type: String,
        default: 'contact@dronelab.org',
    },
    contactPhone: {
        type: String,
        default: '+1 (555) 123-4567',
    },
    contactAddress: {
        type: String,
        default: '123 Research Avenue, Innovation District, Tech City, 78901',
    },
    stats: [{
        value: String,
        label: String,
    }],
    socialLinks: {
        twitter: String,
        github: String,
        linkedin: String,
        youtube: String,
        instagram: String,
    },
    navigationItems: [{
        name: String,
        path: String,
        order: Number,
    }],
    sections: [{
        name: String,
        title: String,
        subtitle: String,
        content: String,
        imageUrl: String,
        order: Number,
        enabled: {
            type: Boolean,
            default: true,
        },
    }],
    theme: {
        primaryColor: {
            type: String,
            default: '#0ea5e9',
        },
        secondaryColor: {
            type: String,
            default: '#06b6d4',
        },
        backgroundColor: {
            type: String,
            default: '#0f172a',
        },
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);