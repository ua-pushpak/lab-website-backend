const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
    entityType: {
        type: String,
        required: true,
        enum: ['project', 'publication', 'team', 'news', 'site-settings'],
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    version: {
        type: Number,
        required: true,
    },
    isLive: {
        type: Boolean,
        default: false,
    },
    notes: String,
    createdBy: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Version', versionSchema);