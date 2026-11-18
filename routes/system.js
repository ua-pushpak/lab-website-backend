const express = require('express');
const router = express.Router();
const os = require('os');
const mongoose = require('mongoose');

router.get('/info', async (req, res) => {
    try {
        const systemInfo = {
            platform: os.platform(),
            architecture: os.arch(),
            hostname: os.hostname(),
            cpuCount: os.cpus().length,
            cpuModel: os.cpus()[0].model,
            totalMemory: (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2) + ' GB',
            freeMemory: (os.freemem() / (1024 * 1024 * 1024)).toFixed(2) + ' GB',
            uptime: (os.uptime() / 3600).toFixed(2) + ' hours',
            nodeVersion: process.version,
            mongooseVersion: mongoose.version,
            databaseStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
            databaseName: mongoose.connection.name,
            serverTime: new Date().toISOString(),
            processId: process.pid,
            processMemory: (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2) + ' MB',
        };
        res.json({ success: true, data: systemInfo });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/database-stats', async (req, res) => {
    try {
        const dbStats = await mongoose.connection.db.stats();
        res.json({ success: true, data: dbStats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;