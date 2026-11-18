const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    titleHindi: String,
    description: {
        type: String,
        required: true,
    },
    descriptionHindi: String,
    status: {
        type: String,
        enum: ['ongoing', 'completed', 'planned'],
        default: 'ongoing',
    },
    category: {
        type: String,
        enum: ['Autonomy', 'Swarm', 'Vision', 'Energy', 'Communication'],
        required: true,
    },
    imageUrl: String,
    videoUrl: String,
    technologies: [String],
    teamMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeamMember',
    }],
    startDate: Date,
    endDate: Date,
    funding: Number,
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    tags: [String],
    featured: {
        type: Boolean,
        default: false,
    },
    metrics: {
        flights_completed: Number,
        success_rate: Number,
        avg_flight_time: Number,
        data_collected: String,
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

module.exports = mongoose.model('Project', projectSchema);