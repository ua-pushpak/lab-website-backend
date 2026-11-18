const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    institution: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },

    isVisible: {
    type: Boolean,
    default: true,
    },
});

module.exports = mongoose.model('Author', authorSchema);