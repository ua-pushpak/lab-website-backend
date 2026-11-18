const express = require('express');
const router = express.Router();
const NewsArticle = require('../models/NewsArticle');

// GET all news articles
router.get('/', async (req, res) => {
    try {
        const { category, featured, limit } = req.query;
        let query = {};
        
        if (category) query.category = category;
        if (featured) query.featured = featured === 'true';
        
        let newsQuery = NewsArticle.find(query).sort({ date: -1 });
        
        if (limit) {
            newsQuery = newsQuery.limit(parseInt(limit));
        }
        
        const news = await newsQuery;
        
        res.json({
            success: true,
            count: news.length,
            data: news,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching news',
            error: error.message,
        });
    }
});

// GET single news article
router.get('/:id', async (req, res) => {
    try {
        const article = await NewsArticle.findById(req.params.id);
        
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found',
            });
        }
        
        res.json({
            success: true,
            data: article,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching article',
            error: error.message,
        });
    }
});

// POST create news article
router.post('/', async (req, res) => {
    try {
        const article = await NewsArticle.create(req.body);
        res.status(201).json({
            success: true,
            data: article,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating article',
            error: error.message,
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const article = await NewsArticle.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found',
            });
        }
        
        res.json({
            success: true,
            data: article,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating article',
            error: error.message,
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const article = await NewsArticle.findByIdAndDelete(req.params.id);
        
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found',
            });
        }
        
        res.json({
            success: true,
            message: 'Article deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting article',
            error: error.message,
        });
    }
});

router.patch('/:id/toggle-visibility', async (req, res) => {
    try {
        const article = await NewsArticle.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }
        article.isVisible = !article.isVisible;
        await article.save();
        res.json({ success: true, data: article });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



module.exports = router;