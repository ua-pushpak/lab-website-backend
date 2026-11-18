const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    page: {
        type: String,
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    uniqueVisitors: {
        type: Number,
        default: 0,
    },
    bounceRate: {
        type: Number,
        default: 0,
    },
    avgTimeOnPage: {
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    visitors: [{
        ip: String,
        userAgent: String,
        timestamp: Date,
        sessionDuration: Number,
    }],
});

module.exports = mongoose.model('Analytics', analyticsSchema);