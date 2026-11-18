const mongoose = require('mongoose');

const siteBackupSchema = new mongoose.Schema({
    backupName: {
        type: String,
        required: true,
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: String,
        default: 'admin',
    },
});

module.exports = mongoose.model('SiteBackup', siteBackupSchema);