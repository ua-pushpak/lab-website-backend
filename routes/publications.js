const express = require('express');
const router = express.Router();
const Publication = require('../models/Publication');

// GET all publications
router.get('/', async (req, res) => {
    try {
        const { category, year, featured } = req.query;
        let query = {};
        
        if (category) query.category = category;
        if (year) query.year = year;
        if (featured) query.featured = featured === 'true';
        
        const publications = await Publication.find(query)
            .sort({ year: -1, citations: -1 });
        
        res.json({
            success: true,
            count: publications.length,
            data: publications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching publications',
            error: error.message,
        });
    }
});

// GET single publication
router.get('/:id', async (req, res) => {
    try {
        const publication = await Publication.findById(req.params.id);
        
        if (!publication) {
            return res.status(404).json({
                success: false,
                message: 'Publication not found',
            });
        }
        
        res.json({
            success: true,
            data: publication,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching publication',
            error: error.message,
        });
    }
});

// POST create publication
router.post('/', async (req, res) => {
    try {
        const publication = await Publication.create(req.body);
        res.status(201).json({
            success: true,
            data: publication,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating publication',
            error: error.message,
        });
    }
});

// GET publication stats
router.get('/stats/summary', async (req, res) => {
    try {
        const stats = await Publication.aggregate([
            {
                $group: {
                    _id: null,
                    totalPublications: { $sum: 1 },
                    totalCitations: { $sum: '$citations' },
                    avgCitations: { $avg: '$citations' },
                },
            },
        ]);
        
        res.json({
            success: true,
            data: stats[0] || { totalPublications: 0, totalCitations: 0, avgCitations: 0 },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching stats',
            error: error.message,
        });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const publication = await Publication.findByIdAndDelete(req.params.id);
        
        if (!publication) {
            return res.status(404).json({
                success: false,
                message: 'Publication not found',
            });
        }
        
        res.json({
            success: true,
            message: 'Publication deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting publication',
            error: error.message,
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const publication = await Publication.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!publication) {
            return res.status(404).json({
                success: false,
                message: 'Publication not found',
            });
        }
        
        res.json({
            success: true,
            data: publication,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating publication',
            error: error.message,
        });
    }
});

router.patch('/:id/toggle-visibility', async (req, res) => {
    try {
        const publication = await Publication.findById(req.params.id);
        if (!publication) {
            return res.status(404).json({ success: false, message: 'Publication not found' });
        }
        publication.isVisible = !publication.isVisible;
        await publication.save();
        res.json({ success: true, data: publication });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;