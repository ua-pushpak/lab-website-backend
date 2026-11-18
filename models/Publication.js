const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    authors: [{
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Author',
        },
    }],
    journal: String,
    year: Number,
    doi: String,
    abstract: String,
    category: {
        type: String,
        enum: ['journal', 'conference', 'preprint'],
        default: 'journal',
    },
    citations: {
        type: Number,
        default: 0,
    },
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

module.exports = mongoose.model('Publication', publicationSchema);