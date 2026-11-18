const mongoose = require('mongoose');

const newsArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    titleHindi: String,
    content: {
        type: String,
        required: true,
    },
    contentHindi: String,
    category: {
        type: String,
        enum: ['announcement', 'achievement', 'event', 'media', 'publication'],
        default: 'announcement',
    },
    imageUrl: String,
    date: {
        type: Date,
        default: Date.now,
    },
    author: String,
    tags: [String],
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

module.exports = mongoose.model('NewsArticle', newsArticleSchema);