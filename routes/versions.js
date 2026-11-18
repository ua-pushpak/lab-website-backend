const express = require('express');
const router = express.Router();
const Version = require('../models/Version');

router.get('/:entityType/:entityId', async (req, res) => {
    try {
        const versions = await Version.find({
            entityType: req.params.entityType,
            entityId: req.params.entityId,
        }).sort({ version: -1 });
        
        res.json({ success: true, data: versions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/save', async (req, res) => {
    try {
        const { entityType, entityId, data, notes, createdBy } = req.body;
        
        const lastVersion = await Version.findOne({
            entityType,
            entityId,
        }).sort({ version: -1 });
        
        const newVersion = lastVersion ? lastVersion.version + 1 : 1;
        
        const version = await Version.create({
            entityType,
            entityId,
            data,
            version: newVersion,
            isLive: false,
            notes: notes || `Version ${newVersion}`,
            createdBy: createdBy || 'admin',
        });
        
        res.status(201).json({ success: true, data: version });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.put('/:id/live', async (req, res) => {
    try {
        const version = await Version.findById(req.params.id);
        
        if (!version) {
            return res.status(404).json({ success: false, message: 'Version not found' });
        }
        
        await Version.updateMany(
            { entityType: version.entityType, entityId: version.entityId },
            { isLive: false }
        );
        
        version.isLive = true;
        await version.save();
        
        res.json({ success: true, data: version });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const version = await Version.findByIdAndDelete(req.params.id);
        
        if (!version) {
            return res.status(404).json({ success: false, message: 'Version not found' });
        }
        
        res.json({ success: true, message: 'Version deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/live/:entityType/:entityId', async (req, res) => {
    try {
        const liveVersion = await Version.findOne({
            entityType: req.params.entityType,
            entityId: req.params.entityId,
            isLive: true,
        });
        
        res.json({ success: true, data: liveVersion });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;