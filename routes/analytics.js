const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');

router.post('/track', async (req, res) => {
    try {
        const { page, ip, userAgent, sessionDuration } = req.body;
        
        let analytics = await Analytics.findOne({ page, date: { $gte: new Date().setHours(0,0,0,0) } });
        
        if (!analytics) {
            analytics = new Analytics({ page, views: 0, uniqueVisitors: 0 });
        }
        
        analytics.views += 1;
        
        const visitorExists = analytics.visitors.some(v => v.ip === ip);
        if (!visitorExists) {
            analytics.uniqueVisitors += 1;
            analytics.visitors.push({ ip, userAgent, timestamp: new Date(), sessionDuration });
        }
        
        await analytics.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/stats', async (req, res) => {
    try {
        const { days = 7 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        const stats = await Analytics.find({ date: { $gte: startDate } });
        
        const pageViews = {};
        const dailyViews = {};
        const deviceStats = { desktop: 0, mobile: 0, tablet: 0 };
        const totalVisitors = new Set();
        
        stats.forEach(stat => {
            pageViews[stat.page] = stat.views;
            
            const dateKey = stat.date.toISOString().split('T')[0];
            dailyViews[dateKey] = (dailyViews[dateKey] || 0) + stat.views;
            
            stat.visitors.forEach(visitor => {
                totalVisitors.add(visitor.ip);
                
                if (visitor.userAgent.includes('Mobile')) {
                    deviceStats.mobile += 1;
                } else if (visitor.userAgent.includes('Tablet')) {
                    deviceStats.tablet += 1;
                } else {
                    deviceStats.desktop += 1;
                }
            });
        });
        
        res.json({
            success: true,
            data: {
                totalViews: Object.values(pageViews).reduce((a, b) => a + b, 0),
                totalUniqueVisitors: totalVisitors.size,
                pageViews,
                dailyViews,
                deviceStats,
                avgSessionDuration: stats.reduce((acc, s) => acc + s.avgTimeOnPage, 0) / (stats.length || 1),
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;